import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MethodStep {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-methodology',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './methodology.component.html',
  styleUrls: ['./methodology.component.scss']
})
export class MethodologyComponent {
  methodSteps: MethodStep[] = [
    {
      icon: '../../../../../assets/listen.svg',
      title: 'Aprendizaje Personalizado',
      description: 'Plan de estudios adaptado a tus objetivos y nivel'
    },
    {
      icon: '../../../../../assets/speak.svg',
      title: 'Práctica Interactiva',
      description: 'Ejercicios dinámicos y conversaciones reales'
    },
    {
      icon: '../../../../../assets/write.svg',
      title: 'Seguimiento Continuo',
      description: 'Evaluación y retroalimentación constante'
    }
  ];
}
