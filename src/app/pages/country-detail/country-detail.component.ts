import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import {Color, NgxChartsModule, ScaleType} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  standalone: true,
  imports: [
    NgxChartsModule
  ],
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  public country: OlympicCountry | null = null;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  private subscription: Subscription = new Subscription();

  public chartData: any[] = [];
  public view: [number, number] = [700, 400];
  public colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#a8385d', '#7aa3e5', '#a27ea8', '#aae3f5', '#adcded']
  };

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
            this.totalMedals = this.calculateTotalMedals(country);
            this.totalAthletes = this.calculateTotalAthletes(country);
            this.chartData = this.transformData(country);
          }
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private transformData(country: OlympicCountry): any[] {
    return country.participations.map(participation => ({
      name: participation.year.toString(),
      value: participation.medalsCount
    }));
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
