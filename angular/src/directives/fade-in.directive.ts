import { Directive, ElementRef, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Directive({
  selector: '[appFadeIn]',
  standalone: true,
})
export class FadeInDirective implements OnInit {
  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.el.nativeElement.style.opacity = '0';
      this.el.nativeElement.style.transform = 'translateY(30px)';
      this.el.nativeElement.style.transition =
        'opacity 0.8s ease-out, transform 0.8s ease-out';
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.el.nativeElement.style.opacity = '1';
              this.el.nativeElement.style.transform = 'translateY(0)';
            }
          });
        },
        {
          threshold: 0.3,
        }
      );

      observer.observe(this.el.nativeElement);
    }
  }
}
