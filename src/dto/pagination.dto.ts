export interface PaginatedResult<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
}
