import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SpeechRecognitionService } from '../../services/speech-to-text-recognition.service';
import { ConfigStateService } from '@abp/ng.core';
import { ProgressService } from '@proxy/jlara-system-leng/progresses';
import { CreateUpdateProgressDto, ProgressDto } from '@proxy/jlara-system-leng/progresses/dtos';
import { TabComponent } from '../tab/tab.component';
import { timeout } from 'rxjs/operators';
import { of, interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

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
    image: '../../../assets/avatars/uifaces-popular-image (1).jpg',
  };
  currentWord = '';
  avatarState = '../../../assets/avatars/correct_request.png';
  wordList = ['hello', 'angular', 'speech', 'recognition'];
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
    private progressService: ProgressService
  ) {
    this.currentUser = this.configStateService.getOne('currentUser');
    this.user.name = this.currentUser?.userName || 'Usuario';
  }

  async ngOnInit() {
    try {
      await this.initializeUserProgress();
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
    clearInterval(this.interval);
    this.speechService.stop();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  startAutoSave() {
    interval(1000).pipe(
      switchMap(() => this.updateProgressUserDB()),
      catchError(error => {
        console.error('Error al guardar el progreso del usuario:', error);
        return of(null);
      })
    ).subscribe();
  }

  resetComponent() {
    clearInterval(this.interval);
    this.timer = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.progress = 0;
    //this.feedback = '';
    this.loadNextWord();
  }

  loadNextWord() {
    const remainingWords = this.wordList.filter(
      (word) => !this.wordAnswersCorrect.includes(word)
    );
    if (remainingWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingWords.length);
      this.currentWord = remainingWords[randomIndex];
      //this.feedback = '';
    } else {
      this.currentWord = '';
      this.feedback = '¡Felicidades! Has completado el nivel.';
    }
  }

  startRecording() {
    this.feedback = 'Escuchando...';
    this.speechService.start();
  }

  async evaluatePronunciation(userSpeech: string) {
    try {
      if (userSpeech.toLowerCase() === this.currentWord.toLowerCase()) {
        this.wordAnswersCorrect.push(this.currentWord);
        this.correctAnswers++;
        this.feedback = '¡Correcto! Pronunciación perfecta.';
        this.avatarState = '../../../assets/avatars/correct_request.png';
      } else {
        this.incorrectAnswers++;
        this.feedback = `Incorrecto. Dijiste: "${userSpeech}". La palabra era: "${this.currentWord}".`;
        this.avatarState = '../../../assets/avatars/error_request.png';
      }
      this.updateProgress();
      this.loadNextWord();
    } catch (error) {
      console.error('Error evaluando la pronunciación:', error);
    }
  }

  updateProgress() {
    this.progress =
      this.wordList.length > 0
        ? (this.wordAnswersCorrect.length / this.wordList.length) * 100
        : 0;
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
    this.createUpdateProgressDto = {
      secondsPractice: secondsPractice,
      successesPronunciation: this.correctAnswers,
      errorsPronunciation: this.incorrectAnswers,
      progressLevelCurrent: this.progress,
      userId: this.currentUser.id,
      level: this.mapLevelToDto(this.user.level),
    };

    try {
      const response = await this.progressService
        .update(this.progressDto.id, this.createUpdateProgressDto)
        .pipe(timeout(10000))
        .toPromise();
      console.log('Progreso actualizado:', response);
    } catch (err) {
      console.error('Error al actualizar progreso:', err);
    }
  }

  private mapLevel(level: string): string {
    switch (level) {
      case 'easy':
        return 'Principiante';
      case 'medium':
        return 'Medio';
      case 'advanced':
        return 'Avanzado';
      case 'expert':
        return 'Experto';
      default:
        return 'Desconocido';
    }
  }

  private mapLevelToDto(level: string): string {
    switch (level) {
      case 'Principiante':
        return 'easy';
      case 'Medio':
        return 'medium';
      case 'Avanzado':
        return 'advanced';
      case 'Experto':
        return 'expert';
      default:
        return 'unknown';
    }
  }
  playFeedback() {
    const utterance = new SpeechSynthesisUtterance(this.feedback);
    utterance.lang = 'en-US'; // Configura el idioma
    speechSynthesis.speak(utterance);
  }
}
