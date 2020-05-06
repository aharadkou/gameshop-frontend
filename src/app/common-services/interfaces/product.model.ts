import { Category } from './category.model';

export interface Product {
    id?: number;
    imageUrl?: string;
    title: string;
    categories: Category[] | number[];
    description: string;
    price: number;
}
