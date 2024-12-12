import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechRecognitionService } from '../../services/speech-to-text-recognition.service';
import { ConfigStateService } from '@abp/ng.core';
import { ProgressService } from '@proxy/jlara-system-leng/progresses';
import { CreateUpdateProgressDto, ProgressDto } from '@proxy/jlara-system-leng/progresses/dtos';
import { TabComponent } from '../tab/tab.component';
import { of, interval, lastValueFrom } from 'rxjs';
import { switchMap, catchError, timeout } from 'rxjs/operators';
import { ExerciseService } from '@proxy/jlara-system-leng/exercise';

@Component({
  selector: 'app-pronunciation',
  templateUrl: './pronunciation.component.html',
  styleUrls: ['./pronunciation.component.scss'],
  standalone: true,
  imports: [TabComponent],
})
export class PronunciationComponent implements OnInit, OnDestroy {
  user = {
    name: '',
    level: '',
    image: '../../../assets/avatars/default_avatar.png',
  };
  currentWord = '';
  avatarState = '../../../assets/avatars/correct_request.png';
  wordList: string[] = [];
  wordAnswersCorrect: string[] = [];
  progress = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  timer = 0;
  feedback = '';
  private interval: any;
  currentUser: any;
  progressDto: ProgressDto;
  isLoading = false;
  createUpdateProgressDto: CreateUpdateProgressDto = {};

  constructor(
    private speechService: SpeechRecognitionService,
    private configStateService: ConfigStateService,
    private progressService: ProgressService,
    private exerciseService: ExerciseService
  ) {
    this.currentUser = this.configStateService.getOne('currentUser');
    this.user.name = this.currentUser.userName;
  }

