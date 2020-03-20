import { Product } from './product.model';

export interface Order {
  id?: number;
  name: string;
  email: string;
  phone: string;
  comment?: string;
  date?: Date;
  isProcessed?: boolean;
  cartItems?: {game: Product, count: number}[];
}
