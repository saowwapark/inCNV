import { IndividualProcessComponent } from './individual-process/individual-process.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IndividualConfigureComponent } from './individual-configure/individual-configure.component';
import { MultipleConfigureComponent } from './multiple-configure/multiple-configure.component';
import { ChooseSamplesetResolver } from './shared/analysis-configure/choose-sampleset/choose-sampleset.resolver';
import { MultipleProcessComponent } from './multiple-process/multiple-process.component';

const routes: Routes = [
  {
    path: 'individual-sample',
    component: IndividualConfigureComponent,
    resolve: { samplesets: ChooseSamplesetResolver }
  },
  {
    path: 'multiple-sample',
    component: MultipleConfigureComponent,
    resolve: { samplesets: ChooseSamplesetResolver }
  },
  {
    path: 'individual-sample/analysis-process',
    component: IndividualProcessComponent
  },
  {
    path: 'multiple-sample/analysis-process',
    component: MultipleProcessComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule {}
