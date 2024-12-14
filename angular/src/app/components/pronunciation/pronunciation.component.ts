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
  isLevelCompleted: boolean;

  constructor(
    private speechService: SpeechRecognitionService,
    private configStateService: ConfigStateService,
    private progressService: ProgressService,
    private exerciseService: ExerciseService,
    private router: Router
  ) {
    this.currentUser = this.configStateService.getOne('currentUser');
    this.user.name = this.currentUser.userName;
  }

  navigateToProgress() {
    this.router.navigate(['/progress']); // Reemplaza '/progress' con la ruta de tu pantalla de progreso
  }


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
    // Filtrar las palabras que no han sido acertadas
    const remainingWords = this.wordList.filter(
      (word) => !this.wordAnswersCorrect.includes(word)
    );
  
    // Verificar si hay palabras restantes
    if (remainingWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingWords.length);
      this.currentWord = remainingWords[randomIndex];
    } else {
      // Si no hay palabras restantes y el usuario acertó todas
      if (this.correctAnswers >= 20) {
        this.feedback = '¡Felicidades! Has completado el nivel.';
        await this.advanceLevel();
      } else {
        this.feedback = 'No hay más palabras disponibles para este nivel.';
      }
    }
  
    this.updateProgress(); // Actualizar la barra de progreso
  }
  

  async advanceLevel() {
    // Verificar que se cumpla el requisito de 20 aciertos
    if (this.correctAnswers < 20) {
      console.warn('El nivel no se puede avanzar porque no se han alcanzado los aciertos requeridos.');
      return;
    }
  
    // Asignar el siguiente nivel
    if (this.progressDto.level === 'easy') {
      this.progressDto.level = 'medium';
    } else if (this.progressDto.level === 'medium') {
      this.progressDto.level = 'advanced';
    } else if (this.progressDto.level === 'advanced') {
      this.progressDto.level = 'expert';
    } else {
      this.feedback = '¡Has completado todos los niveles disponibles!';
      this.isLevelCompleted = true; // Nivel completado
      return; // Detener si ya no hay más niveles
    }
  
    // Reiniciar valores
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.progress = 0;
    this.wordAnswersCorrect = [];
    this.user.level = this.mapLevel(this.progressDto.level);
  
    // Guardar el progreso actualizado en la base de datos
    await this.updateProgressUserDB();
  
    // Cargar nuevos ejercicios para el siguiente nivel
    await this.getExercise(this.progressDto.level);
  
    // Feedback para el usuario
    this.feedback = `¡Felicidades! Ahora estás en el nivel ${this.user.level}.`;
    this.isLevelCompleted = true; // Marcar el nivel como completado
  }
  
  startRecording() {
    this.feedback = 'Escuchando...';
    this.speechService.start((transcript: string) => this.evaluatePronunciation(transcript));
  }

  async evaluatePronunciation(userSpeech: string) {
    try {
      // Normalizar el discurso del usuario y la palabra actual
      const normalizeText = (text: string): string =>
        text.replace(/[?¿]/g, '').trim().toLowerCase();
  
      const normalizedUserSpeech = normalizeText(userSpeech);
      const normalizedCurrentWord = normalizeText(this.currentWord);
  
      // Comparar los textos normalizados
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
  
      // Verificar si el usuario ha completado 20 palabras acertadas
      if (this.correctAnswers >= 20) {
        this.feedback = '¡Felicidades! Has completado el nivel.';
        await this.advanceLevel();
        return;
      }
  
      // Cargar la siguiente palabra
      this.loadNextWord();
    } catch (error) {
      console.error('Error evaluando la pronunciación:', error);
    }
  }

  async updateProgress() {
    const requiredWords = 20;
    const newProgress = Math.min((this.correctAnswers / requiredWords) * 100, 100);
    this.progress = newProgress;
  }  

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
        
        // Carga el número de palabras acertadas y actualiza el progreso
        this.correctAnswers = this.progressDto.successesPronunciation || 0;
        this.updateProgress();
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
  
    const updateDto = {
      secondsPractice,
      progressLevelCurrent: newProgressLevelCurrent, // Progreso compartido
      successesPronunciation: this.correctAnswers, // Aciertos específicos de pronunciación
      errorsPronunciation: this.incorrectAnswers, // Errores específicos de pronunciación
      userId: this.currentUser.id,
      level: this.mapLevel(this.user.level, true), // Nivel compartido
    };
  
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
          difficultyLevel: this.user.level,
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