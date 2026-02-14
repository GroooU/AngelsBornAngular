import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-puppies',
  imports: [RouterLink],
  templateUrl: './puppies.component.html',
  styleUrl: './puppies.component.scss'
})
export class PuppiesComponent {}
