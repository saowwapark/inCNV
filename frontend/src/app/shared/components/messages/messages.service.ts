import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MessagesService {
  private subject = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.subject.asObservable();

  showErrors(...errors: string[]) {
    this.subject.next(errors);
  }

  clearErrors() {
    this.subject.next([]);
  }
}
