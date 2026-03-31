import { Injectable } from '@nestjs/common';

@Injectable()
export class LifeProfileService {
	private profiles: Map<string, any> = new Map();

	create(userId: string, data: any) {
		if (this.profiles.has(userId)) {
			throw new Error('Profile already exists');
		}
		const profile = {
			userId,
			roles: data.roles || [],
			schedule: data.schedule || {},
			priorities: data.priorities || [],
			frictionPoints: data.frictionPoints || [],
			habitAnchors: data.habitAnchors || [],
		};
		this.profiles.set(userId, profile);
		return profile;
	}

	updateRoles(userId: string, roles: string[]) {
		const profile = this.getProfile(userId);
		profile.roles = roles;
		return profile;
	}

	updateSchedule(userId: string, schedule: any) {
		const profile = this.getProfile(userId);
		profile.schedule = schedule;
		return profile;
	}

	updatePriorities(userId: string, priorities: string[]) {
		const profile = this.getProfile(userId);
		profile.priorities = priorities;
		return profile;
	}

	updateFrictionPoints(userId: string, frictionPoints: string[]) {
		const profile = this.getProfile(userId);
		profile.frictionPoints = frictionPoints;
		return profile;
	}

	saveHabitAnchors(userId: string, anchors: string[]) {
		const profile = this.getProfile(userId);
		profile.habitAnchors = anchors;
		return profile;
	}

	getProfile(userId: string) {
		const profile = this.profiles.get(userId);
		if (!profile) throw new Error('Profile not found');
		return profile;
	}
}
