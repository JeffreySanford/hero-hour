#!/usr/bin/env bash
set -euo pipefail

compose_files=("-f" "docker-compose.redis.yml" "-f" "docker-compose.teklif.yml")

check_health() {
  local name=$1
  local status
  status=$(docker inspect --format='{{.State.Health.Status}}' "$name" 2>/dev/null || echo "none")
  echo "$name health status: $status"
  case "$status" in
    healthy)
      return 0
      ;;
    starting)
      return 1
      ;;
    unhealthy|none)
      return 2
      ;;
    *)
      return 3
      ;;
  esac
}

ensure_service() {
  local service=$1
  local container=$2
  local waiting=0

  while true; do
    if ! docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
      echo "${container} is not running. Starting container..."
      docker compose "${compose_files[@]}" up -d "$service"
    fi

    check_health "$container" && break
    status=$?
    if [ "$status" -eq 2 ]; then
      echo "${container} unhealthy. Restarting..."
      docker restart "$container"
      sleep 3
    elif [ "$status" -eq 1 ]; then
      echo "${container} is starting..."
      sleep 2
    else
      echo "${container} has unknown health status; re-creating container..."
      docker compose "${compose_files[@]}" up -d --force-recreate "$service"
      sleep 2
    fi

    waiting=$((waiting + 1))
    if [ "$waiting" -gt 12 ]; then
      echo "Timeout waiting for $container health" >&2
      exit 1
    fi
  done
}

# Ensure Redis + teklif are up and healthy.

docker compose "${compose_files[@]}" up -d --no-recreate hero-redis hero-teklif

ensure_service hero-redis hero-redis
ensure_service hero-teklif hero-teklif

# Seed Redis with known signal data before relying on it.
# This is a soft initialization, not overriding existing keys unless empty.
if docker exec hero-redis redis-cli -n 0 EXISTS "teklif:ready" | grep -q "0"; then
  echo "Seeding hero-redis with teklif readiness key"
  docker exec hero-redis redis-cli -n 0 SET "teklif:ready" "1"
  docker exec hero-redis redis-cli -n 0 SET "teklif:version" "1"
  docker exec hero-redis redis-cli -n 0 SET "teklif:last-start" "$(date --utc +%Y-%m-%dT%H:%M:%SZ)"
else
  echo "teklif:ready key already set"
fi

# Also seed app configuration if missing
if docker exec hero-redis redis-cli -n 0 EXISTS "app:settings" | grep -q "0"; then
  docker exec hero-redis redis-cli -n 0 HSET "app:settings" "feature.teklif" "on" "session.ttl" "604800"
fi

# Verify seed values
redis_status="$(docker exec hero-redis redis-cli -n 0 GET "teklif:ready")"
if [ "$redis_status" != "1" ]; then
  echo "Failed to seed hero-redis with teklif key" >&2
  exit 1
fi

echo "Docker setup confirmed: hero-redis and hero-teklif healthy and seeded."