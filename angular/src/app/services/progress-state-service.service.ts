import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Disponible globalmente en la aplicación
})
export class ProgressStateService {
  private totalCorrectAnswersSource = new BehaviorSubject<number>(0); // Total de aciertos globales
  private currentLevelSource = new BehaviorSubject<string>('easy'); // Nivel actual

  totalCorrectAnswers$ = this.totalCorrectAnswersSource.asObservable();
  currentLevel$ = this.currentLevelSource.asObservable();

  getTotalCorrectAnswers() {
    return this.totalCorrectAnswersSource.getValue();
  }

  getCurrentLevel() {
    return this.currentLevelSource.getValue();
  }

  incrementCorrectAnswers() {
    const newCount = this.getTotalCorrectAnswers() + 1;
    this.totalCorrectAnswersSource.next(newCount);

    // Cambiar de nivel si se alcanzan 20 aciertos
    if (newCount >= 20) {
      this.advanceLevel();
    }
  }

  resetCorrectAnswers() {
    this.totalCorrectAnswersSource.next(0);
  }

  advanceLevel() {
    const currentLevel = this.getCurrentLevel();
    const levels = ['easy', 'medium', 'advanced', 'expert'];
    const nextLevelIndex = levels.indexOf(currentLevel) + 1;

    if (nextLevelIndex < levels.length) {
      this.currentLevelSource.next(levels[nextLevelIndex]);
      this.resetCorrectAnswers();
    } else {
      console.warn('Ya estás en el nivel máximo.');
    }
  }
}
