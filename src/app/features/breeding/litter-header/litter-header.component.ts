import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LitterHeaderData } from '../models/litter-header-data';

@Component({
  selector: 'app-litter-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './litter-header.component.html',
  styleUrl: './litter-header.component.scss',
})
export class LitterHeaderComponent {
  readonly data = input.required<LitterHeaderData>();
}
