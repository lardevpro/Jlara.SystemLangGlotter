import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {
  private recognition: any;
  private subject: Subject<string> = new Subject<string>();

  constructor() {
    this.initializeRecognition();
  }

  // Inicializa el reconocimiento de voz
  initializeRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        this.subject.next(transcript); // Emitir el texto reconocido
      };
      this.recognition.onerror = (event: any) => {
        console.error(`Error en el reconocimiento de voz: ${event.error}`);
      };
    } else {
      console.error('SpeechRecognition no está soportado en este navegador');
    }
  }

  // Inicia el reconocimiento de voz
  startRecognition(): void {
    this.recognition.start();
  }

  // Observable para obtener el texto reconocido
  getRecognizedText(): Observable<string> {
    return this.subject.asObservable();
  }
}
