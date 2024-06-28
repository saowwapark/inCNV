import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((httpError: HttpErrorResponse) => {
        console.log(httpError);
        let errorMessage = 'An unknown error occured.';
        if (httpError.error.message) {
          errorMessage = httpError.error.message;
        }
        this.dialog.open(ErrorDialogComponent, {
          panelClass: 'dialog-warning',
          disableClose: false,
          data: {
            errorMessage
          }
        });
        return throwError(httpError);
      })
    );
  }
}
