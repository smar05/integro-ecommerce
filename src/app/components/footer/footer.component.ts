import { Component, OnInit } from '@angular/core';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';
import { IShopsData } from 'src/app/interfaces/i-shops-data';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  public shopData: IShopsData = null;

  constructor() {}

  ngOnInit(): void {
    this.editFooter();
  }

  private editFooter(): void {
    this.shopData = JSON.parse(
      localStorage.getItem(EnumLocalStorage.SHOP_DATA) || null
    );
    let siteFooter: HTMLElement = document.querySelector('#footer');

    siteFooter.style.backgroundColor = this.shopData.footer_color || 'black';
  }
}
