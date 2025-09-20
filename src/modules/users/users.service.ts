import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { User, type UserDocument } from "../../schemas/user.schema"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import * as bcrypt from "bcryptjs"

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12)
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    })
    return user.save()
  }

  async findAll(outletId?: string): Promise<User[]> {
    const filter = outletId ? { outletId } : {}
    return this.userModel.find(filter).populate("outletId").exec()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate("outletId").exec()
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12)
    }

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec()
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException("User not found")
    }
  }
}
