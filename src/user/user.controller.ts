import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDTO } from './DTOs/users.response';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all users',
    type: [UserResponseDTO],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid email or password',
  })
  @Get()
  async getUsers(): Promise<UserResponseDTO[]> {
    return this.userService.getUsers();
  }

  @ApiOperation({
    summary: 'Get user by id',
    description: 'Returns a user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a user by id',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDTO> {
    return this.userService.getUserById(id);
  }
}
