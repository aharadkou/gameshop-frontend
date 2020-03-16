import { SortOrder } from '../enums/sort-order.enum';

export interface SortCriteria {
  fieldName: string;
  fieldText: string;
  order: SortOrder;
}
