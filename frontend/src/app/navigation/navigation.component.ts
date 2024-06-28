import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, merge } from 'rxjs';
import { NavigationService } from './navigation.service';
import { takeUntil } from 'rxjs/operators';
import { navigationData } from './navigation-data';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  navigationData: any;

  // Private
  private _unsubscribeAll: Subject<void>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _navigationService: NavigationService
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
    // Get default navigation
    this.navigationData = navigationData;

    // Register the navigation to the service
    this._navigationService.register('main', this.navigationData);

    // Set the main navigation as our current navigation
    this._navigationService.setCurrentNavigation('main');

    // Load the navigation either from the input or from the service
    this.navigationData =
      this.navigationData || this._navigationService.getCurrentNavigation();

    // Subscribe to the current navigation changes
    this._navigationService.onNavigationChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        // Load the navigation
        this.navigationData = this._navigationService.getCurrentNavigation();

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Subscribe to navigation item
    merge(
      this._navigationService.onNavigationItemAdded,
      this._navigationService.onNavigationItemUpdated,
      this._navigationService.onNavigationItemRemoved
    )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Handle navigation item changes
        this.navigationData = this._navigationService.getCurrentNavigation();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    console.log('NavigationComponent ngOnDestroy called');
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
