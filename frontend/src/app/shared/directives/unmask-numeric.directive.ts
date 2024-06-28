import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[unmaskNumeric]'
})
export class UnmaskNumericDirective {
  constructor(private elementRef: ElementRef, private ngControl: NgControl) {}

  @HostListener('change') inputChange() {
    const newValue = this.elementRef.nativeElement.value.replace(/\D/g, '');

    // Note that you need to pass the 2nd argument with the following values:
    this.ngControl.control.setValue(newValue, {
      emitEvent: false,
      emitModelToViewChange: false,
      emitViewToModelChange: false
    });
  }
}
