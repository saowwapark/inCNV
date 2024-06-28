import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabFileMappingComponent } from './tab-file-mapping.component';
import { TabFileMappingService } from './tab-file-mapping.service';

const routes: Routes = [
  {
    path: '',
    component: TabFileMappingComponent,
    resolve: { tabFileMappings: TabFileMappingService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabFileMappingRoutingModule {}
