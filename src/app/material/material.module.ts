import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const MATERIAL_MODULES = [
  MatToolbarModule,
  MatIconModule,
  MatGridListModule,
  MatCardModule,
  MatButtonModule,
  MatChipsModule,
  MatBadgeModule,
  MatMenuModule,
  MatExpansionModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatStepperModule,
  MatSnackBarModule,
  MatListModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSlideToggleModule
];

@NgModule({
  declarations: [],
  exports: [...MATERIAL_MODULES]
})
export class MaterialModule { }
