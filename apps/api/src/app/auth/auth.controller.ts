import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterDto) {
		// Could add more response shaping here if needed
		return this.authService.register(dto);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(@Body() dto: RefreshTokenDto) {
		return this.authService.refresh(dto);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Body() req: { headers?: { authorization?: string } }) {
		const token = req?.headers?.authorization?.split(' ')[1];
		if (token) {
			await this.authService.logout(token);
		}
		return { success: true };
	}
}
