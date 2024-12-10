import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // Importamos BehaviorSubject

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {
  private isSpeakingSubject = new BehaviorSubject<boolean>(false); // Estado de si está hablando
  private isSpeaking: boolean = false; // Controla si el sistema está hablando

  constructor() {}

  // Método para hablar el texto
  speak(text: string): void {
    if (this.isSpeaking) {
      return; // Si ya está hablando, no hace nada
    }
    
    this.isSpeaking = true; // El sistema comienza a hablar
    this.isSpeakingSubject.next(true); // Emitimos que el sistema está hablando

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES'; // Puedes cambiar el idioma según sea necesario

    utterance.onend = () => {
      this.isSpeaking = false; // El sistema terminó de hablar
      this.isSpeakingSubject.next(false); // Emitimos que el sistema ya no está hablando
    };

    speechSynthesis.speak(utterance);
  }

  // Método para obtener el estado de si está hablando
  getIsSpeaking$() {
    return this.isSpeakingSubject.asObservable();
  }
}
