import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99;
      }

      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMap!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-3.662092460828238, 40.401853079856814];
  markers: MarkerColor[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: this.zoomLevel,
    });

    this.readLocalStorage();

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo';

    // new mapboxgl.Marker({
    //   // element: markerHtml,
    // })
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);
  }

  addMarker() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color,
    })
      .setLngLat(this.center)
      .addTo(this.mapa);

    this.markers.push({
      color,
      marker: newMarker,
    });

    this.saveLocalStorage();

    newMarker.on('dragend', () => {
      this.saveLocalStorage();
    });
  }

  goMarker(marker: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marker!.getLngLat(),
    });
  }

  saveLocalStorage() {
    const lngLatArr: MarkerColor[] = [];

    this.markers.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color,
        center: [lng, lat],
      });
    });

    localStorage.setItem('marker', JSON.stringify(lngLatArr));
  }

  readLocalStorage() {
    if (!localStorage.getItem('marker')) {
      return;
    }

    const lngLatArr: MarkerColor[] = JSON.parse(
      localStorage.getItem('marker')!
    );

    lngLatArr.forEach((m) => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.center!)
        .addTo(this.mapa);

      this.markers.push({
        marker: newMarker,
        color: m.color,
      });

      newMarker.on('dragend', () => {
        this.saveLocalStorage();
      });
    });
  }

  removeMarker(i: number) {
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);

    this.saveLocalStorage();
  }
}
