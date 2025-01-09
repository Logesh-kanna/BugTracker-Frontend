import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';

const Materials = [
  MatSidenavModule,
  MatButtonModule,
  MatTableModule,
  MatPaginatorModule,
  MatInputModule,
  MatTabsModule,
  MatCardModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatDialogModule,
  MatRadioModule,
  MatMenuModule,
  MatIconModule,
  MatSortModule,
  MatSelectModule
]

@NgModule({
  imports: [Materials],
  exports: [Materials]
})
export class MaterialModule { }
