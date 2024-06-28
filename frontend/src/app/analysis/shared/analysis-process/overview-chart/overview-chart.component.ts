import { RegionBp } from '../../../analysis.model';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import * as d3 from 'd3';
import { CnvGroup, CnvInfo } from '../../../analysis.model';
import { OverviewChart } from './overview-chart';
import { HUMAN_CHROMOSOME } from '../../../chromosome.model';

@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewChartComponent implements OnChanges, OnDestroy {
  @Input() mergedData: CnvGroup;
  @Input() chromosome: string;
  @Input() yAxisUnit: string;
  @Input() yAxisMaxVaule: number;
  @Input() containerMargin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  @Output()
  selectChrRegion = new EventEmitter<RegionBp>();

  @ViewChild('overviewChartDiv', { static: true })
  private overviewChartDiv: ElementRef;
  readonly color = '#d32f2f';
  chrLength: number;

  private overviewChart;
  private previousWidth;

  svg: d3.Selection<SVGSVGElement, CnvGroup, null, undefined>;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const currentWidth = window.innerWidth;
    if(this.previousWidth !== currentWidth && this.overviewChart) {
      this.previousWidth = currentWidth;
      this.createOverviewChart();
    }
  }

  constructor() {
    
  }

  /********************* Life Cycle Hook ********************/
  ngOnChanges(): void {
    if (this.mergedData && this.chromosome && this.yAxisUnit && this.yAxisMaxVaule && this.containerMargin) {
      this.chrLength =
        HUMAN_CHROMOSOME[`chr${this.chromosome.toUpperCase()}`].length;
      this.createOverviewChart();
    }
  }

  ngOnDestroy() {
    // release SVG
    if (this.overviewChart !== undefined) {
      this.overviewChart.destroyChart();
    }
    this.overviewChartDiv = null;
  }

  /*********************** Function **********************/
  createOverviewChart() {
    const parentElement = this.overviewChartDiv.nativeElement;
    const data = this.mergedData.cnvInfos;
    const containerMargin = this.containerMargin;
    const yUnit = this.yAxisUnit;
    const domainOnX = [1, this.chrLength - 1];
    const domainOnY = [0, this.yAxisMaxVaule];
    const color = this.color;

    if (
      !(
        parentElement &&
        data &&
        containerMargin &&
        yUnit &&
        domainOnX &&
        domainOnY &&
        color
      )
    ) {
      return;
    }
    if (this.overviewChart === undefined) {
      this.overviewChart = new OverviewChart(
        parentElement,
        data,
        containerMargin,
        yUnit,
        domainOnX,
        domainOnY,
        color
      );
    } else {
      this.overviewChart.destroyChart();
      this.overviewChart.initVis(this.containerMargin);
    }
    this.overviewChart.createBrush((sx1, sx2) => {
      this.selectChrRegionCallback(sx1, sx2);
    });
  }

  private selectChrRegionCallback(sx1, sx2) {
    const selectedChrRegion = new RegionBp(sx1, sx2);
    this.selectChrRegion.next(selectedChrRegion);
  }
}
