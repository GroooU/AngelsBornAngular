import { Injectable } from '@angular/core';

export interface ContactInfo {
  city: string;
  phones: string[];
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactInfoService {
  private readonly contact: ContactInfo = {
    city: 'г. Москва',
    phones: ['+7 (916) 675-29-28', '+7 (925) 601-38-00'],
    email: 'angelsborn@yandex.ru'
  };

  getContactInfo(): ContactInfo {
    return this.contact;
  }
}
