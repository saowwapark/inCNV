import { NavigationService } from '../navigation.service';
import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationItem } from 'src/app/navigation/navigation.model';
import { Subject, merge } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { myAnimations } from 'src/app/shared/animations';

@Component({
  selector: 'nav-collapsable',
  templateUrl: './collapsable.component.html',
  styleUrls: ['./collapsable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: myAnimations
})
export class CollapsableComponent implements OnInit, OnDestroy {
  @Input()
  item: NavigationItem;

  @HostBinding('class')
  classes = 'nav-collapsable';

  @HostBinding('class.open')
  public isOpen = false;

  private _unsubscribeAll: Subject<void>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _navigationService: NavigationService,
    private _router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Listen for router events
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((event: NavigationEnd) => {
        // Check if the url can be found in
        // one of the children of this item
        if (this.isUrlInChildren(this.item, event.urlAfterRedirects)) {
          this.expand();
        } else {
          this.collapse();
        }
      });

    // Listen for collapsing the children of any collapsable navigation item
    this._navigationService.onItemCollapsed
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(clickedItem => {
        if (clickedItem && clickedItem.children) {
          // Check if the clicked item is one
          // of the children of this item
          if (this.isChildrenOf(this.item, clickedItem)) {
            return;
          }

          // Check if the url can be found in
          // one of the children of this item
          if (this.isUrlInChildren(this.item, this._router.url)) {
            return;
          }

          // If the clicked item is not this item, collapse...
          if (this.item !== clickedItem) {
            this.collapse();
          }
        }
      });

    // Check if the url can be found in
    // one of the children of this item
    if (this.isUrlInChildren(this.item, this._router.url)) {
      this.expand();
    } else {
      this.collapse();
    }

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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle collapse
   *
   */
  toggleOpen(ev): void {
    ev.preventDefault();

    this.isOpen = !this.isOpen;

    // Navigation collapse toggled...
    this._navigationService.onItemCollapsed.next(this.item);
    this._navigationService.onItemCollapseToggled.next();
  }

  /**
   * Expand the collapsable navigation
   */
  expand(): void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    this._navigationService.onItemCollapseToggled.next();
  }

  /**
   * Collapse the collapsable navigation
   */
  collapse(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    this._navigationService.onItemCollapseToggled.next();
  }

  /**
   * Check if the given item is a child of the given parent
   */
  isChildrenOf(parent, item): boolean {
    if (!parent.children) {
      return false;
    }

    if (parent.children.indexOf(item) !== -1) {
      return true;
    }

    for (const children of parent.children) {
      if (children.children) {
        return this.isChildrenOf(children, item);
      }
    }
  }

  /**
   * Check if we can find the given url
   * in one of the given parent's children
   */
  isUrlInChildren(parent, url): boolean {
    if (!parent.children) {
      return false;
    }
    for (const child of parent.children) {
      if (child.children) {
        if (this.isUrlInChildren(child, url)) {
          return true;
        }
      }
      if (child.url === url || url.includes(child.url)) {
        return true;
      }
    }

    // for (let i = 0; i < parent.children.length; i++) {
    //   if (parent.children[i].children) {
    //     if (this.isUrlInChildren(parent.children[i], url)) {
    //       return true;
    //     }
    //   }

    //   if (
    //     parent.children[i].url === url ||
    //     url.includes(parent.children[i].url)
    //   ) {
    //     return true;
    //   }
    // }

    return false;
  }
}
