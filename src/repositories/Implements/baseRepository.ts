import { Document, Model } from "mongoose";
import { IBaseRepository } from "../Interfaces/IbaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  async create(data: T): Promise<T> {
    const created = await this.model.create(data);
    return created;
  }


}
