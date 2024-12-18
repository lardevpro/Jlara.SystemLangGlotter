import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechRecognitionService } from '../../services/speech-to-text-recognition.service';
import { ConfigStateService } from '@abp/ng.core';
import { ProgressService } from '@proxy/jlara-system-leng/progresses';
import { CreateUpdateProgressDto, ProgressDto } from '@proxy/jlara-system-leng/progresses/dtos';
import { TabComponent } from '../tab/tab.component';
import { of, interval, lastValueFrom } from 'rxjs';
import { switchMap, catchError, timeout } from 'rxjs/operators';
import { ExerciseService } from '@proxy/jlara-system-leng/exercise';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressStateService } from 'src/app/services/progress-state-service.service';

@Component({
  selector: 'app-pronunciation',
  templateUrl: './pronunciation.component.html',
  styleUrls: ['./pronunciation.component.scss'],
  standalone: true,
  imports: [TabComponent, CommonModule],
})
export class PronunciationComponent implements OnInit, OnDestroy {
  user = {
    name: '',
    level: '',
    image: '../../../assets/avatars/default_avatar.png',
    id: '',
  };
  totalHits = 0;
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
  isLevelCompleted: boolean;

  constructor(
    private speechService: SpeechRecognitionService,
    private configStateService: ConfigStateService,
    private progressService: ProgressService,
    private exerciseService: ExerciseService,
    private router: Router,
    private progressStateService: ProgressStateService,
  ) {
    this.currentUser = this.configStateService.getOne('currentUser');
    this.user.name = this.currentUser.userName;
    this.user.id = this.currentUser.id;
  }

  /**
   * Navigate to the progress screen.
   */
  navigateToProgress() {
    this.router.navigate(['/progress']); // Reemplaza '/progress' con la ruta de tu pantalla de progreso
  }

