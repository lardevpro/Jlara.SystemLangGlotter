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

  // Global variables
  hoursPracticed: number = 0;
  minPracticed: number = 0;
  segPracticed: number = 0;
  userName: string;
  userPhoto: string = '../../../assets/avatars/default_avatar.png';
  level: string;
  progressLevel: number = 0; // from 0 to 20 phrases per level
  writtenSuccesses: number = 0;
  pronunciationSuccesses: number = 0;
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

  /**
   * Initialize the component.
   */
  async ngOnInit(): Promise<void> {
    this.loadUserProgress();
  }

  /**
   * Load the user's progress.
   */
  async loadUserProgress(): Promise<void> {
    this.progressService.getList({
      userId: this.currentUser.id,
      maxResultCount: 1
    }).subscribe({
      next: (result) => {
        this.progressDto = result.items[0];
        if (this.progressDto == null) {
          this.initProgress();
        }
        this.initHtmlDataUser();
        if (result.items.length == 0) {
          // Handle case where no progress is found
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

  /**
   * Show the user's values.
   */
  async showUserValues(): Promise<void> {
    const time = this.convertSecondsToDhms(this.progressDto.secondsPractice);
    this.initHtmlDataUser();
  }

  /**
   * Convert seconds to hours, minutes, and seconds.
   * @param seconds The total seconds to convert.
   */
  async convertSecondsToDhms(seconds: number): Promise<void> {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    this.hoursPracticed = Math.floor(seconds / 3600);
    seconds %= 3600;
    this.minPracticed = Math.floor(seconds / 60);
    this.segPracticed = seconds %= 60;
  }

  /**
   * Get a random inspirational quote from an array of quotes.
   * @returns A random inspirational quote.
   */
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

  /**
   * Initialize the user's progress.
   */
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

  /**
   * Initialize the HTML data for the user.
   */
  initHtmlDataUser() {
    this.level = this.progressDto.level === 'easy' ? 'Fácil' :
      this.progressDto.level === 'medium' ? 'Medio' :
        this.progressDto.level === 'advanced' ? 'Avanzado' :
          this.progressDto.level === 'expert' ? 'Experto' :
            'Desconocido';
    this.progressLevel = this.progressDto.progressLevelCurrent; // from 0 to 20 phrases per level
    this.writtenSuccesses = this.progressDto.successesWriting;
    this.pronunciationSuccesses = this.progressDto.successesPronunciation;
  }
}