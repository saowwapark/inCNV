import { Component, Input } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() isLoading: boolean;
  constructor(public loadingService: LoadingService) {}
}
