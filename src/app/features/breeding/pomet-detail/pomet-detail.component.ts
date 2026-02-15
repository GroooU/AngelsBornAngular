import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BreedingSidebarComponent } from '../breeding-sidebar/breeding-sidebar.component';
import { LitterHeaderComponent } from '../litter-header/litter-header.component';
import { PuppyCardComponent } from '../puppy-card/puppy-card.component';
import { litterHeaderByLetter } from '../data/litter-headers-by-letter';
import { puppiesByLetter } from '../data/puppies-by-letter';

@Component({
  selector: 'app-pomet-detail',
  imports: [RouterLink, BreedingSidebarComponent, LitterHeaderComponent, PuppyCardComponent],
  templateUrl: './pomet-detail.component.html',
  styleUrl: './pomet-detail.component.scss'
})
export class PometDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly literas = ['H', 'F', 'U', 'T', 'S', 'R', 'P', 'O', 'N', 'M', 'L', 'K', 'I', 'Z', 'J', 'E', 'D', 'G', 'V', 'B', 'A'];

  readonly letter = toSignal(
    this.route.paramMap.pipe(map((params) => (params.get('letter') ?? '').toUpperCase())),
    { initialValue: '' }
  );

  readonly litterHeaderByLetter = litterHeaderByLetter;
  readonly puppiesByLetter = puppiesByLetter;
}
