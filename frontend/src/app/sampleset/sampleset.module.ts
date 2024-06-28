import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { SamplesetRoutingModule } from './sampleset-routing.module';
import { SamplesetComponent } from './sampleset.component';
import { SamplesetFormDialogComponent } from './sampleset-form-dialog/sampleset-form-dialog.component';
import { SamplesetListComponent } from './sampleset-list/sampleset-list.component';
import { SamplesetResolver } from './sampleset.resolver';

@NgModule({
  declarations: [
    SamplesetComponent,
    SamplesetFormDialogComponent,
    SamplesetListComponent
  ],
  imports: [ReactiveFormsModule, SharedModule, SamplesetRoutingModule],
  providers: [SamplesetResolver],
  entryComponents: [SamplesetFormDialogComponent]
})
export class SamplesetModule {
  constructor() {
    console.log('SamplesetModule loaded.');
  }
}
