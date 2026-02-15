import { Component, input } from '@angular/core';
import { PuppyCardData } from '../models/puppy-card-data';

@Component({
  selector: 'app-puppy-card',
  standalone: true,
  templateUrl: './puppy-card.component.html',
  styleUrl: './puppy-card.component.scss',
})
export class PuppyCardComponent {
  readonly puppy = input.required<PuppyCardData>();
}
