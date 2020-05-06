import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FilterOption } from 'src/app/common-services/interfaces/filter-option.model';
import { SortCriteria } from 'src/app/common-services/interfaces/sort-criteria.model';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { SortOrder } from 'src/app/common-services/models/sort-order.enum';
import { REACTIVE_SEARCH_MIN_LENGTH, REACTIVE_SEARCH_DEBOUCE } from 'src/app/common-services/constants/constants';

@Component({
  selector: 'gs-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit, OnChanges {

  @Input() searchPlaceholder: string;
  @Input() filterPlaceholder: string;
  @Input() search = '';
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() filterOptions: FilterOption[] = [];
  @Input() filter: number;
  @Output() filterChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() sortCriterias: SortCriteria[] = [];
  @Output() sortCriteriasChange: EventEmitter<SortCriteria[]> = new EventEmitter<SortCriteria[]>();
  sortOrder = SortOrder;
  searchControl: FormControl;

  get searchValue() {
    return this.searchControl.value;
  }

  constructor() {
  }

  ngOnInit() {
    this.searchControl = new FormControl(this.search);
    this.searchControl.valueChanges.pipe(
      debounceTime(REACTIVE_SEARCH_DEBOUCE),
      filter((searchValue: string) => {
        const searchLength = searchValue.trim().length;
        return searchLength >= REACTIVE_SEARCH_MIN_LENGTH || searchLength === 0;
      })
    ).subscribe(
      searchValue => this.searchChange.emit(searchValue)
    );
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.searchControl && simpleChanges.search) {
      this.searchControl.setValue(this.search, {emitEvent: false});
    }
  }

  sortCriterasChanged(field: string, order: SortOrder) {
    const newOrder = order === SortOrder.NONE ? SortOrder.ASC : order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    const changedCriteria = this.sortCriterias.find(criteria => criteria.fieldName === field);
    changedCriteria.order = newOrder;
    this.sortCriterias.forEach(criteria => {
      if (criteria.fieldName !== field) {
        criteria.order = SortOrder.NONE;
      }
    });
    this.sortCriteriasChange.emit(this.sortCriterias);
  }

}
