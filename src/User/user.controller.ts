import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login.dto'
import { UserResponceInterface } from './types/userResponce.interface'
// import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { Request } from '@nestjs/common'

@Controller()
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body('user') createUserDto: CreateUserDto,
    ): Promise<UserResponceInterface> {
        const user = await this._userService.createUser(createUserDto)
        return this._userService.buildUserResponce(user)
    }

    @Post('users/login')
    @UsePipes(new ValidationPipe())
    async login(@Body('user') loginUserDto: LoginUserDto ): Promise<UserResponceInterface>{
      const user = await this._userService.login(loginUserDto)
      return this._userService.buildUserResponce(user)
    }

    @Get('user')
    async currentUser(@Req() request: Request): Promise<UserResponceInterface> {
      console.log('request', request)
      return 'currentUser' as any
    }
}
