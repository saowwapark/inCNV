import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderService {
  onSearchChanged = new BehaviorSubject('');
  constructor() {}
}
