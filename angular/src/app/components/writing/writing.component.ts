import { OnDestroy, OnInit } from "@angular/core";
import { ProgressService } from "@proxy/jlara-system-leng/progresses/progress.service";
import { Component } from "@angular/core";
import { TabComponent } from "../tab/tab.component";
import { catchError, of } from "rxjs";
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
  wordList = ['hello', 'world', 'angular', 'typescript', 'javascript'];
  currentWord = '';
  feedback = '';
  progress = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  timer = 0;
  userInput = '';
  private intervalId: any;

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

  startTimer() {
    this.intervalId = setInterval(() => {
      this.timer++;
    }, 1000);
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
      utterance.lang = 'en-US'; // Configura el idioma
      speechSynthesis.speak(utterance);
    }
}
