import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatasourceService as DatasourceService } from './datasource.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.scss'],
})
export class DatasourceComponent implements OnInit, OnDestroy  {
  messages = [];
  private _unsubscribeAll: Subject<void>;
  constructor(private router: Router, private datasourceService: DatasourceService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.updateDataSource();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  updateDataSource() {
    this.datasourceService.updatedDasource()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(status => {
        this.messages.push(status);
      }, error => {
        console.error('Error receiving download status:', error);
      });
  }
}