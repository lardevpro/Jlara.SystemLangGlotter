import { Component } from '@angular/core';


//Direcciones para cargar el componente
@Component({
  selector: 'app-footer',//nombre de llamada
  templateUrl: './footer.component.html',//plantilla html
  styleUrls: ['./footer.component.scss'],//estilos creados para este componente
  standalone: true, //importar componentes
})

export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}

