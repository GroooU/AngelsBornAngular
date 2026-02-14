import { Component, input, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent {
  /** Дополнительный класс для ul (например, menu__footer в футере). */
  listClass = input<string>('');
  /** Открыто ли мобильное меню (для класса .active). */
  menuOpen = input<boolean>(false);

  protected readonly listClassName = computed(() =>
    ['menu__list', this.listClass(), this.menuOpen() ? 'active' : ''].filter(Boolean).join(' ')
  );

  readonly navItems: NavItem[] = [
    { path: '', label: 'главная' },
    { path: 'istoriya', label: 'история' },
    { path: 'nashi-sobaki', label: 'наши собаки' },
    { path: 'nashe-razvedenie', label: 'наше разведение' },
    { path: 'schenki', label: 'щенки' },
    { path: 'novosti', label: 'новости' },
    { path: 'kontaktyi', label: 'контакты' }
  ];
}
