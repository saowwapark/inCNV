import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { RegisterComponent } from './register/register.component';
import { AuthenRoutingModule } from './authen-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenInterceptor } from './authen-interceptor';
import { AuthenService } from './authen.service';

@NgModule({
  declarations: [SigninComponent, RegisterComponent],
  imports: [SharedModule, AuthenRoutingModule],
  providers: [
    AuthenService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthenInterceptor, multi: true }
  ]
})
export class AuthenModule {
  constructor() {}
}
