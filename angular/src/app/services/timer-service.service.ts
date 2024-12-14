import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private time = 0; // Tiempo en segundos

  constructor() {}

  // Método para iniciar el temporizador
  startTimer(): Observable<number> {
    return interval(1000).pipe(
      map(() => {
        this.time += 1;
        return this.time;
      })
    );
  }

  // Método para iniciar el auto-guardado del progreso
  autoSaveTimer(): Observable<void> {
    return interval(5000).pipe(map(() => {}));  // Auto-guardar cada 5 segundos
  }
}
