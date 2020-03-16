import { PaginationRequestParams } from './pagination-request-params.model';

export interface GameRequestParams extends PaginationRequestParams {
  categories?: number[];
}
