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
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ImagePlaceholderPipe } from '../common-services/pipes/image-placeholder.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { TrimValueAccessorModule } from 'ng-trim-value-accessor';

const COMMON_COMPONENTS = [
  HeaderComponent,
  ToolsComponent,
  ListComponent,
  ImagePlaceholderPipe
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
  NgScrollbarModule,
  MaterialFileInputModule,
  MatTooltipModule,
  TrimValueAccessorModule
];

@NgModule({
  declarations: [...COMMON_COMPONENTS, ErrorComponent, ConfirmDialogComponent],
  imports: [...COMMON_MODULES],
  exports: [...COMMON_COMPONENTS, ...COMMON_MODULES]
})
export class SharedModule { }
