import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, ValidationErrors } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Category } from 'src/app/common-services/interfaces/category.model';
import { CategoryService } from 'src/app/common-services/services/category.service';
import { BehaviorSubject } from 'rxjs';
import { REACTIVE_SEARCH_DEBOUCE, REACTIVE_SEARCH_MIN_LENGTH } from 'src/app/common-services/constants/constants';

@Component({
  selector: 'gs-category-input',
  templateUrl: './category-input.component.html',
  styleUrls: ['./category-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CategoryInputComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CategoryInputComponent,
      multi: true
    }
  ]
})
export class CategoryInputComponent implements OnInit, ControlValueAccessor {

  @Input() placeholder = '';

  showPlaceholder = true;

  constructor(private elementRef: ElementRef, private categoryService: CategoryService) { }

  filterControl: FormControl;

  selectedCategories: Category[];

  suitableCategoriesSubject = new BehaviorSubject([]);

  suitableCategories = this.suitableCategoriesSubject.asObservable();

  addFirstSuitable(event: any) {
    if (this.suitableCategoriesSubject.getValue()[0]) {
      this.selectCategory(this.suitableCategoriesSubject.getValue()[0]);
    }
    event.preventDefault();
  }

  removeLastSelected() {
    if (!this.filterControl.value && this.selectedCategories && this.selectedCategories.length > 0) {
      const selectedWithoutLast = this.selectedCategories.slice();
      selectedWithoutLast.pop();
      this.selectedCategories = selectedWithoutLast;
      this.updateValue(this.selectedCategories);
    }
  }

  ngOnInit() {
    this.filterControl = new FormControl('');
    this.filterControl.valueChanges.pipe(
      filter((filterValue: string) => {
        const isBlank = filterValue.trim().length < REACTIVE_SEARCH_MIN_LENGTH;
        if (isBlank) {
          this.suitableCategoriesSubject.next([]);
        }
        return !isBlank;
      }),
      debounceTime(REACTIVE_SEARCH_DEBOUCE)
    ).subscribe(
      (filterValue: string) => {
        this.categoryService.getCategories(filterValue, this.selectedCategories.map(category => category.id)).subscribe(
          categories => this.suitableCategoriesSubject.next(categories)
        );
      }
    );
  }

  validate({ value }: FormControl): ValidationErrors {
    if (this.selectedCategories.length < 1) {
      return {
        minCategories: { value }
      };
    }
  }

  setFocusOnInput() {
    this.elementRef.nativeElement.querySelector('.filter-input').focus();
  }

  writeValue(selectedCategories: Category[]) {
    this.selectedCategories = selectedCategories;
  }

  updateValue(selectedCategories: Category[]) {
    this.selectedCategories = selectedCategories;
    this.onChange(selectedCategories);
  }

  onChange(selectedCategories: Category[]) { }

  onTouched() { }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  removeCategory(id: number) {
    this.updateValue(this.selectedCategories.filter(category => category.id !== id));
  }

  selectCategory(category: Category) {
    this.updateValue(this.selectedCategories.concat(category));
    this.filterControl.setValue('');
  }

}
