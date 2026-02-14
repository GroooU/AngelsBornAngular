import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breeding-sidebar',
  imports: [RouterLink],
  templateUrl: './breeding-sidebar.component.html',
  styleUrl: './breeding-sidebar.component.scss'
})
export class BreedingSidebarComponent {
  /** Текущая активная литера (для подсветки на странице помёта). */
  activeLetter = input<string | null>(null);

  readonly literas = ['H', 'F', 'U', 'T', 'S', 'R', 'P', 'O', 'N', 'M', 'L', 'K', 'I', 'Z', 'J', 'E', 'D', 'G', 'V', 'B', 'A'];
}
