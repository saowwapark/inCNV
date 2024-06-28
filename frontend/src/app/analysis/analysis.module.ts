import { AnalysisComponent } from './analysis.component';
import { IndividualProcessComponent } from './individual-process/individual-process.component';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { IndividualConfigureComponent } from './individual-configure/individual-configure.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AnalysisResultComponent } from './analysis-result/analysis-result.component';
import { MultipleConfigureComponent } from './multiple-configure/multiple-configure.component';
import { ChooseSamplesetComponent } from './shared/analysis-configure/choose-sampleset/choose-sampleset.component';
import { ChooseOneSampleComponent } from './shared/analysis-configure/choose-one-sample/choose-one-sample.component';
import { ChooseManyFileComponent } from './shared/analysis-configure/choose-many-file/choose-many-file.component';
import { MainChartComponent } from './shared/analysis-process/main-chart/main-chart.component';
import { AnnotationDialogComponent } from './shared/analysis-process/annotation-dialog/annotation-dialog.component';
import { OverviewChartComponent } from './shared/analysis-process/overview-chart/overview-chart.component';
import { SelectedCnvComponent } from './shared/analysis-process/selected-cnv/selected-cnv.component';
import { SelectedCnvDialogComponent } from './shared/analysis-process/selected-cnv/selected-cnv-dialog/selected-cnv-dialog.component';
import { ChooseManySampleComponent } from './shared/analysis-configure/choose-many-sample/choose-many-sample.component';
import { ChooseSamplesetResolver } from './shared/analysis-configure/choose-sampleset/choose-sampleset.resolver';
import { ChooseOneFileComponent } from './shared/analysis-configure/choose-one-file/choose-one-file.component';
import { MultipleProcessComponent } from './multiple-process/multiple-process.component';
import { MergedTableComponent } from './shared/analysis-process/merged-table/merged-table.component';
import { ClipboardModule } from 'ngx-clipboard';
import { MultipleConfigureService } from './multiple-configure/multiple-configure.service';
import { AnalysisConfigureService } from './shared/analysis-configure/analysis-configure.service';
import { AnalysisProcessService } from './shared/analysis-process/analysis-process.service';

@NgModule({
  declarations: [
    AnalysisComponent,
    IndividualConfigureComponent,
    ChooseSamplesetComponent,
    ChooseOneSampleComponent,
    ChooseManyFileComponent,
    IndividualProcessComponent,
    MainChartComponent,
    AnnotationDialogComponent,
    OverviewChartComponent,
    SelectedCnvComponent,
    SelectedCnvDialogComponent,
    AnalysisResultComponent,
    MultipleConfigureComponent,
    ChooseOneFileComponent,
    ChooseManySampleComponent,
    MultipleProcessComponent,
    MergedTableComponent
  ],
  imports: [
    SharedModule,
    AnalysisRoutingModule,
    TextMaskModule,
    ClipboardModule
  ],
  providers: [
    ChooseSamplesetResolver,
    AnalysisConfigureService,
    MultipleConfigureService,
    AnalysisProcessService
  ],
  entryComponents: [AnnotationDialogComponent, SelectedCnvDialogComponent]
})
export class AnalysisModule {}
