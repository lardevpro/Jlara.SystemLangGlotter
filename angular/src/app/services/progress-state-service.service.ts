import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigStateService } from '@abp/ng.core';
import { ProgressService } from '@proxy/jlara-system-leng/progresses/progress.service';

@Injectable({
  providedIn: 'root',
})
export class ProgressStateService {
  private currentLevelSubject = new BehaviorSubject<string>('easy'); // El nivel inicial puede ser 'easy'
  private currentProgressSubject = new BehaviorSubject<number>(0); // Progreso inicial
  private correctAnswersSubject = new BehaviorSubject<number>(0); // Respuestas correctas iniciales
  private incorrectAnswersSubject = new BehaviorSubject<number>(0); // Respuestas incorrectas iniciales

  // Streams observables para acceder a estos valores
  currentLevel$ = this.currentLevelSubject.asObservable();
  currentProgress$ = this.currentProgressSubject.asObservable();
  correctAnswers$ = this.correctAnswersSubject.asObservable();
  incorrectAnswers$ = this.incorrectAnswersSubject.asObservable();

  constructor(
    private configStateService: ConfigStateService,
    private progressService: ProgressService
  ) {}

  // Método para establecer el nivel actual
  setCurrentLevel(level: string): void {
    this.currentLevelSubject.next(level);
  }

  // Método para obtener el nivel actual
  getCurrentLevel(): string {
    return this.currentLevelSubject.value;
  }

  // Método para incrementar respuestas correctas
  incrementCorrectAnswers(): void {
    const currentCorrect = this.correctAnswersSubject.value;
    this.correctAnswersSubject.next(currentCorrect + 1);
    this.updateProgress();
  }

  // Método para incrementar respuestas incorrectas
  incrementIncorrectAnswers(): void {
    const currentIncorrect = this.incorrectAnswersSubject.value;
    this.incorrectAnswersSubject.next(currentIncorrect + 1);
    this.updateProgress();
  }

  // Método para obtener el progreso actual
  getCurrentProgress(): number {
    return this.currentProgressSubject.value;
  }

  // Método para actualizar el progreso general
  updateProgress(): void {
    const correct = this.correctAnswersSubject.value;
    const incorrect = this.incorrectAnswersSubject.value;
    const totalAnswers = correct + incorrect;

    // Calcula el progreso como un porcentaje de respuestas correctas
    const progress = totalAnswers > 0 ? (correct / totalAnswers) * 100 : 0;
    this.currentProgressSubject.next(progress);
  }

  // Método para avanzar al siguiente nivel
  advanceLevel(): void {
    const nextLevel = this.getNextLevel();
    this.setCurrentLevel(nextLevel);
    this.resetProgress(); // Resetea los contadores y progreso al avanzar de nivel
  }

  // Método para obtener el siguiente nivel
  getNextLevel(): string {
    const levels = ['easy', 'medium', 'advanced', 'expert'];
    const currentLevelIndex = levels.indexOf(this.getCurrentLevel());
    if (currentLevelIndex < levels.length - 1) {
      return levels[currentLevelIndex + 1];
    }
    return levels[currentLevelIndex]; // Si ya está en el nivel más alto, no cambia
  }

  // Método para restablecer el progreso (cuando se avanza de nivel o se reinicia)
  private resetProgress(): void {
    this.correctAnswersSubject.next(0);
    this.incorrectAnswersSubject.next(0);
    this.currentProgressSubject.next(0);
  }

  // Método para inicializar el progreso desde el servicio de progreso si es necesario
  async initializeUserProgress(userId: string) {
    try {
      const response = await this.progressService.getList({ userId, maxResultCount: 1 }).toPromise();
      if (response.items.length > 0) {
        const progressData = response.items[0];
        this.setCurrentLevel(progressData.level);
        this.correctAnswersSubject.next(progressData.successesWriting);
        this.incorrectAnswersSubject.next(progressData.errorsWriting);
        this.currentProgressSubject.next(progressData.progressLevelCurrent);
      }
    } catch (error) {
      console.error('Error al obtener progreso del usuario:', error);
    }
  }
}
