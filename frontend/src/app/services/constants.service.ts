import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConstantsService {
  baseAppUrl = environment.apiDomain;
}
