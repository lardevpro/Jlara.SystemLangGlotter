import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  avatar: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  @Input() testimonials: Testimonial[] = [];
}
