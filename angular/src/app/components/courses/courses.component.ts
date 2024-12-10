import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInDirective } from '../../../directives/fade-in.directive';

interface Course {
  title: string;
  description: string;
  icon: string;
  features: string[];
  price: string;
  level: string;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FadeInDirective],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {
  courses: Course[] = [
    {
      title: 'Curso Intensivo',
      description: 'Programa acelerado para un aprendizaje rápido y efectivo',
      icon: '🚀',
      features: [
        'Clases diarias',
        'Material didáctico exclusivo',
        'Práctica intensiva',
        'Evaluación continua',
      ],
      price: '299€/mes',
      level: 'Avanzado',
    },
    {
      title: 'Curso Regular',
      description: 'Aprende a tu ritmo con un programa flexible y completo',
      icon: '📚',
      features: [
        'Clases semanales',
        'Material de estudio',
        'Ejercicios prácticos',
        'Seguimiento personalizado',
      ],
      price: '149€/mes',
      level: 'Intermedio',
    },
    {
      title: 'Curso Express',
      description: 'Enfoque específico en tus objetivos de aprendizaje',
      icon: '⚡',
      features: [
        'Clases personalizadas',
        'Material especializado',
        'Enfoque práctico',
        'Certificación rápida',
      ],
      price: '199€/mes',
      level: 'Básico',
    },
  ];
}
