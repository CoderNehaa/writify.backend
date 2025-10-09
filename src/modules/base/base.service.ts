import { ClientSession, Document, Model } from "mongoose";

export abstract class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const newItem = new this.model(data);
    await newItem.save();
    return newItem;
  }

  async getOne(property: Object, session?: ClientSession): Promise<T | null> {
    const result = session
      ? await this.model.findOne(property).session(session)
      : await this.model.findOne(property);
    return result;
  }

  async getAll(): Promise<Array<T>> {
    return await this.model.find();
  }

  async getById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async updateById(
    id: string,
    updateBody: Partial<T>,
    session?: ClientSession
  ): Promise<T | null> {
    const data = session
      ? await this.model
          .findOneAndUpdate({ _id: id }, updateBody, { new: true })
          .session(session)
      : await this.model.findOneAndUpdate({ _id: id }, updateBody, {
          new: true,
        });
    return data;
  }

  async deleteById(id: string, session?: ClientSession): Promise<T | null> {
    const data = session
      ? await this.model.findByIdAndDelete(id).session(session)
      : await this.model.findByIdAndDelete(id);
    return data;
  }

  async softDeleteById(id: string, session?: ClientSession): Promise<T | null> {
    const data = session
      ? await this.model
          .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
          .session(session)
      : await this.model.findByIdAndUpdate(
          id,
          { isDeleted: true },
          { new: true }
        );
    return data;
  }
}
