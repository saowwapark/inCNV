import { GrchPipe } from './../utils/grch.pipe';
import { UnmaskNumericDirective } from './directives/unmask-numeric.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectedBarComponent } from './../shared/components/selected-bar/selected-bar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilteredSelectComponent } from './components/filtered-select/filtered-select.component';
import { NotAvailablePipe } from '../utils/not-available.pipe';
import { LoadingComponent } from './loading/loading.component';
import { MessagesComponent } from './components/messages/messages.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { SearchService } from './components/search/search.service';
import { MessagesService } from './components/messages/messages.service';

@NgModule({
  declarations: [
    HeaderComponent,
    SearchComponent,
    LoadingComponent,
    MessagesComponent,
    SelectedBarComponent,
    FilteredSelectComponent,
    UnmaskNumericDirective,
    GrchPipe,
    NotAvailablePipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  exports: [
    SearchComponent,
    HeaderComponent,
    LoadingComponent,
    MessagesComponent,
    SelectedBarComponent,
    FilteredSelectComponent,
    UnmaskNumericDirective,
    GrchPipe,
    NotAvailablePipe,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [SearchService, MessagesService]
})
export class SharedModule {}
