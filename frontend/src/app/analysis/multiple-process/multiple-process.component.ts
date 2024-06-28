import {
  MULTIPLE_SAMPLE_ANALYSIS,
  MERGED_RESULT_NAME,
  SELECTED_RESULT_NAME,
  DgvVariant,
  CHRACTER_WIDTH
} from './../analysis.model';
import {
  CnvInfo,
  RegionBp,
  CnvGroup,
  MultipleSampleConfig
} from '../analysis.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import {
  BehaviorSubject,
  Subject,
  forkJoin,
  throwError,
  Observable,
  combineLatest
} from 'rxjs';
import {
  takeUntil,
  catchError,
  mergeMap,
  shareReplay,
  startWith,
  map,
  tap
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { Margin } from '../visualization.model';
import { MessagesService } from 'src/app/shared/components/messages/messages.service';
import { MULTIPLE_CONFIG } from 'src/constants/local-storage.const';
import { LoadingService } from 'src/app/shared/loading/loading.service';

interface MultipleData {
  multipleConfig: MultipleSampleConfig;
  dgvVariants: DgvVariant[];
  cnvSamples: CnvGroup[];
  mergedTool: CnvGroup;
  containerMargin: Margin;
}

@Component({
  selector: 'app-multiple-process',
  templateUrl: './multiple-process.component.html',
  styleUrls: ['./multiple-process.component.scss'],
  providers: [LoadingService],
})
export class MultipleProcessComponent implements OnInit, OnDestroy {
  data: MultipleData;
  selectedChrRegion: RegionBp;
  selectedCnvs: CnvInfo[];
  containerMargin: { top: number; right: number; bottom: number; left: number };
  isLoading: BehaviorSubject<boolean>;
  readonly analysisType = MULTIPLE_SAMPLE_ANALYSIS;

  // private
  private _unsubscribeAll: Subject<void>;

  constructor(
    private analysisService: AnalysisProcessService,
    private messagesService: MessagesService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.isLoading = new BehaviorSubject(true);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.loadingService.loadingOn();
    const multipleConfig$ = this.analysisService.onMultipleSampleConfigChanged
      .asObservable()
      .pipe(
        map(() => {
          const multipleConfigString = localStorage.getItem(MULTIPLE_CONFIG);
          if(multipleConfigString) {
            return JSON.parse(multipleConfigString);
          }
        }
      ));

      const dgvVariants$ = multipleConfig$.pipe(
        mergeMap((config: MultipleSampleConfig) =>
          this.analysisService.getDgvVariants(config.referenceGenome, config.chromosome).pipe(
            catchError((err: unknown) => {
              const message = 'Could not load DGV variants';
              this.messagesService.showErrors(message);
              console.log(message, err);
              this.router.navigate(['/multiple-sample']);
              return throwError(err);
            })
          )
        ),
        shareReplay({ refCount: true, bufferSize: 1 })
      );

    const multipleSampleData$ = multipleConfig$.pipe(
      mergeMap((config: MultipleSampleConfig) =>
        this.analysisService.getMultipleSampleData(config).pipe(
          catchError((err: unknown) => {
            const message = 'Could not load multiple sample data';
            this.messagesService.showErrors(message);
            console.log(message, err);
            this.router.navigate(['/multiple-sample']);
            return throwError(err);
          })
        )
      ),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    
    const cnvSamples$ = multipleSampleData$.pipe(
      map(multipleSampleData => multipleSampleData.annotatedCnvSamples),
      catchError((err: unknown) => {
        const message = 'Could not load CNV tools';
        this.messagesService.showErrors(message);
        console.log(message);
        return throwError(err);
      })
    );

    const mergedTool$ = multipleSampleData$.pipe(
      map(multipleSampleData => multipleSampleData.annotatedMergedTool),
      startWith(undefined as CnvGroup),
      catchError((err: unknown) => {
        const message = 'Could not load merged CNV tools';
        this.messagesService.showErrors(message);
        console.log(message);
        return throwError(err);
      })
    );

    const containerMargin$ = cnvSamples$.pipe(
      map(cnvSamples => this.calContainerMargin(cnvSamples)),
      startWith(undefined as Margin)
    );

    const data$ = combineLatest([
      multipleConfig$,
      dgvVariants$,
      cnvSamples$,
      mergedTool$,
      containerMargin$
    ]).pipe(
      map(
        ([
          multipleConfig,
          dgvVariants,
          cnvSamples,
          mergedTool,
          containerMargin
        ]) => ({
          multipleConfig,
          dgvVariants,
          cnvSamples,
          mergedTool,
          containerMargin
        })
      ),
      tap(() => {
        this.loadingService.loadingOff();
      }),
      catchError((err: unknown) => {
        console.log(err);
        this.router.navigate(['/multiple-sample']);
        return throwError(err);
      })
    );

    data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        this.data = data;
      });

    this.analysisService.onSelectedCnvChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cnvInfos => {
        this.selectedCnvs = cnvInfos;
      });
  }

  selectChrRegion(selectedChrRegion: RegionBp) {
    this.selectedChrRegion = selectedChrRegion;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  private calContainerMargin(cnvTools: CnvGroup[]): Margin {
    if (!cnvTools) {
      return undefined;
    }
    // max character length
    let maxLength = 0;
    for (const tool of cnvTools) {
      const length = tool.cnvGroupName.length;
      if (length > maxLength) {
        maxLength = length;
      }
    }
    maxLength = Math.max(
      maxLength,
      MERGED_RESULT_NAME.length,
      SELECTED_RESULT_NAME.length
    );
    // create margins and dimensions
    const containerMargin = {
      top: 40,
      right: 10,
      bottom: 30,
      left: 10 + CHRACTER_WIDTH * maxLength
    };
    return containerMargin;
  }
}
