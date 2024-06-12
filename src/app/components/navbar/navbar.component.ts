import { Component, OnInit } from '@angular/core';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';
import { IShopsData } from 'src/app/interfaces/i-shops-data';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public shopData: IShopsData = null;

  constructor() {}

  ngOnInit(): void {
    this.editNavbar();
  }

  private editNavbar(): void {
    this.shopData = JSON.parse(
      localStorage.getItem(EnumLocalStorage.SHOP_DATA) || null
    );
    let navbar: HTMLElement = document.querySelector('#navbar');
    let menu: HTMLElement = document.querySelector('#site-navigation');

    navbar.style.backgroundColor = this.shopData.navbar_color || 'white';
    menu.style.backgroundColor = this.shopData.menu_color || 'white';
  }
}
