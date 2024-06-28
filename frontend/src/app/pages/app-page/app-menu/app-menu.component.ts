import { Component, Renderer2, Output, EventEmitter } from '@angular/core';
import { AuthenService } from 'src/app/authen/authen.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss']
})
export class AppMenuComponent {
  @Output() menuToggled = new EventEmitter();

  // @ViewChild('collapsableArrow', { static: false }) collapsableArrow: MatIcon;
  // @ViewChild('children', { static: false }) children: ElementRef;

  // opened = false;
  constructor(
    private renderer: Renderer2,
    private authService: AuthenService
  ) {}

  onLogout() {
    this.authService.logout();
  }
  onToggleNavigation() {
    console.log('Click Menu Toggle');
    this.menuToggled.emit();
  }
  collapseToggle() {
    /*  console.log(this.collapsableArrow);
    console.log(this.children);
    if (this.opened) {

      this.renderer.setStyle(this.collapsableArrow.nativeElement, 'transition', 'transform .3s ease-in-out, opacity .25s ease-in-out .1s');
      this.renderer.setStyle(this.collapsableArrow.nativeElement, 'transform', 'rotate(0)');

      this.renderer.addClass(this.children.nativeElement, 'close');
      this.renderer.removeClass(this.children.nativeElement, 'open');

      this.opened = false;
    } else {
      this.renderer.setStyle(this.collapsableArrow.nativeElement, 'transform', 'rotate(90deg)');
      this.renderer.addClass(this.children.nativeElement, 'open');
      this.renderer.removeClass(this.children.nativeElement, 'close');

      this.opened = true;
    }*/
  }
}
