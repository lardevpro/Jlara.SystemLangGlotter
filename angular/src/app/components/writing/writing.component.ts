import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProgressService } from "@proxy/jlara-system-leng/progresses/progress.service";
import { TabComponent } from "../tab/tab.component";
import { catchError, of, interval, lastValueFrom } from "rxjs";
import { FormsModule } from "@angular/forms";
import { ConfigStateService } from "@abp/ng.core";
import { switchMap } from "rxjs/operators";
import { ExerciseService } from "@proxy/jlara-system-leng/exercise";
import { ProgressStateService } from "src/app/services/progress-state-service.service";
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.scss'],
  imports: [FormsModule, TabComponent, CommonModule]
})
export class WritingComponent implements OnInit, OnDestroy {
  user = {
    id: '',
    name: 'Usuario',
    level: '',
    image: '../../../assets/avatars/default_avatar.png',
  };
  totalHits = 0;
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

  constructor(
    private progressService: ProgressService,
    private configStateService: ConfigStateService,
    private exerciseService: ExerciseService,
    private progressStateService: ProgressStateService,
  ) {
    const currentUser = this.configStateService.getOne('currentUser');
    this.user.name = currentUser.userName;
    this.user.id = currentUser.id;

    // Sincronizar nivel inicial desde el servicio compartido
    this.progressStateService.currentLevel$.subscribe((level) => {
      this.user.level = this.mapLevel(level);
      this.resetProgress();
      this.getExercise(level); // Cargar ejercicios del nivel actual
    });
  }

  async ngOnInit() {
    try {
      await this.initializeUserProgress();
      await this.getExercise(this.progressDto.level);
      this.startTimer();
      this.startAutoSave();
    } catch (error) {
      console.error('Error inicializando el componente:', error);
    }
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
    const totalCorrectAnswers = this.correctAnswers + this.progressDto.successesPronunciation;
  
    // Solo cambiamos de nivel si la suma de ambos aciertos es >= 20
    if (totalCorrectAnswers < 20) {
      console.warn('El nivel no se puede avanzar porque no se ha alcanzado el umbral de 20 aciertos.');
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
      this.incorrectAnswers++; // Incrementamos los fallos
      this.feedback = `Incorrecto. La palabra correcta era: ${this.currentWord}`;
      this.avatarState = '../../../assets/avatars/error_request.png';
    }

    this.userInput = '';
    this.updateProgress();
    this.loadNextWord();
  }

  async updateProgress() {
    const totalCorrectAnswers = this.correctAnswers + this.progressDto.successesPronunciation;
    this.progress = totalCorrectAnswers; // El progreso es la suma de los aciertos
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

  async initializeUserProgress() {
    this.isLoading = true;
    try {
      const response = await lastValueFrom(
        this.progressService.getList({ userId: this.user.id, maxResultCount: 1 })
      );
      if (response.items.length > 0) {
        this.progressDto = response.items[0];
        this.totalHits = this.progressDto.successesPronunciation + this.progressDto.successesWriting;
        this.correctAnswers = this.progressDto.successesWriting;
        this.incorrectAnswers = this.progressDto.errorsWriting; // Cargamos los fallos de escritura
      }
    } catch (error) {
      console.error('Error cargando el progreso del usuario:', error);
    } finally {
      this.isLoading = false;
    }
  }

   async updateProgressUserDB() {
    if (!this.progressDto) return;

    const totalCorrectAnswers = this.correctAnswers + this.progressDto.successesPronunciation;
    const secondsPractice = this.progressDto.secondsPractice + this.timer;

    const newProgressLevelCurrent = Math.max(
      this.progressDto.progressLevelCurrent,
      this.progress
    );

    const updateDto = {
      secondsPractice,
      progressLevelCurrent: newProgressLevelCurrent, // Progreso compartido
      successesWriting: this.correctAnswers, // Aciertos de escritura
      errorsWriting: this.incorrectAnswers, // Fallos de escritura
      successesPronunciation: this.progressDto.successesPronunciation, // Aciertos de pronunciación
      errorsPronunciation: this.progressDto.errorsPronunciation, // Fallos de pronunciación
      
      userId: this.user.id,
      level: this.mapLevel(this.user.level, true), // Nivel compartido
    };

    if (totalCorrectAnswers >= 20) {
      await this.advanceLevel();
    }

    // Guardamos el progreso con los fallos de escritura
    try {
      const response = await lastValueFrom(
        this.progressService.update(this.progressDto.id, updateDto).pipe()
      );
      console.log('Progreso actualizado:', response);
    } catch (error) {
      console.error('Error al actualizar el progreso del usuario:', error);
    }
  }

  private mapLevel(level: string, toDto: boolean = false): string {
    const levels = {
      easy: 'Fácil',
      medium: 'Medio',
      advanced: 'Avanzado',
      expert: 'Experto',
    };
    return toDto
      ? Object.keys(levels).find((key) => levels[key] === level) || 'Desconocido'
      : levels[level] || 'Desconocido';
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
