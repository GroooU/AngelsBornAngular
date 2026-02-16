import { Component } from '@angular/core';
import { LitterHeaderComponent } from '../breeding/litter-header/litter-header.component';
import { PuppyCardComponent } from '../breeding/puppy-card/puppy-card.component';
import { litterHeaderByLetter } from '../breeding/data/litter-headers-by-letter';
import { puppiesByLetter } from '../breeding/data/puppies-by-letter';
import { littersOnPuppiesPage } from '../breeding/data/litters-on-puppies-page';

@Component({
  selector: 'app-puppies',
  imports: [LitterHeaderComponent, PuppyCardComponent],
  templateUrl: './puppies.component.html',
  styleUrl: './puppies.component.scss'
})
export class PuppiesComponent {
  readonly littersOnPuppiesPage = littersOnPuppiesPage;
  readonly litterHeaderByLetter = litterHeaderByLetter;
  readonly puppiesByLetter = puppiesByLetter;
}
