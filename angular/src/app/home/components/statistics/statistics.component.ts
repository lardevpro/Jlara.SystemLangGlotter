import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CountUp } from 'countup.js';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit {
  @ViewChildren('countUpRef') countUpRefs!: QueryList<ElementRef>;

  private statistics = [
    { value: 10000, suffix: '+' },
    { value: 20, suffix: '+' },
    { value: 95, suffix: '%' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.countUpRefs.forEach((ref, index) => {
        const countUp = new CountUp(
          ref.nativeElement,
          this.statistics[index].value,
          {
            duration: 3,
            suffix: this.statistics[index].suffix,
            separator: ',',
            decimal: '.',
            enableScrollSpy: true,
            scrollSpyOnce: true,
            useEasing: true,
            easingFn: (t, b, c, d) => {
              return c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
            },
          }
        );

        if (!countUp.error) {
          countUp.start();
        }
      });
    }
  }
}
