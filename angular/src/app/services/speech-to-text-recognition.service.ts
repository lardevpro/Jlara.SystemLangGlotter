import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  isSupported = false;

  constructor(private zone: NgZone) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.isSupported = true;
    }
  }

  /**
   * Configura los eventos del reconocimiento de voz.
   * @param onResult Callback ejecutado cuando se reconoce la voz.
   * @param onError Callback ejecutado en caso de error.
   */
  initialize(
    onResult: (transcript: string) => void,
    onError: (error: string) => void
  ) {
    if (!this.isSupported || !this.recognition) return;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.zone.run(() => {
        onResult(transcript);
      });
    };

    this.recognition.onerror = (event: any) => {
      this.zone.run(() => {
        onError(event.error);
      });
    };
  }

  /**
   * Inicia el reconocimiento de voz.
   */
  start(p0: (transcript: string) => void) {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  /**
   * Detiene el reconocimiento de voz.
   */
  stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
