import { Component, Input, EventEmitter, Output } from '@angular/core';
import { SelectedBarType } from './selected-bar-type.model';

@Component({
  selector: 'selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class SelectedBarComponent {
  @Input() selectedData: any[];
  @Input() selectedBarType: number;

  @Output() submitEmitter = new EventEmitter<any[]>();
  @Output() deselectAllEmitter = new EventEmitter<void>();

  SelectedBarType = SelectedBarType;

  deselectAll() {
    // Trigger the next event
    this.deselectAllEmitter.next();
  }

  submitAllSelected() {
    this.submitEmitter.next(this.selectedData);
  }
}