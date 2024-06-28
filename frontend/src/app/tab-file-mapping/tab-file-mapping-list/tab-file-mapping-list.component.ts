import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabFileMapping } from '../tab-file-mapping.model';
import { TabFileMappingService } from '../tab-file-mapping.service';
import { Observable, Subject } from 'rxjs';
import { share, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab-file-mapping-list',
  templateUrl: './tab-file-mapping-list.component.html',
  styleUrls: ['./tab-file-mapping-list.component.scss']
})
export class TabFileMappingListComponent implements OnInit, OnDestroy {
  fileMappingConfigureds$: Observable<TabFileMapping[]>;

  // Private
  private _unsubscribeAll: Subject<void>;

  constructor(private _fileMappingService: TabFileMappingService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {
    this.fileMappingConfigureds$ = this._fileMappingService.onTabFileMappingsChanged.pipe(
      share(),
      takeUntil(this._unsubscribeAll)
    );
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
