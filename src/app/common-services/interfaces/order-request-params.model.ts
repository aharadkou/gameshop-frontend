import { PaginationRequestParams } from './pagination-request-params.model';

export interface OrderRequestParams extends PaginationRequestParams {
  processedStatus?: boolean;
}
