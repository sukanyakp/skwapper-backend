import { Document, Model } from "mongoose";
import { IBaseRepository } from "../Interfaces/IbaseRepository";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const created = new this.model(data);
      return await created.save();
    } catch (err) {
      console.error("Error while saving document:", err);
      throw err;
    }
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ email } as any); 
  }

  async findByRole(role: string): Promise<T[]> {
    return this.model.find({ role } as any);
  }

  async findAll(filter = {}, projection = ""): Promise<T[]> {
    return this.model.find(filter, projection);
  }

  async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateData, { new: true });
  }


    async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

    async findOneByField(field: keyof T, value: any): Promise<T | null> {
    return this.model.findOne({ [field]: value } as any);
  }

}
