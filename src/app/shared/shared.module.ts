import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ToolsComponent } from './tools/tools.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { EllipsisModule } from 'ngx-ellipsis';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ErrorComponent } from './error/error.component';

const COMMON_COMPONENTS = [
  HeaderComponent,
  ToolsComponent,
  ListComponent
];

const COMMON_MODULES = [
  CommonModule,
  MaterialModule,
  PerfectScrollbarModule,
  HttpClientModule,
  EllipsisModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  InfiniteScrollModule,
  NgScrollbarModule
];

@NgModule({
  declarations: [...COMMON_COMPONENTS, ErrorComponent],
  imports: [...COMMON_MODULES],
  exports: [...COMMON_COMPONENTS, ...COMMON_MODULES]
})
export class SharedModule { }
