import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechRecognitionService } from '../../services/speech-to-text-recognition.service';

@Component({
  selector: 'app-pronunciation',
  templateUrl: './pronunciation.component.html',
  styleUrls: ['./pronunciation.component.scss'],
  standalone: true,
})
export class Pronunciation implements OnInit, OnDestroy {
  user = { name: 'John Doe', level: 1, image: '../../../assets/avatars/uifaces-popular-image (1).jpg' };
  currentWord = '';
  avatarState = '../../../assets/avatars/correct_request.png'; // Estado inicial del avatar
  wordList = ['hello', 'world', 'angular', 'speech', 'recognition'];
  wordAnswersCorrect = [];
  progress = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  timer = 0;
  feedback = '';
  private interval: any;

  constructor(private speechService: SpeechRecognitionService) {}

  ngOnInit() {
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
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.speechService.stop();
  }

  startTimer() {
    this.interval = setInterval(() => {
        this.timer++;
        //this.resetComponent();
      }, 1000);
    }
    
  resetComponent() {
    clearInterval(this.interval);
    this.timer = 0;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.progress = 0;
    this.feedback = '';
    this.loadNextWord();
  }

  loadNextWord() {
    const remainingWords = this.wordList.filter(word => !this.wordAnswersCorrect.includes(word));
    if (remainingWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingWords.length);
      this.currentWord = remainingWords[randomIndex];
      this.feedback = ''; // Limpiar feedback al cargar una nueva palabra
    } else {
      this.currentWord = '';
      this.feedback = '¡Felicidades! Has completadoel nivel.';
      //cambiar nivel al usuario

      
    }
  }

  startRecording() {
    this.feedback = 'Escuchando...';
    this.speechService.start();
  }

  evaluatePronunciation(userSpeech: string) {
    if (userSpeech.toLowerCase() === this.currentWord.toLowerCase()) {
      this.wordAnswersCorrect.push(this.currentWord);
      this.correctAnswers++;
      this.feedback = '¡Correcto! Pronunciación perfecta.';
      this.avatarState = '../../../assets/avatars/correct_request.png'; // Cambia el avatar
    } else {
      this.incorrectAnswers++;
      this.feedback = `Incorrecto. Dijiste: "${userSpeech}". La palabra era: "${this.currentWord}".`;
      this.avatarState = '../../../assets/avatars/error_request.png'; // Cambia el avatar
    }
    this.updateProgress();
    this.loadNextWord();
  }

  playFeedback() {
    const utterance = new SpeechSynthesisUtterance(this.feedback);
    utterance.lang = 'en-US'; // Configura el idioma
    speechSynthesis.speak(utterance);
  }

  updateProgress() {
    //const totalAttempts = this.correctAnswers + this.incorrectAnswers;
    this.progress = this.wordList.length > 0 ? (this.correctAnswers / this.wordList.length) * 100 : 0;
  }
}
