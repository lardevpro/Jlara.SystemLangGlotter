import { OnDestroy, OnInit } from "@angular/core";
import { ProgressService } from "@proxy/jlara-system-leng/progresses/progress.service";
import { SpeechRecognitionService } from "src/app/services/speech-to-text-recognition.service";
import { Component } from "@angular/core";
import { TabComponent } from "../tab/tab.component";
import { catchError, of, interval, lastValueFrom } from "rxjs";
import { FormsModule } from "@angular/forms";
import { ConfigStateService } from "@abp/ng.core";

@Component({
  standalone: true,
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.scss'],
  imports: [FormsModule, TabComponent]
})
export class WritingComponent implements OnInit, OnDestroy {
  user = {
    name: 'Usuario',
    level: 'Desconocido',
    image: '../../../assets/avatars/default_avatar.png',
  };

  wordAnswersCorrect: string[] = [];
  avatarState = '../../../assets/avatars/correct_request.png';
  wordList: string[] = [];
  currentWord = '';
  feedback = '';
  progress = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  timer = 0;
  userInput = '';
  private intervalId: any;
  private autoSaveInterval: any;
  progressDto: any;
  isLoading = false;

  constructor(private progressService: ProgressService,
                      configStateService: ConfigStateService,
  ) 
  {
    this.user.name = configStateService.getOne('currentUser').userName;

  }

  ngOnInit() {
    this.loadNextWord();
    this.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    clearInterval(this.autoSaveInterval);
  }

  async loadNextWord() {
    const remainingWords = this.wordList.filter(
      (word) => !this.wordAnswersCorrect.includes(word)
    );
    if (remainingWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingWords.length);
      this.currentWord = remainingWords[randomIndex];
    } else if (this.wordAnswersCorrect.length === this.wordList.length) {
      this.feedback = '¡Felicidades! Has completado el nivel.';
      await this.advanceLevel();
    } else {
      this.currentWord = '';
    }
    this.updateProgress();
  }

  async advanceLevel() {
    if (this.wordAnswersCorrect.length !== this.wordList.length) {
      console.warn('El nivel no se puede avanzar porque no está completo.');
      return;
    }

    this.progressStateService.advanceLevel(); // Servicio gestiona el cambio de nivel

    // Reset local
    this.wordList = [];
    this.wordAnswersCorrect = [];
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.progress = 0;

    await this.updateProgressUserDB();
    const newLevel = this.progressStateService.getCurrentLevel(); // Obtén el nuevo nivel
    await this.getExercise(newLevel); // Carga ejercicios del nuevo nivel
  }

  validateWord() {
    const normalizedInput = this.userInput.trim().toLowerCase();
    const normalizedCurrentWord = this.currentWord.trim().toLowerCase();

    if (normalizedInput === normalizedCurrentWord) {
      this.correctAnswers++;
      this.wordAnswersCorrect.push(this.currentWord);
      this.feedback = '¡Correcto!';
      this.avatarState = '../../../assets/avatars/correct_request.png';
      this.progressStateService.incrementCorrectAnswers(); // Aumenta los aciertos globales
    } else {
      this.incorrectAnswers++;
      this.feedback = `Incorrecto. La palabra correcta era: ${this.currentWord}`;
      this.avatarState = '../../../assets/avatars/error_request.png';
    }

    this.userInput = '';
    this.updateProgress();
    this.loadNextWord();
  }

  async updateProgress() {
    this.progress = (this.wordAnswersCorrect.length / this.wordList.length) * 100;
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  startAutoSave() {
    this.autoSaveInterval = interval(5000)
      .pipe(
        switchMap(() => this.updateProgressUserDB()),
        catchError((error) => {
          console.error('Error al guardar el progreso del usuario:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  playWord() {
    const utterance = new SpeechSynthesisUtterance(this.currentWord);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }

  validateWord() {
    if (this.userInput.toLowerCase() === this.currentWord.toLowerCase()) {
      this.correctAnswers++;
      this.feedback = '¡Correcto!';
      this.avatarState = '../../../assets/avatars/correct_request.png';
    } else {
      this.incorrectAnswers++;
      this.feedback = `Incorrecto. La palabra correcta era: ${this.currentWord}`;
      this.avatarState = '../../../assets/avatars/error_request.png';
    }
    this.userInput = '';
    this.progress = (this.correctAnswers / this.wordList.length) * 100;
    //this.updateProgress(false);
    this.loadNextWord();
  }

    updateProgress(isCompleted: boolean) {
      const progressData = {
        userId: '1', // Cambia esto por el ID del usuario actual
        progress: this.progress,
        isCompleted
      };

      this.progressService.create(progressData).pipe(
        catchError((error) => {
          console.error('Error al actualizar el progreso:', error);
          return of(null);
        })
      ).subscribe();
    }

  playFeedback() {
    const utterance = new SpeechSynthesisUtterance(this.feedback);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }

  async getExercise(levelDifficultyUser: string) {
    try {
      const response = await this.exerciseService.getList({
        difficultyLevel: levelDifficultyUser,
        focusArea: 'writing',
        maxResultCount: 10,
      }).toPromise();
  
      if (response.items && response.items.length > 0) {
        this.wordList = response.items.map((item) => item.phrase.trim());
        this.loadNextWord(); // Carga la primera palabra tras obtener las palabras
        console.log('Palabras cargadas exitosamente:', this.wordList);
      } else {
        console.warn('No se encontraron ejercicios para el nivel especificado.');
        this.feedback = 'No hay palabras disponibles para este nivel.';
      }
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      this.feedback = 'Ocurrió un error al cargar los ejercicios. Por favor, inténtalo más tarde.';
    }
  }

  private resetProgress() {
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.progress = 0;
    this.wordAnswersCorrect = [];
    this.timer = 0;
  }

}