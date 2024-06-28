import { SamplesetService } from 'src/app/sampleset/sampleset.service';
import { Observable } from 'rxjs';
import { Sampleset } from './sampleset.model';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
@Injectable()
export class SamplesetResolver implements Resolve<Observable<Sampleset[]>> {
  constructor(private samplesetService: SamplesetService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Sampleset[]> {
    return this.samplesetService.getSamplesets();
  }
}
