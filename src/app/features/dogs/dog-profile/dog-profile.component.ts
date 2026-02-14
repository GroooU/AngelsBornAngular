import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

const SLUG_TO_TITLE: Record<string, string> = {
  'ultramarines-butterfly': 'Ultramarines Butterfly',
  'varinhouse-young-and-beautiful': 'Varinhouse Young and Beautiful',
  'angel-s-born-alicia-rey': "Angel's Born Alicia Rey",
  'angel-s-born-belanta': "Angel's Born Belanta",
  'angel-s-born-gwen-stacy': "Angel's Born Gwen Stacy",
  'ledi-angel': 'Ledi Angel',
  'berry': 'Berry'
};

@Component({
  selector: 'app-dog-profile',
  imports: [RouterLink],
  templateUrl: './dog-profile.component.html',
  styleUrl: './dog-profile.component.scss'
})
export class DogProfileComponent {
  private readonly route = inject(ActivatedRoute);

  readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: '' }
  );
  readonly pageTitle = computed(() => SLUG_TO_TITLE[this.slug()] ?? this.slug() ?? 'Собака');
}
