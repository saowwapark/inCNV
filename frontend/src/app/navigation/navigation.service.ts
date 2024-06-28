import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class NavigationService {
  onItemCollapsed: Subject<any>;
  onItemCollapseToggled: Subject<any>;

  // Private
  private _onNavigationChanged: BehaviorSubject<any>;
  private _onNavigationRegistered: BehaviorSubject<any>;
  private _onNavigationUnregistered: BehaviorSubject<any>;
  private _onNavigationItemAdded: BehaviorSubject<any>;
  private _onNavigationItemUpdated: BehaviorSubject<any>;
  private _onNavigationItemRemoved: BehaviorSubject<any>;

  private _currentNavigationKey: string;
  private _registry: { [key: string]: any } = {};

  /**
   * Constructor
   */
  constructor() {
    // Set the defaults
    this.onItemCollapsed = new Subject();
    this.onItemCollapseToggled = new Subject();

    // Set the private defaults
    this._currentNavigationKey = null;
    this._onNavigationChanged = new BehaviorSubject(null);
    this._onNavigationRegistered = new BehaviorSubject(null);
    this._onNavigationUnregistered = new BehaviorSubject(null);
    this._onNavigationItemAdded = new BehaviorSubject(null);
    this._onNavigationItemUpdated = new BehaviorSubject(null);
    this._onNavigationItemRemoved = new BehaviorSubject(null);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get onNavigationChanged
   */
  get onNavigationChanged(): Observable<any> {
    return this._onNavigationChanged.asObservable();
  }

  /**
   * Get onNavigationItemAdded
   */
  get onNavigationItemAdded(): Observable<any> {
    return this._onNavigationItemAdded.asObservable();
  }

  /**
   * Get onNavigationItemUpdated
   */
  get onNavigationItemUpdated(): Observable<any> {
    return this._onNavigationItemUpdated.asObservable();
  }

  /**
   * Get onNavigationItemRemoved
   */
  get onNavigationItemRemoved(): Observable<any> {
    return this._onNavigationItemRemoved.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register the given navigation
   * with the given key
   */
  register(key, navigation): void {
    // Check if the key already being used
    if (this._registry[key]) {
      console.error(
        `The navigation with the key '${key}' already exists. Either unregister it first or use a unique key.`
      );

      return;
    }

    // Add to the registry
    this._registry[key] = navigation;

    // Notify the subject
    this._onNavigationRegistered.next([key, navigation]);
  }

  /**
   * Unregister the navigation from the registry
   */
  unregister(key): void {
    // Check if the navigation exists
    if (!this._registry[key]) {
      console.warn(
        `The navigation with the key '${key}' doesn't exist in the registry.`
      );
    }

    // Unregister the sidebar
    delete this._registry[key];

    // Notify the subject
    this._onNavigationUnregistered.next(key);
  }

  /**
   * Get navigation from registry by key
   */
  getNavigation(key): any {
    // Check if the navigation exists
    if (!this._registry[key]) {
      console.warn(
        `The navigation with the key '${key}' doesn't exist in the registry.`
      );

      return;
    }

    // Return the sidebar
    return this._registry[key];
  }

  /**
   * Get the current navigation
   */
  getCurrentNavigation(): any {
    if (!this._currentNavigationKey) {
      console.warn(`The current navigation is not set.`);

      return;
    }

    return this.getNavigation(this._currentNavigationKey);
  }

  /**
   * Set the navigation with the key
   * as the current navigation
   */
  setCurrentNavigation(key): void {
    // Check if the sidebar exists
    if (!this._registry[key]) {
      console.warn(
        `The navigation with the key '${key}' doesn't exist in the registry.`
      );

      return;
    }

    // Set the current navigation key
    this._currentNavigationKey = key;

    // Notify the subject
    this._onNavigationChanged.next(key);
  }
}
