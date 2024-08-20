import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<OlympicCountry[] | null> = new Observable();
  public chartData: { id: number; name: string; value: number }[] = [];

  public showLegend: boolean = false;
  public showLabels: boolean = true;
  public explodeSlices: boolean = false;
  public doughnut: boolean = false;
  public view: [number, number] = [0, 0]; // Tuple typé

  public colorScheme: Color = {
    name: 'nightLights',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#6d3a4a',
      '#827fa4',
      '#967fa4',
      '#8fb7b6',
      '#7292a4'
    ]
  };

  private subscription: Subscription = new Subscription();

  public totalGames$: Observable<number>;
  public totalCountries$: Observable<number>;

  constructor(private olympicService: OlympicService, private router: Router) {
    this.totalGames$ = this.olympicService.getTotalGames();
    this.totalCountries$ = this.olympicService.getTotalCountries();
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.subscription.add(this.olympics$.subscribe(data => {
      if (data) {
        this.chartData = this.transformData(data);
      }
    }));
    this.onResize();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private transformData(data: OlympicCountry[]): { id: number; name: string; value: number }[] {
    return data.map(country => ({
      id: country.id,
      name: country.country,
      value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
    }));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const ratio = 16 / 9;
    const width = window.innerWidth / 1.10;
    const height = width / ratio;
    this.view = [width, height];
  }

  goToDetail(id: number): void {
    this.router.navigate(['/country', id]);
  }

  onCountrySelect(event: { name: string }): void {
    const selectedCountry = this.chartData.find(country => country.name === event.name);
    if (selectedCountry) {
      this.router.navigate(['/country', selectedCountry.id]);
    }
  }
}
