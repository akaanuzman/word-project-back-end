import { Body, Controller, Get, Param, Put } from '@nestjs/common';
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

  @ApiOperation({
    summary: 'Update user level',
    description: 'Updates the level of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User level updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Put(':id/level')
  async updateUserLevel(
    @Param('id') id: string,
    @Body() level: number,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserLevel(id, level);
  }

  @ApiOperation({
    summary: 'Update user xp',
    description: 'Updates the xp of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User xp updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Put(':id/xp')
  async updateUserXp(
    @Param('id') id: string,
    @Body() xp: number,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserXp(id, xp);
  }

  @ApiOperation({
    summary: 'Update user coins',
    description: 'Updates the coins of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User coins updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Put(':id/coins')
  async updateUserCoins(
    @Param('id') id: string,
    @Body() coins: number,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserCoins(id, coins);
  }

  @ApiOperation({
    summary: 'Update user streak',
    description: 'Updates the streak of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User streak updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Put(':id/streak')
  async updateUserStreak(
    @Param('id') id: string,
    @Body() streak: number,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserStreak(id, streak);
  }

  @ApiOperation({
    summary: 'Update user is premium',
    description: 'Updates the is premium of a user',
  })
  @ApiResponse({
    status: 200,
    description: 'User is premium updated',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Put(':id/is-premium')
  async updateUserIsPremium(
    @Param('id') id: string,
    @Body() isPremium: boolean,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUserIsPremium(id, isPremium);
  }
}
