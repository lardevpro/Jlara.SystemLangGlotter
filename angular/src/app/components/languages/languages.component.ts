import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInDirective } from '../../../directives/fade-in.directive';

interface Language {
  name: string;
  level: string;
  icon: string;
  description: string;
  benefits: string[];
}

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule, FadeInDirective],
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent {
  languages: Language[] = [
    {
      name: 'Inglés',
      level: '98%',
      icon: '🇬🇧',
      description: 'El idioma global por excelencia. Abre puertas en el mundo profesional y personal.',
      benefits: [
        'Acceso a oportunidades laborales internacionales',
        'Comunicación efectiva en viajes',
        'Consumo de contenido original en inglés'
      ]
    },
    {
      name: 'Francés',
      level: '85%',
      icon: '🇫🇷',
      description: 'El idioma del amor y la cultura. Fundamental en el mundo diplomático y artístico.',
      benefits: [
        'Apreciación de la cultura francesa',
        'Oportunidades en organizaciones internacionales',
        'Mejora de habilidades lingüísticas'
      ]
    },
    {
      name: 'Alemán',
      level: '75%',
      icon: '🇩🇪',
      description: 'La lengua de la precisión y la tecnología. Esencial en el mundo empresarial europeo.',
      benefits: [
        'Acceso al mercado laboral alemán',
        'Comprensión de la cultura germánica',
        'Ventaja en campos técnicos y científicos'
      ]
    }
  ];
}