import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-loading',
  templateUrl: './nav-loading.component.html',
  styleUrls: ['./nav-loading.component.scss']
})
export class NavLoadingComponent implements OnInit {
  loading$: Observable<boolean>;
  constructor(private router: Router) {}

  ngOnInit() {
    this.loading$ = this.router.events.pipe(
      filter(event =>
        [
          NavigationStart,
          NavigationEnd,
          NavigationCancel,
          NavigationError
        ].some(navigationType => event instanceof navigationType)
      ), // console.log(event.constructor.name);
      map(event => event instanceof NavigationStart)
    );
  }
}
