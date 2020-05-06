import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'gs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Output() scrolledToBottom = new EventEmitter();
  @Input() isAllDataLoaded: boolean;
  @ViewChild('list') list: ElementRef;

  get scrollTop() {
    if (this.list) {
      return this.list.nativeElement.scrollTop;
    } else {
      return 0;
    }
  }

  set scrollTop(scrollTop: number) {
    if (this.list) {
      this.list.nativeElement.scrollTop = scrollTop;
    }
  }

  constructor() { }

  ngOnInit() {
  }

  scrollToTop() {
    if (this.list) {
      this.list.nativeElement.scrollTop = 0;
    }
  }

}