  async ngOnInit() {
    try {
      await this.initializeUserProgress();
      await this.getExercise(this.user.level);
      this.startTimer();
      this.loadNextWord();

      if (this.speechService.isSupported) {
        this.speechService.initialize(
          (transcript: string) => this.evaluatePronunciation(transcript),
          (error: string) => (this.feedback = `Error: ${error}`)
        );
      } else {
        alert('Tu navegador no soporta la API de Reconocimiento de Voz.');
      }

      this.startAutoSave();
    } catch (error) {
      console.error('Error inicializando el componente:', error);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.speechService.stop();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  startAutoSave() {
    interval(5000) // Guardar cada 30 segundos en lugar de cada 1 segundo
      .pipe(
        switchMap(() => this.updateProgressUserDB()),
        catchError((error) => {
          console.error('Error al guardar el progreso del usuario:', error);
          return of(null);
        })
      )
      .subscribe();
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
  }

  async advanceLevel() {
    if (this.wordAnswersCorrect.length !== this.wordList.length || this.wordList.length === 0) {
      console.warn('El nivel no se puede avanzar porque no está completo o no hay palabras.');
      return;
    }
  
    const previousLevel = this.progressDto.level;
    switch (this.progressDto.level) {
      case 'easy':
        this.progressDto.level = 'medium';
        break;
      case 'medium':
        this.progressDto.level = 'advanced';
        break;
      case 'advanced':
        this.progressDto.level = 'expert';
        break;
      case 'expert':
        console.warn('Ya estás en el nivel máximo.');
        return;
    }
  
    this.wordList = [];
    this.wordAnswersCorrect = [];
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
  
    this.user.level = this.mapLevel(this.progressDto.level);
  
    if (previousLevel !== this.progressDto.level) {
      console.log(`Nivel cambiado a: ${this.user.level}`);
      await this.updateProgressUserDB();
      await this.getExercise(this.progressDto.level);
    }
  }
  

  startRecording() {
    this.feedback = 'Escuchando...';
    this.speechService.start((transcript: string) => this.evaluatePronunciation(transcript));
  }

  async evaluatePronunciation(userSpeech: string) {
    try {
      const normalizedUserSpeech = userSpeech.replace(/[?¿]/g, '').trim().toLowerCase();
      const normalizedCurrentWord = this.currentWord.replace(/[?¿]/g, '').trim().toLowerCase();
  
      if (normalizedUserSpeech === normalizedCurrentWord) {
        this.wordAnswersCorrect.push(this.currentWord);
        this.correctAnswers++;
        this.feedback = '¡Correcto! Pronunciación perfecta.';
        this.avatarState = '../../../assets/avatars/correct_request.png';
      } else {
        this.incorrectAnswers++;
        this.feedback = `Incorrecto. Dijiste: "${userSpeech}". La palabra era: "${this.currentWord}".`;
        this.avatarState = '../../../assets/avatars/error_request.png';
      }
      await this.updateProgress();
      this.loadNextWord();
    } catch (error) {
      console.error('Error evaluando la pronunciación:', error);
    }
  }
  
  async updateProgress() {
    const newProgress = (this.wordAnswersCorrect.length / this.wordList.length) * 100;
    if (newProgress > this.progress) {
      this.progress = newProgress;
    }
  }

  async initializeUserProgress() {
    this.isLoading = true;
    try {
      const response = await this.progressService
        .getList({ userId: this.currentUser.id, maxResultCount: 1 })
        .toPromise();
      if (response.items.length > 0) {
        this.progressDto = response.items[0];
        this.user.level = this.mapLevel(this.progressDto.level);
        this.progress = this.progressDto.progressLevelCurrent;
      }
    } catch (error) {
      console.error('Error cargando el progreso del usuario:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async updateProgressUserDB() {
    if (!this.progressDto) return;
  
    const secondsPractice = this.progressDto.secondsPractice + this.timer;
    const newProgressLevelCurrent = Math.max(
      this.progressDto.progressLevelCurrent,
      this.progress
    );
  
    this.createUpdateProgressDto = {
      secondsPractice,
      successesPronunciation: this.correctAnswers,
      errorsPronunciation: this.incorrectAnswers,
      progressLevelCurrent: newProgressLevelCurrent,
      userId: this.currentUser.id,
      level: this.mapLevel(this.user.level, true),
    };
  
    try {
      const response = await lastValueFrom(
        this.progressService
          .update(this.progressDto.id, this.createUpdateProgressDto)
          .pipe(timeout(10000))
      );
      console.log('Progreso actualizado:', response);
    } catch (err) {
      if (err.name === 'TimeoutError') {
        console.error('La solicitud de actualización del progreso excedió el tiempo límite.');
      } else {
        console.error('Error inesperado al actualizar progreso:', err);
      }
    }
  }

  private mapLevel(level: string, toDto: boolean = false): string {
    const levels = {
      easy: 'Fácil',
      medium: 'Medio',
      advanced: 'Avanzado',
      expert: 'Experto',
    };
    const mappedLevel = toDto
      ? Object.keys(levels).find((key) => levels[key] === level)
      : levels[level];
    return mappedLevel || 'Desconocido';
  }

  playFeedback() {
    const utterance = new SpeechSynthesisUtterance(this.feedback);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance); // Llamar al sintetizador de voz
  }

  async getExercise(levelDifficultyUser: string) {
    try {
      const response = await this.exerciseService
        .getList({
          difficultyLevel: levelDifficultyUser,
          focusArea: 'pronunciation',
          maxResultCount: 2,
        })
        .toPromise();
  
      if (response.items && response.items.length > 0) {
        this.wordList = response.items.map((item) => item.phrase.trim());
        console.log('Palabras cargadas exitosamente:', this.wordList);
  
        // Cargar la primera palabra al iniciar.
        this.loadNextWord();
      } else {
        console.warn('No se encontraron ejercicios para el nivel especificado.');
        this.feedback = 'No hay palabras disponibles para este nivel.';
      }
    } catch (error) {
      console.error('Error al obtener ejercicios:', error);
      this.feedback = 'Ocurrió un error al cargar los ejercicios. Por favor, inténtalo más tarde.';
    }
  }
}  