import { SortCriteria } from './sort-criteria.model';

export interface PaginationRequestParams {
  page?: number;
  limit?: number;
  sort?: SortCriteria[];
  filter?: string;
}
