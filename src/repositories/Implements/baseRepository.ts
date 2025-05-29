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
    const result = await created.save();
    return result;
  } catch (err) {
    console.error('Error while saving document:', err);
    throw err;
  }
}

}
 