import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { HistoryComponent } from './features/history/history.component';
import { DogsListComponent } from './features/dogs/dogs-list/dogs-list.component';
import { DogProfileComponent } from './features/dogs/dog-profile/dog-profile.component';
import { BreedingComponent } from './features/breeding/breeding/breeding.component';
import { PometDetailComponent } from './features/breeding/pomet-detail/pomet-detail.component';
import { PuppiesComponent } from './features/puppies/puppies.component';
import { NewsComponent } from './features/news/news.component';
import { ContactsComponent } from './features/contacts/contacts.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: "Главная" },
  { path: 'istoriya', component: HistoryComponent, title: "История" },
  { path: 'nashi-sobaki', component: DogsListComponent, title: "Наши собаки" },
  { path: 'nashi-sobaki/:slug', component: DogProfileComponent, title: "Собака" },
  { path: 'nashe-razvedenie', component: BreedingComponent, title: "Наше разведение" },
  { path: 'nashe-razvedenie/pomet/:letter', component: PometDetailComponent, title: "Помёт" },
  { path: 'schenki', component: PuppiesComponent, title: "Щенки" },
  { path: 'novosti', component: NewsComponent, title: "Новости" },
  { path: 'kontaktyi', component: ContactsComponent, title: "Контакты" },
  { path: '**', redirectTo: '' }
];
