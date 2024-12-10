import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private successSound: HTMLAudioElement;
  private errorSound: HTMLAudioElement;

  constructor() {
    // Inicializar los sonidos
    this.successSound = new Audio('assets/sounds/success.mp3');
    this.errorSound = new Audio('assets/sounds/error.mp3');
  }

  // Reproducir el sonido de éxito
  playSuccessSound(): void {
    this.successSound.play();
  }

  // Reproducir el sonido de error
  playErrorSound(): void {
    this.errorSound.play();
  }

  // Reproducir un sonido personalizado
  playCustomSound(soundUrl: string): void {
    const sound = new Audio(soundUrl);
    sound.play();
  }
}
