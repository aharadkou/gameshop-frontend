import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FilterOption } from 'src/app/common-services/interfaces/filter-option.model';
import { MatSelectChange } from '@angular/material/select';
import { SortCriteria } from 'src/app/common-services/interfaces/sort-criteria.model';
import { SortOrder } from 'src/app/common-services/enums/sort-order.enum';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'gs-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit, OnChanges {

  @Input() searchPlaceholder: string;
  @Input() filterPlaceholder: string;
  @Input() filterOptions: FilterOption[] = [];
  @Input() sortCriterias: SortCriteria[] = [];
  @Output() filterChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
  @Output() sortChange: EventEmitter<SortCriteria[]> = new EventEmitter<SortCriteria[]>();
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  sortOrder = SortOrder;
  searchControl: FormControl;
  selectedFilter: FilterOption;

  get searchValue() {
    return this.searchControl.value;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges.pipe(
      debounceTime(700),
      filter((searchValue: string) => {
        const searchLength = searchValue.trim().length;
        return searchLength >= 2 || searchLength === 0;
      })
    ).subscribe(
      searchValue => this.searchChange.emit(searchValue)
    );
  }

  clearSearch() {
    this.searchControl.setValue('');
  }


  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.filterOptions) {
      if (this.filterOptions && this.filterOptions[0]) {
        this.selectedFilter = this.filterOptions[0].value;
      }
    }
  }

  sortChanged(field: string, order: SortOrder) {
    const newOrder = order === SortOrder.NONE ? SortOrder.ASC : order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    const changedCriteria = this.sortCriterias.find(criteria => criteria.fieldName === field);
    changedCriteria.order = newOrder;
    this.sortCriterias.forEach(criteria => {
      if (criteria.fieldName !== field) {
        criteria.order = SortOrder.NONE;
      }
    });
    this.sortChange.emit(this.sortCriterias);
  }

}
