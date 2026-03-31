import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
		remove(id: string) {
			const user = this.findById(id);
			this.users.delete(id);
			return user;
		}
	private users: Map<string, any> = new Map();

	async create(user: { email: string; username: string; password: string; profile?: any; roles?: string[] }) {
		// Check for duplicate email/username
		for (const u of this.users.values()) {
			if (u.email === user.email || u.username === user.username) {
				throw new Error('Duplicate email or username');
			}
		}
		const id = Math.random().toString(36).substring(2, 10);
		const newUser = { ...user, id, active: true };
		this.users.set(id, newUser);
		return newUser;
	}

	async findById(id: string) {
		const user = this.users.get(id);
		if (!user) throw new Error('User not found');
		return user;
	}

	async findByEmail(email: string) {
		for (const user of this.users.values()) {
			if (user.email === email) return user;
		}
		throw new Error('User not found');
	}

	async findByUsername(username: string) {
		for (const user of this.users.values()) {
			if (user.username === username) return user;
		}
		throw new Error('User not found');
	}

	async update(id: string, updates: any) {
		const user = await this.findById(id);
		// Prevent update of protected fields
		if ('email' in updates || 'password' in updates) {
			throw new Error('Update of protected fields not allowed');
		}
		if ('username' in updates) {
			user.username = updates.username;
		}
		user.profile = { ...user.profile, ...updates };
		return user;
	}

	async deactivate(id: string) {
		const user = await this.findById(id);
		user.active = false;
		return user;
	}
}
