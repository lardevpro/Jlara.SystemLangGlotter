import { Directive, ElementRef, Renderer2 } from '@angular/core';


@Directive({
  selector: '[appFloating]',
  standalone: true
})
export class FloatingAnimationDirective {
  constructor(private el: ElementRef, 
              private renderer: Renderer2
              ) {}

  ngOnInit() {
    this.applyFloatingAnimation();
  }

  applyFloatingAnimation() {
    const element = this.el.nativeElement;

    this.renderer.setStyle(
      element,
      'animation',
      'float 2s infinite ease-in-out, fade 2s infinite alternate'
    );
  }
}