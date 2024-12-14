import { Component, OnInit } from '@angular/core';
import { TabComponent } from "../tab/tab.component";
import { ProgressDto } from '@proxy/jlara-system-leng/progresses/dtos';
import { ProgressService } from '@proxy/jlara-system-leng/progresses';
import { ConfigStateService } from '@abp/ng.core';




@Component({
  standalone: true,
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  imports: [TabComponent],
})
export class ProgressComponent implements OnInit {

  //variables globales
  hoursPracticed: number = 0;
  minPracticed: number =  0;
  segPracticed: number = 0;
  userName: string;
  userPhoto: string = 'https://via.placeholder.com/70';
  level: string;
  progressLevel: number = 0; //de 0 a 20 frases que hay por nivel
  writtenSuccesses: number = 0; 
  pronunciationSuccesses: number  = 0;
  recommendation: string = 'Practica vocabulario nuevo todos los días.';
  inspirationalQuote: string = 'La práctica hace al maestro.';
  progressDto: ProgressDto | null = null;
  time: { hours: number, minutes: number, seconds: number } = { 
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  currentUser: any;
  isLoading: boolean = true;

  constructor(
    
    private configStateService: ConfigStateService,
    private progressService: ProgressService,
    
  ) {

    
    this.currentUser = this.configStateService.getOne("currentUser");
    const userId = this.currentUser.id;


    this.userName = this.currentUser?.userName || 'Usuario';
    this.inspirationalQuote = this.getRandomInspirationalQuote(); 
    }


  async ngOnInit(): Promise<void> {
      this.loadUserProgress();
  }

    async loadUserProgress(): Promise<void> {
      this.progressService.getList({
        userId: this.currentUser.id,
        maxResultCount: 1
      }).subscribe({
        next: (result) => {
          this.progressDto = result.items[0];
          if(this.progressDto == null) {
            this.initProgress();
          }
            this.initHtmlDataUser()
          if (result.items.length == 0) {
            
          } 
        },
        error: (error) => {
          console.log("Error al obtener el progreso del usuario", error);
          this.initProgress();
        },
        complete: () => {
          console.log("Progreso del usuario obtenido");
          this.showUserValues();
        }
      });
    }
  
  async showUserValues(): Promise<void> {
    const time = this.convertSecondsToDhms(this.progressDto.secondsPractice);
    this.initHtmlDataUser();  
  }
  

  //funcion para pasar de segundos a horas y minutos
  async convertSecondsToDhms(seconds: number): Promise <void> {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    this.hoursPracticed = Math.floor(seconds / 3600);
    seconds %= 3600;
    this.minPracticed = Math.floor(seconds / 60);
    this.segPracticed = seconds %= 60;
  }


  //funcion que elige una frase motivacional de un array de frases
  getRandomInspirationalQuote(): string {
    const quotes = [
      'La práctica hace al maestro.',
      'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
      'No hay atajos para llegar a los lugares que valen la pena.',
      'La motivación nos impulsa a comenzar y el hábito nos permite continuar.',
      'El aprendizaje es un tesoro que seguirá a su dueño a todas partes.'
    ];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }



    //inicializa el progreso del usuario
  async initProgress(): Promise<void> {
    const currentUser = this.configStateService.getOne("currentUser");
        
      this.progressDto = {
            userId: currentUser.id,
            secondsPractice: 0,
            successesPronunciation: 0,
            successesWriting: 0,
            progressLevelCurrent: 0,
            level: 'easy',
            errorsPronunciation: 0,
            errorsWriting: 0,
            motivationalPhrase: 'Bienvenido a tu primer día de práctica',
        };
        this.progressService.create(this.progressDto).subscribe({
            next: (result) => {
                console.log(result);
            },
            error: (error) => {
                console.log("Error al crear el progreso del usuario", error);
            },
            complete: () => {
                console.log("Progreso del usuario creado");
            }
        });
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

  initHtmlDataUser() {
    //this.userPhoto: string = 'https://via.placeholder.com/70';
    this.level = this.mapLevel(this.progressDto.level);
    
    this.progressLevel = this.progressDto.progressLevelCurrent; //de 0 a 20 frases que hay por nivel
    this.writtenSuccesses =  this.progressDto.successesWriting /20 * 100; 
    this.pronunciationSuccesses =  this.progressDto.successesPronunciation /20 * 100;
    console.log(this.progressDto); 
    }
}


