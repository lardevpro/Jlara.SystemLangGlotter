import { Component, OnDestroy, OnInit } from '@angular/core';
import { TabComponent } from "../tab/tab.component";
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms';
import { ConfigStateService } from '@abp/ng.core';


@Component({
  selector: 'app-writing',
  standalone: true,
  imports: [
    TabComponent,
    CommonModule, // Replace BrowserModule with CommonModule
    FormsModule,
  ],
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.scss']
})
export class WritingComponent implements OnInit, OnDestroy {
  practiceTime: number = 0;
  intervalId: any;
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  userName: string;
  userLevel: string = 'Principiante';
  userProgress: number = 50;
  phraseToWrite: string = '"Hello, how are you?"';
  userInput: string = '';
  isFeedbackActive: boolean = false;
  progressBarValue: number = 0;
  
  

  constructor(
    private config: ConfigStateService
  ) { 
    const currentUser = this.config.getOne("currentUser");
    this.userName = currentUser.userName;
  }
  
  
  

  
  
  

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.saveData();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.practiceTime++;
    }, 1000);
  }

  stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  registerCorrect(): void {
    this.correctAnswers++;
  }

  registerIncorrect(): void {
    this.incorrectAnswers++;
  }

  giveFeedback(): void {
    this.isFeedbackActive = true;
    this.progressBarValue = 80;
    setTimeout(() => {
      this.isFeedbackActive = false;
      this.progressBarValue = 100;
    }, 2000);
  }

  checkAnswer(): void {
    if (this.userInput.trim().toLowerCase() === this.phraseToWrite.trim().toLowerCase()) {
      this.registerCorrect();
    } else {
      this.registerIncorrect();
    }
    this.giveFeedback();
    this.userInput = '';
  }

  saveData(): void {
    console.log('Guardando datos:');
    console.log(`Tiempo: ${this.practiceTime} segundos`);
    console.log(`Aciertos: ${this.correctAnswers}, Fallos: ${this.incorrectAnswers}`);
  }
}
