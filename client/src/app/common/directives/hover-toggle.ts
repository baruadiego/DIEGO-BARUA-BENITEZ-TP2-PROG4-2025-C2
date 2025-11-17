import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverToggle]',
  standalone: true,
})
export class HoverToggleDirective {

  // Lo que vos pasás en el template: [appHoverToggle]="userDetail"
  @Input('appHoverToggle') target?: HTMLElement;

  constructor(private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.setVisible(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.setVisible(false);
  }

  private setVisible(show: boolean) {
    if (!this.target) return;

    if (show) {
      this.renderer.removeClass(this.target, 'hidden');
    } else {
      this.renderer.addClass(this.target, 'hidden');
    }
  }
}
