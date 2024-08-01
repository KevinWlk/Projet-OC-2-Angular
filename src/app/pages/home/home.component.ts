import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<OlympicCountry[] | null> = new Observable();
  public chartData: any[] = [];

  public showLegend: boolean = false;
  public showLabels: boolean = true;
  public explodeSlices: boolean = false;
  public doughnut: boolean = false;
  public view: [number, number] = [0, 0]; // Initialisation avec un tuple

  public colorScheme: Color = {
    name: 'nightLights',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#6d3a4a',
      '#827fa4',
      '#967fa4',
      '#8fb7b6',
      '#7292a4']
  };

  private subscription: Subscription = new Subscription(); // Pour gérer les abonnements

  public totalGames$: Observable<number>;
  public totalCountries$: Observable<number>;

  constructor(private olympicService: OlympicService) {
    this.totalGames$ = this.olympicService.getTotalGames();
    this.totalCountries$ = this.olympicService.getTotalCountries();
  }

  ngOnInit(): void {
    // Initialisation de l'observable olympics$
    this.olympics$ = this.olympicService.getOlympics();
    // Souscription à l'observable et transformation des données
    this.subscription.add(this.olympics$.subscribe(data => {
      if (data) {
        this.chartData = this.transformData(data);
      }
    }));
    // Redimensionnement initial du graphique
    this.onResize();
  }

  ngOnDestroy(): void {
    // Désinscription de toutes les souscriptions pour éviter les fuites de mémoire
    this.subscription.unsubscribe();
  }

  // Transformation des données des pays olympiques en un format adapté pour le graphique
  private transformData(data: OlympicCountry[]): any[] {
    return data.map(country => ({
      name: country.country,
      value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
    }));
  }

  // Écoute de l'événement de redimensionnement de la fenêtre et mise à jour de la taille du graphique
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.view = [window.innerWidth / 1.10, 600]; // Assurer que c'est un tuple
  }
}
