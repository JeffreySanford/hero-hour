const [url, timeoutArg = '30000', intervalArg = '500'] = process.argv.slice(2);

if (!url) {
  console.error('Usage: node scripts/wait-for-http.mjs <url> [timeoutMs] [intervalMs]');
  process.exit(1);
}

const timeoutMs = Number(timeoutArg);
const intervalMs = Number(intervalArg);
const deadline = Date.now() + timeoutMs;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForHttp() {
  let lastError = 'no response yet';

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`HTTP ready: ${url}`);
        return;
      }
      lastError = `status ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await sleep(intervalMs);
  }

  console.error(`Timed out waiting for ${url}: ${lastError}`);
  process.exit(1);
}

await waitForHttp();
