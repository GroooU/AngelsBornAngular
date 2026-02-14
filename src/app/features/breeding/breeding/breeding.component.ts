import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreedingSidebarComponent } from '../breeding-sidebar/breeding-sidebar.component';

@Component({
  selector: 'app-breeding',
  imports: [RouterLink, BreedingSidebarComponent],
  templateUrl: './breeding.component.html',
  styleUrl: './breeding.component.scss'
})
export class BreedingComponent {
  readonly literas = ['H', 'F', 'U', 'T', 'S', 'R', 'P', 'O', 'N', 'M', 'L', 'K', 'I', 'Z', 'J', 'E', 'D', 'G', 'V', 'B', 'A'];
}
