import { Component, OnInit } from '@angular/core';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log(
      '🚀 ~ file: home.component.ts:15 ~ HomeComponent ~ ngOnInit ~ localStorage.getItem(EnumLocalStorage.ID_SHOP):',
      localStorage.getItem(EnumLocalStorage.ID_SHOP)
    );
  }
}
