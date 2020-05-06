import { SortOrder } from '../models/sort-order.enum';

export interface SortCriteria {
  fieldName: string;
  fieldText: string;
  order: SortOrder;
}
