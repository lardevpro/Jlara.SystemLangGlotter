import { Component } from '@angular/core';
import { TabComponent } from "../tab/tab.component";
import { ConfigStateService } from '@abp/ng.core';




@Component({
  selector: 'app-pronunciation',
  standalone: true,
  imports: [TabComponent],
  templateUrl: './pronunciation.component.html',
  styleUrl: './pronunciation.component.scss'
})
export class PronunciationComponent  {


    practiceTime: number = 0;
    intervalId: any;
    correctAnswers: number = 0;
    incorrectAnswers: number = 0;
    userName: string;
    userLevel: string;
    userProgress: number = 50; // 50% de progreso
    isRecording: boolean = false;
    isFeedbackActive: boolean = false; 
    phraseToSay: string;
    progressBarValue: number = 0;
    exerciseList: any[] = [];
    currentUserId: string;
  

  constructor(
    configStateService: ConfigStateService,
    
    
    
  ) {
    // Obtener datos del usuario
    const currentUser = configStateService.getOne("currentUser");
    this.userName = currentUser.userName;
    this.currentUserId = currentUser.id;
  
    
  }
  
  ngOnInit(): void {
    //this.getExercises(this.exerciseList);
    console.log(this.exerciseList);
    this.startTimer();
    this.chooseRandomExercise();
    // this.getDificultyLevel();
  
  }





  // getExercises(exerciseList : string []): void {
  //   const input : ExerciseGetListInput = { //una lista de querys 
  //     difficultyLevel: 'easy',
  //     maxResultCount: 20,
  //   };

  //   this.exerciseService.getList(input).subscribe(result => {
  //     this.exerciseList = result.items;
  //     console.log(this.exerciseList);
  //   });
  // }

  //elige un ejercicio aleatorio que no esté en la lista de ejercicios acertados del usuario
  chooseRandomExercise(): void {
    console.log(this.exerciseList);
    const completedExercises = ['The sky is blue', 'exercise2']; // Simulación de ejercicios realizados
    const availableExercises = this.exerciseList.filter(exercise => !completedExercises.includes(exercise.phrase));
    
    if (availableExercises.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableExercises.length);
      const randomExercise = availableExercises[randomIndex];
      console.log('Ejercicio aleatorio seleccionado:', randomExercise);
      this.phraseToSay = randomExercise.phrase;
    } else {
      console.log('No hay ejercicios disponibles que no hayan sido completados.');
    }
  }

  ngOnDestroy(): void {
    // Detener temporizador al cambiar de componente
    this.stopTimer();
    // Guardar los datos (aquí simulado con console.log)
    this.saveData();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.practiceTime++;
    }, 1000); // Incrementa el tiempo cada segundo
  }

  stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Métodos para registrar aciertos y fallos
  registerCorrect(): void {
    this.correctAnswers++;
  }

  registerIncorrect(): void {
    this.incorrectAnswers++;
  }

 // Simular la grabación de audio
 startRecording(): void {
  if (this.isFeedbackActive) return; // No permitir grabación mientras el sistema da feedback

  this.isRecording = true;
  console.log('Grabando...');
  // Lógica para grabar audio aquí (usando Web APIs o algún servicio)
}

// Finalizar grabación y dar feedback
  stopRecording(): void {
    this.isRecording = false;
    console.log('Grabación detenida');
    this.giveFeedback();
  }

  // Simulación de feedback
  giveFeedback(): void {
    this.isFeedbackActive = true;
    this.progressBarValue = 80; // Aumentar el progreso mientras se da feedback

    // Después de 2 segundos, se desactiva el feedback y se actualiza la barra de progreso
    setTimeout(() => {
      this.isFeedbackActive = false;
      this.progressBarValue = 100; // Completa el progreso cuando termina el feedback
    }, 2000);
  }

  // Guardar los datos de la práctica
  saveData(): void {
    console.log('Guardando datos:');
    console.log(`Tiempo: ${this.practiceTime} segundos`);
    console.log(`Aciertos: ${this.correctAnswers}, Fallos: ${this.incorrectAnswers}`);
    // Aquí iría el código para guardar en la base de datos
  }
}
