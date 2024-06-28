import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyFileComponent } from './my-file.component';
import { CnvFileDetailComponent } from '../cnv-file-detail/cnv-file-detail.component';
const routes: Routes = [
  {
    path: '',
    component: MyFileComponent
  },
  {
    path: 'reformat/:id',
    component: CnvFileDetailComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyFileRoutingModule {}
