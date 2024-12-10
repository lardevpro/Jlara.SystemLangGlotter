import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './components/hero/hero.component';
import { LanguagesComponent } from "./components/languages/languages.component";
import { MethodologyComponent } from "./components/methodology/methodology.component";
import { StatisticsComponent } from "./components/statistics/statistics.component";
import { TestimonialsComponent } from "./components/testimonials/testimonials.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    LanguagesComponent,
    MethodologyComponent,
    StatisticsComponent,
    TestimonialsComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  languages = [
    { name: 'Inglés', level: '98%', icon: '🇬🇧' },
    { name: 'Francés', level: '85%', icon: '🇫🇷' },
    { name: 'Alemán', level: '75%', icon: '🇩🇪' },
    { name: 'Italiano', level: '90%', icon: '🇮🇹' },
    { name: 'Portugués', level: '80%', icon: '🇵🇹' },
    { name: 'Japonés', level: '70%', icon: '🇯🇵' },
  ];

  testimonials = [
    {
      name: 'María García',
      location: 'Madrid, España',
      quote:
        'El método de aprendizaje es increíblemente efectivo. ¡He mejorado mi inglés en sólo 3 meses!',
      avatar: '../../../assets/avatars/uifaces-popular-image (1).jpg',
    },
    {
      name: 'Carlos Rodríguez',
      location: 'Barcelona, España',
      quote:
        'La práctica con hablantes nativos ha sido clave para ganar fluidez.',
      avatar: '../../../assets/avatars/uifaces-popular-image.jpg',
    },
    {
      name: 'Ana Martínez',
      location: 'Valencia, España',
      quote:
        'Los ejercicios interactivos hacen que aprender sea divertido y efectivo.',
      avatar: '../../../assets/avatars/uifaces-popular-image (2).jpg',
    },
  ];
}
