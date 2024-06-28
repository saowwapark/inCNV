import {
  Component,
  OnInit,
  HostBinding,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { NavigationItem } from 'src/app/navigation/navigation.model';
import { Subject, merge } from 'rxjs';
import { NavigationService } from '../navigation.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nav-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  classes = 'nav-item';

  @Input()
  item: NavigationItem;

  // Private
  private _unsubscribeAll: Subject<void>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private navigationService: NavigationService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to navigation item
    merge(
      this.navigationService.onNavigationItemAdded,
      this.navigationService.onNavigationItemUpdated,
      this.navigationService.onNavigationItemRemoved
    )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
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
