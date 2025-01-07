import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { hash, compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { RegisterResponse } from '../core/auth/responses/auth.responses';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}


  async create({ email, password, name, role }: CreateUserDto): Promise<RegisterResponse> {
    try {
      const user = await this.findByEmail(email);
  
      if (user)
        throw new BadRequestException("Email already in use");
      
  
      const hashedPassword = await hash(
        `${password.trim().replace(/\s+/g, '')}`,
        10
      );
  
      await this._userRepository.save({
        name,
        email,
        role,
        password: hashedPassword,
      });
  
      return {
        message: "User created successfully",
      };
    } catch (error) {
      throw error;    
    }
       
  }

  async findAll() {
    return await this._userRepository.find();
  }

  async findByEmail(email: string) {
    return await this._userRepository.findOne({ 
      where: { 
        email 
      }
    });
  }

  async findOne(id: number) {
    try {
      const user = await this._userRepository.findOne({ 
        where: { 
          id 
        }
      });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {      
      const user = await this.findOne(id);
  
      if (!user) throw new NotFoundException();

      if (updateUserDto.password) {
        const isDifferent = !(await compare(updateUserDto.password, user.password));
  
        if (isDifferent) {
          updateUserDto.password = await hash(updateUserDto.password, 10);
        } else {
          delete updateUserDto.password;
        }
      }
  
      const modifiedUser = Object.assign(user, updateUserDto);
  
      await this._userRepository.save(modifiedUser);
  
      return await this.findByEmail(user.email);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {      
      const user = await this.findOne(id);

      if (!user) throw new NotFoundException('User not found');

      await this._userRepository.softDelete(user.id)

      return 'User successfully deleted'
    } catch(error) {
      throw error;
    }
  }
}
