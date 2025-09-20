import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { Outlet, type OutletDocument } from "../../schemas/outlet.schema"
import type { CreateOutletDto } from "./dto/create-outlet.dto"
import type { UpdateOutletDto } from "./dto/update-outlet.dto"

@Injectable()
export class OutletsService {
  constructor(@InjectModel(Outlet.name) private outletModel: Model<OutletDocument>) {}

  async create(createOutletDto: CreateOutletDto): Promise<Outlet> {
    const outlet = new this.outletModel(createOutletDto)
    return outlet.save()
  }

  async findAll(): Promise<Outlet[]> {
    return this.outletModel.find().populate("managerId").exec()
  }

  async findOne(id: string): Promise<Outlet> {
    const outlet = await this.outletModel.findById(id).populate("managerId").exec()
    if (!outlet) {
      throw new NotFoundException("Outlet not found")
    }
    return outlet
  }

  async update(id: string, updateOutletDto: UpdateOutletDto): Promise<Outlet> {
    const outlet = await this.outletModel.findByIdAndUpdate(id, updateOutletDto, { new: true }).exec()
    if (!outlet) {
      throw new NotFoundException("Outlet not found")
    }
    return outlet
  }

  async remove(id: string): Promise<void> {
    const result = await this.outletModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException("Outlet not found")
    }
  }
}
