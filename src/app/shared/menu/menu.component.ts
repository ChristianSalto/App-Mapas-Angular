import { Component } from '@angular/core';

interface MenuItems {
  ruta: string;
  name: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MenuComponent {
  constructor() {}

  menuItems: MenuItems[] = [
    {
      ruta: '/mapas/fullscreen',
      name: 'FullScreen',
    },
    {
      ruta: '/mapas/zoom-range',
      name: 'Zoom Range',
    },
    {
      ruta: '/mapas/marcadores',
      name: 'Marcadores',
    },
    {
      ruta: '/mapas/propiedades',
      name: 'Propiedades',
    },
  ];
}
