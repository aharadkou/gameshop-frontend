import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category.model';
import { CATEGORIES_URL } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(filter = '', selectedIds: number[] = []): Observable<Category[]> {
    let params = new HttpParams();
    params = params.set('filter', filter);
    selectedIds.forEach(selectedId =>
      params = params.append('selectedIds[]', selectedId.toString())
    );
    return this.http.get<Category[]>(CATEGORIES_URL, {params});
  }
}