  /**
   * Initialize the component.
   */
  async ngOnInit() {
    try {
      await this.initializeUserProgress();
      await this.getExercise(this.progressDto.level);
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

  /**
   * Clean up the component.
   */
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.speechService.stop();
  }

  /**
   * Start the timer.
   */
  startTimer() {
    this.interval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  /**
   * Start auto-saving the progress.
   */
  startAutoSave() {
    interval(5000) // Save every 5 seconds instead of every 1 second
      .pipe(
        switchMap(() => this.updateProgressUserDB()),
        catchError((error) => {
          console.error('Error al guardar el progreso del usuario:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Load the next word.
   */
  async loadNextWord() {
    // Filter the words that have not been answered correctly
    const remainingWords = this.wordList.filter(
      (word) => !this.wordAnswersCorrect.includes(word)
    );

    // Check if there are remaining words
    if (remainingWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingWords.length);
      this.currentWord = remainingWords[randomIndex];
    } else {
      // If there are no remaining words and the user has answered all correctly
      if (this.correctAnswers >= 20) {
        this.feedback = '¡Felicidades! Has completado el nivel.';
        await this.advanceLevel();
      } else {
        this.feedback = 'No hay más palabras disponibles para este nivel.';
      }
    }
  
    this.updateProgress(); // Actualizar la barra de progreso
  }

  /**
   * Advance to the next level.
   */
  async advanceLevel() {
    const totalCorrectAnswers = this.correctAnswers + this.progressDto.successesWriting;

    if (totalCorrectAnswers < 20) {
      console.warn('El nivel no se puede avanzar porque no se ha alcanzado el umbral de 20 aciertos.');
      return;
    }

    // Reset local variables
    this.wordList = [];
    this.wordAnswersCorrect = [];
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.progress = 0;
    this.wordAnswersCorrect = [];
    this.user.level = this.mapLevel(this.progressDto.level);
  
    // Guardar el progreso actualizado en la base de datos
    await this.updateProgressUserDB();
    const newLevel = this.progressStateService.getNextLevel(); // Get the new level
    await this.getExercise(newLevel); // Load exercises for the new level
  }

  /**
   * Start recording the user's speech.
   */
  startRecording() {
    this.feedback = 'Escuchando...';
    this.speechService.start((transcript: string) => this.evaluatePronunciation(transcript));
  }

  /**
   * Evaluate the user's pronunciation.
   * @param userSpeech The user's speech.
   */
  async evaluatePronunciation(userSpeech: string) {
    try {
      // Normalize the user's speech and the current word
      const normalizeText = (text: string): string =>
        text.replace(/[?¿]/g, '').trim().toLowerCase();

      const normalizedUserSpeech = normalizeText(userSpeech);
      const normalizedCurrentWord = normalizeText(this.currentWord);

      // Compare the normalized texts
      if (normalizedUserSpeech === normalizedCurrentWord) {
        this.correctAnswers++;
        this.feedback = '¡Correcto! Pronunciación perfecta.';
        this.avatarState = '../../../assets/avatars/correct_request.png';
      } else {
        this.incorrectAnswers++;
        this.feedback = `Incorrecto. Dijiste: "${userSpeech}". La palabra era: "${this.currentWord}".`;
        this.avatarState = '../../../assets/avatars/error_request.png';
      }

      this.updateProgress();

      // Check if the user has completed 20 correct words
      if (this.correctAnswers >= 20) {
        this.feedback = '¡Felicidades! Has completado el nivel.';
        await this.advanceLevel();
        return;
      }

      // Load the next word
      this.loadNextWord();
    } catch (error) {
      console.error('Error evaluando la pronunciación:', error);
    }
  }

  /**
   * Update the progress.
   */
  async updateProgress() {
    // Calculate the progress by adding pronunciation and writing successes
    const totalCorrectAnswers = this.correctAnswers + this.progressDto.successesWriting;
    this.progress = totalCorrectAnswers; // The progress is the sum of both successes
  }

  /**
   * Initialize the user's progress.
   */
  async initializeUserProgress() {
    this.isLoading = true;
    try {
      const response = await this.progressService
        .getList({ userId: this.currentUser.id, maxResultCount: 1 })
        .toPromise();

      if (response.items.length > 0) {
        this.progressDto = response.items[0];
        console.log('Progreso cargado:', this.progressDto);
        this.user.level = this.mapLevel(this.progressDto.level);
        this.totalHits = this.progressDto.successesPronunciation + this.progressDto.successesWriting;
        this.correctAnswers = this.progressDto.successesPronunciation || 0;
        this.incorrectAnswers = this.progressDto.errorsPronunciation || 0;

        // Load the number of correct words and update the progress
        this.correctAnswers = this.progressDto.successesPronunciation || 0;
        this.updateProgress();
      }
    } catch (error) {
      console.error('Error cargando el progreso del usuario:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Update the user's progress in the database.
   */
  async updateProgressUserDB() {
    if (!this.progressDto) return;

    const totalCorrectAnswers = this.correctAnswers + this.progressDto.successesWriting;
    const secondsPractice = this.progressDto.secondsPractice + this.timer;

    const newProgressLevelCurrent = Math.max(
      this.progressDto.progressLevelCurrent,
      this.progress
    );

    const updateDto = {
      secondsPractice,
      progressLevelCurrent: newProgressLevelCurrent, // Shared progress
      successesPronunciation: this.correctAnswers, // Pronunciation successes
      errorsPronunciation: this.incorrectAnswers, // Pronunciation errors
      errorsWriting: this.progressDto.errorsWriting, // Writing errors
      successesWriting: this.progressDto.successesWriting, // Writing successes
      userId: this.user.id,
      level: this.mapLevel(this.user.level, true), // Shared level
    };

    if (totalCorrectAnswers >= 20) {
      await this.advanceLevel();
    }

    // Save the progress with pronunciation errors
    try {
      const response = await lastValueFrom(
        this.progressService.update(this.progressDto.id, updateDto).pipe()
      );
      console.log('Progreso actualizado:', response);
    } catch (error) {
      console.error('Error al actualizar el progreso del usuario:', error);
    }
  }

  /**
   * Map the level to a readable format.
   * @param level The level to map.
   * @param toDto Whether to map to DTO format.
   * @returns The mapped level.
   */
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

  /**
   * Play the feedback using speech synthesis.
   */
  playFeedback() {
    const utterance = new SpeechSynthesisUtterance(this.feedback);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance); // Call the speech synthesizer
  }

  /**
   * Get exercises for the specified level.
   * @param levelDifficultyUser The difficulty level of the user.
   */
  async getExercise(levelDifficultyUser: string) {
    try {
      const response = await this.exerciseService
        .getList({
          difficultyLevel: levelDifficultyUser,
          focusArea: 'pronunciation',
          maxResultCount: 20,
        })
        .toPromise();

      if (response.items && response.items.length > 0) {
        this.wordList = response.items.map((item) => item.phrase.trim());
        console.log('Palabras cargadas exitosamente:', this.wordList);

        // Load the first word at the start.
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