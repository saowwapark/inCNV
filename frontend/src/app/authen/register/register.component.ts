import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenService } from '../authen.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  private _unsubscribeAll: Subject<void>;

  constructor(public _authService: AuthenService, private _router: Router) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  onSignup(form: NgForm) {
    // console.log(form.value);
    if (form.invalid) {
      return;
    }
    this._authService
      .signUp(form.value.email, form.value.password)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigate(['app/upload-cnvs']);
        },
        error: () => {
          console.log('cannot signup');
        }
      });
  }

  loadWelcomePage() {
    this._router.navigate(['/welcome']);
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
