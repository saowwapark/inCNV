import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Sampleset } from 'src/app/sampleset/sampleset.model';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-choose-sampleset',
  templateUrl: './choose-sampleset.component.html',
  styleUrls: ['./choose-sampleset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class ChooseSamplesetComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() selectedSampleset: Sampleset;
  @Output() selectedSamplesetChange = new EventEmitter<Sampleset>();

  dataSource: MatTableDataSource<Sampleset>;

  displayedColumns = ['select', 'samplesetName', 'description'];
  expandedElement: string | null;

  constructor(private activateRoute: ActivatedRoute) {}

  ngOnInit() {
    const samplesets = this.activateRoute.snapshot.data['samplesets'];
    this.dataSource = new MatTableDataSource(samplesets);
    this.dataSource.sort = this.matSort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSelectSampleset(value: Sampleset) {
    if (value) {
      this.selectedSamplesetChange.next(value);
    }
  }
}
