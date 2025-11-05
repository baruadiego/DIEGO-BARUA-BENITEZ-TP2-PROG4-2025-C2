import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appLikeToggle]'
})
export class LikeToggleDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.renderer.removeClass(this.el.nativeElement, 'bi-heart');
    this.renderer.addClass(this.el.nativeElement, 'bi-heart-fill');
    this.renderer.addClass(this.el.nativeElement, 'text-[#e0245e]');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.renderer.removeClass(this.el.nativeElement, 'bi-heart-fill');
    this.renderer.addClass(this.el.nativeElement, 'bi-heart');
    this.renderer.removeClass(this.el.nativeElement, 'text-[#e0245e]');
  }
}
