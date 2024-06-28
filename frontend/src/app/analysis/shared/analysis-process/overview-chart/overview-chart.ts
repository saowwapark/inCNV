import * as d3 from 'd3';
import {
  Y_AXIS_FONT_SIZE,
  X_AXIS_FONT_SIZE,
  TICK_WIDTH,
  CnvInfoView
} from '../../../analysis.model';

export class OverviewChart {
  _parentElement; // string
  _data: CnvInfoView[];
  _yAxisUnit: string;
  _domainOnX;
  _domainOnY;
  _color: string;

  graphContainer;
  clipPath;
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleLinear<number, number>;
  copyScaleX;
  xAxis;
  yAxis;
  svg;

  /**
   * // get merged_tool
   * domainOnX = [1, chromosome.length - 1]
   * domainOnY = [0, this.cnvTools.length]
   */
  constructor(
    parentElement,
    data: CnvInfoView[],
    containerMargin,
    yUnit,
    domainOnX,
    domainOnY,
    color: string
  ) {
    this._parentElement = parentElement;
    this._data = data;
    this._yAxisUnit = yUnit;
    this._domainOnX = domainOnX;
    this._domainOnY = domainOnY;
    this._color = color;

    this.initVis(containerMargin);
  }
  // -----------------------------------  public -----------------------------------------

  public createBrush(callback) {
    // Initialize brush component
    const brush = d3
      .brushX()
      .handleSize(10)
      .extent([
        [0, 0],
        [this.graphContainer.attr('width'), this.graphContainer.attr('height')]
      ])
      .on('end', (event) => this.brushed(event, callback));
    // Append brush component
    const brushComponent = this.graphContainer
      .append('g')
      .attr('class', 'brush')
      .call(brush);
  }
  public initVis(maxTickLeft) {
    this.generateGraphContainer(maxTickLeft);
    this.createClipPath();
    this.generateScaleX();
    this.generateScaleY();
    this.createAxisX();
    this.createAxisY();

    this.graphContainer.call(this.createZoomScale());
    this.createBars();
  }

  public destroyChart() {
    this.removeVis();
    this.releaseInstances();
  }
  // -----------------------------------  private -----------------------------------------

  private removeVis() {
    if (this.svg !== undefined) {
      this.svg.remove();
    }
  }
  private releaseInstances() {
    this.graphContainer = null;
    this.clipPath = null;
    this.scaleX = null;
    this.scaleY = null;
    this.xAxis = null;
    this.yAxis = null;
    this.copyScaleX = null;
    this.svg = null;
  }
  private calContainerHeight(containerMargin) {
    const maxY = this._domainOnY[1];
    const xAxisBarHeight = 20;
    const dataBarHeight = 20; // approximately with inner padding

    return (
      containerMargin.top +
      containerMargin.bottom +
      xAxisBarHeight +
      maxY * dataBarHeight
    );
  }

  private generateGraphContainer(containerMargin) {
    // const parentElement = d3.select(this._parentElementName);
    // const width = parentElement.attr('width');
    // const height = parentElement.attr('height');
    // const y = parentElement.attr('y');

    const width = this._parentElement.offsetWidth;
    const height = this.calContainerHeight(containerMargin);
    // select the svg container
    this.svg = d3
      .select(this._parentElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const contentWidth = +width - containerMargin.left - containerMargin.right;
    const contentHeight =
      +height - containerMargin.top - containerMargin.bottom;

    this.graphContainer = this.svg
      .append('g')
      .attr('class', 'overview-graph-container')
      .attr('width', contentWidth)
      .attr('height', contentHeight)
      .attr(
        'transform',
        `translate(${containerMargin.left}, ${containerMargin.top})`
      );
  }

  private createClipPath() {
    this.clipPath = this.graphContainer
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.graphContainer.attr('width'))
      .attr('height', this.graphContainer.attr('height'));
  }

