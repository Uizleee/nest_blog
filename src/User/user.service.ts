
import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from 'src/config/config'
import { UserResponceInterface } from './types/userResponce.interface'
import { LoginUserDto } from './dto/login.dto'
import { compare } from 'bcrypt'






@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private _userRepository: Repository<User>) { 
}
async createUser(createUserDto: CreateUserDto):Promise<User> {
  const userByLogin = await this._userRepository.findOne({
    userName: createUserDto.userName
  })
  if(userByLogin){
    throw new HttpException('Login занят', 422)
  }
  const newUser = new User
  Object.assign(newUser, createUserDto)
  return await this._userRepository.save(newUser)
}


async login(loginUserDto: LoginUserDto):Promise<User>{
  const user = await this._userRepository.findOne({
    userName: loginUserDto.userName,
  },
  { select: ['id','userName','password'] })

  if(!user){
    throw new HttpException('Пользователь не найден', 422)
  }
  const isPasswordCorrect = await compare(
    loginUserDto.password,
    user.password
  )
  if(!isPasswordCorrect){
    throw new HttpException('Неправильный пароль', 422);
  }


  return user
}


generateJwt(user: User): string {
  return sign({
    id: user.id,
    userName: user.userName
  }, JWT_SECRET)
}

buildUserResponce(user: User): UserResponceInterface{
  return{
    user: {
      ...user,
      token: this.generateJwt(user)
    }
  }
}

}

