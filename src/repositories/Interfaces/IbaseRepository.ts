export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findByEmail(email: string): Promise<T | null>;
  findByRole(role: string): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findAll(filter?: Partial<T>, projection?: string): Promise<T[]>; // method takes two optional parameters. 
  // User.find({}, "-password") // Exclude password field
  // Promise<T[]> : The method returns a Promise that resolves to an array of documents of type T.

  updateById(id: string, updateData: Partial<T>): Promise<T | null>;
  findOneByField(field: keyof T, value: any): Promise<T | null> 
  deleteById(id: string): Promise<T | null>
}
