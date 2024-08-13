import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { CounterComponent } from "../../counter/counter.component";

@Component({
  selector: 'app-countryDetail',
  templateUrl: './countryDetail.component.html',
  standalone: true,
  imports: [NgxChartsModule, CounterComponent],
  styleUrls: ['./countryDetail.component.scss']
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  public country: OlympicCountry | null = null;
  private subscription: Subscription = new Subscription();

  public chartData: any[] = [];
  public view: [number, number] = [700, 400];
  public colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded']
  };

  // Initialisation des observables avec `of(0)` pour éviter les erreurs
  public totalAthletes$: Observable<number> = of(0);
  public participationsCount$: Observable<number> = of(0);
  public totalMedals$: Observable<number> = of(0);

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.subscription.add(
        this.olympicService.getCountryDetails(id).subscribe(country => {
          if (country) {
            this.country = country;
            this.participationsCount$ = of(country.participations.length);
            this.totalMedals$ = of(this.calculateTotalMedals(country));
            this.totalAthletes$ = of(this.calculateTotalAthletes(country));
            this.chartData = this.transformData(country);
          } else {
            // Redirige vers la page 404 si le pays n'existe pas
            this.router.navigate(['/not-found']);
          }
        })
      );
    });
    // Redimensionnement initial du graphique
    this.onResize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private transformData(country: OlympicCountry): any[] {
    return [{
      name: country.country,
      series: country.participations.map(participation => ({
        name: participation.year.toString(),
        value: participation.medalsCount
      }))
    }];
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    const ratio = 16 / 9; // Ratio d'aspect classique pour un graphique
    const width = window.innerWidth / 1.10;
    const height = width / ratio;
    this.view = [width, height];
  }


  private calculateTotalMedals(country: OlympicCountry): number {
    return country.participations.reduce((sum, p) => sum + p.medalsCount, 0);
  }

  private calculateTotalAthletes(country: OlympicCountry): number {
    return country.participations.reduce((sum, p) => sum + p.athleteCount, 0);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
