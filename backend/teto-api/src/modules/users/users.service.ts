import { Injectable, ConflictException} from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto) {
        // Verificar se usuario ja existe
        const userExists = await this.usersRepository.findByEmail(createUserDto.email);
        if (userExists) {
            throw new ConflictException('Email already exists');
        }

        // Hah da Senhaa
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(createUserDto.password, salt);
        const { password, ...userData } = createUserDto;
        const dataToSave = {
            ...userData,
            passwordHash,
        };
        const newUser = await this.usersRepository.create(dataToSave);
        const { passwordHash:_, ...result} = newUser;
        return result;
    }

    async findByEmail(email: string){
        return this.usersRepository.findByEmail(email);
    }




}