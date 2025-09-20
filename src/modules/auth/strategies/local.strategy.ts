import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import * as bcrypt from "bcryptjs"
import { User, UserDocument } from "../../../schemas/user.schema"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({ usernameField: "email" })
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select("+password")
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject()
      return result
    }
    throw new UnauthorizedException()
  }
}
