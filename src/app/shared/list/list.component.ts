import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'gs-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Output() scrolledToBottom = new EventEmitter();
  @Input() isAllDataLoaded: boolean;
  @ViewChild('scroll') scrollbar: PerfectScrollbarDirective;


  constructor() { }

  ngOnInit(): void {
  }

  scrollToTop() {
    if (this.scrollbar) {
      this.scrollbar.scrollToTop();
    }
  }

}
