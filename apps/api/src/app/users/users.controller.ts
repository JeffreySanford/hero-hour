import { Controller, Post, Get, Patch, Body, Param, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    if (!dto.email || !dto.username || !dto.password) {
      throw new BadRequestException('Missing required fields');
    }
    return this.usersService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Missing id');
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    if (dto.roles && dto.roles.some((r: string) => !['user', 'admin', 'hero'].includes(r))) {
      throw new BadRequestException('Invalid role enum');
    }
    return this.usersService.update(id, dto);
  }

  @Patch('remove/:id')
  async remove(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    if (!email) throw new BadRequestException('Missing email');
    return this.usersService.findByEmail(email);
  }
}
