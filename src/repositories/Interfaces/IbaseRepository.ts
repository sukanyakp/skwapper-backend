

export interface IBaseRepository<T> {
  create(data: T): Promise<T>;
  // Add other common methods like findById, findAll, etc.
}
