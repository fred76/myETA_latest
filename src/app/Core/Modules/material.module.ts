import { NgModule } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider'
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { ScrollingModule } from '@angular/cdk/scrolling'; 


let p: any[] = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatTabsModule,
  MatGridListModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatSidenavModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule,
  MatTableModule,
  MatSortModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatChipsModule,
  MatMenuModule,
  MatCheckboxModule,
  MatStepperModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSlideToggleModule,
  ScrollingModule, 
  // MatAutocompleteModule
  // MatSelectModule,
  // MatChipsModule,
  // MatCheckboxModule,
  // MatSidenavModule,
  // MatListModule,
  // MatCardModule,
  // MatTableModule,
  // MatSortModule,
  // MatPaginatorModule,
  // MatSnackBarModule


]
@NgModule({
  imports: p,
  exports: p
})

export class MaterialModule {

}