  private generateScaleX() {
    // create scale on x
    this.scaleX = d3
      .scaleLinear()
      .domain(this._domainOnX)
      .range([0, this.graphContainer.attr('width')]);

    this.copyScaleX = this.scaleX.copy();
  }
  private generateScaleY() {
    // create scale on y
    this.scaleY = d3
      .scaleLinear()
      .domain(this._domainOnY)
      .range([this.graphContainer.attr('height'), 0]);
  }

  private createAxisX() {
    const xAxisGroup = this.graphContainer
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.graphContainer.attr('height')})`);
    // generate xAxis
    this.xAxis = d3.axisBottom(this.scaleX);

    const tickCount = Math.floor(
      this.graphContainer.attr('width') / TICK_WIDTH
    );
    this.xAxis.ticks(tickCount);

    xAxisGroup
      .call(this.xAxis)
      .selectAll('text')
      .style('font-size', X_AXIS_FONT_SIZE);
  }

  private createAxisY() {
    const yAxisGroup = this.graphContainer
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(0, 0)`);

    // generate yAxis
    this.yAxis = d3
      .axisLeft(this.scaleY)
      .ticks(this._domainOnY[1])
      .tickFormat((d: number) => `${d3.format(',d')(d)} ${this._yAxisUnit}`);
    yAxisGroup
      .call(this.yAxis)
      .selectAll('text')
      .style('font-size', Y_AXIS_FONT_SIZE);
  }

  private createBars() {
    // generate bars (add data + color)
    const bars = this.graphContainer
      .append('g')
      .attr('class', 'overview-bar')
      .attr('clip-path', 'url(#clip)');
    bars
      .selectAll('rect')
      .data(() => this._data) // get merged_tool
      .enter()
      .append('rect')
      .attr(
        'height',
        (d: CnvInfoView) =>
          this.graphContainer.attr('height') - this.scaleY(d.overlaps.length)
      )
      .attr('x', (d: CnvInfoView) => this.scaleX(d.startBp))
      .attr('y', (d: CnvInfoView) => this.scaleY(d.overlapLength))
      .attr(
        'width',
        (d: CnvInfoView) => this.scaleX(d.endBp) - this.scaleX(d.startBp) + 1
      )
      .attr('fill', this._color);
  }

  private brushed(event, callback) {
    // Get the selection coordinate
    const extent = event.selection;
    if (extent) {
      const sx1 = Math.round(this.scaleX.invert(extent[0]));
      const sx2 = Math.round(this.scaleX.invert(extent[1]));
      callback(sx1, sx2);
    }
  }

  private createZoomScale() {
    const width = this.graphContainer.attr('width');
    const height = this.graphContainer.attr('height');
    const zoomScale = d3
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([
        [0, 0],
        [width, height]
      ])
      .extent([
        [0, 0],
        [width, height]
      ])
      .on('zoom', (event) => {
        this.zoomed(event);
      });
    return zoomScale;
  }

  private zoomed(event) {
    // update scaleX
    // this.scaleX.range([0, width].map(d => d3.event.transform.applyX(d)));
    this.scaleX = event.transform.rescaleX(this.copyScaleX);

    // create new chart with new scaleX
    this.graphContainer
      .selectAll('.overview-bar rect')
      .attr('x', (d: CnvInfoView) => this.scaleX(d.startBp))
      .attr(
        'width',
        (d: CnvInfoView) => this.scaleX(d.endBp) - this.scaleX(d.startBp) + 1
      );

    const newXAxis = d3.axisBottom(this.scaleX);
    const tickCount = Math.floor(
      this.graphContainer.attr('width') / TICK_WIDTH
    );
    newXAxis.ticks(tickCount);

    // create new xAxis with new scaleX
    this.graphContainer
      .selectAll('.overview .x-axis')
      .call(newXAxis)
      .selectAll('text')
      .style('font-size', X_AXIS_FONT_SIZE);
    // return scaleX;
  }
}
