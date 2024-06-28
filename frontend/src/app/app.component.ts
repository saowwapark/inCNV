import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { AuthenService } from './authen/authen.service';
import { Subscription } from 'rxjs';
import { MessagesService } from './shared/components/messages/messages.service';
import { HeaderService } from './shared/components/header/header.service';
import { ConstantsService } from './services/constants.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'inCNV';

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthenService) {}

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    console.log('app component is destroyed.');
    window['ngRef'].destroy();
  }

  ngOnInit() {
    this.authService.autoAuthUser();
    this.authListenerSubs = this.authService.isAuthen$.subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }
}
