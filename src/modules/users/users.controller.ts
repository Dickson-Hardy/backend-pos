import { Controller, Get, Post, Body, Patch, Put, Param, Delete, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiQuery({ name: "outletId", required: false })
  findAll(@Query("outletId") outletId?: string) {
    return this.usersService.findAll(outletId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id)
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update user" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user (PUT method)" })
  updatePut(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete user" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id)
  }
}