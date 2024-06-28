import { AuthenService } from '../authen.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnDestroy {
  private _unsubscribeAll: Subject<void>;

  constructor(private _authService: AuthenService, private _router: Router) {
    this._unsubscribeAll = new Subject();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this._authService
      .login(form.value.email, form.value.password)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigate(['app/upload-cnvs']);
        },
        error: () => {
          console.log('cannot login');
        }
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
