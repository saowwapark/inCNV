import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SamplesetComponent } from './sampleset.component';
import { SamplesetResolver } from './sampleset.resolver';

const routes: Routes = [
  {
    path: '',
    component: SamplesetComponent,
    resolve: { samplesets: SamplesetResolver }
  },
  {
    path: 'sampleset/:id',
    component: SamplesetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamplesetRoutingModule {}
