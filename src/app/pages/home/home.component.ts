import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[] | null> = new Observable();
  public chartData: any[] = [];

  public showLegend: boolean = true;
  public showLabels: boolean = true;
  public explodeSlices: boolean = false;
  public doughnut: boolean = false;
  public colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#1f77b4']
  };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe(data=> {
      if (data) {
        this.chartData = this.transformData(data);
      }
    })
  }
  private transformData(data: OlympicCountry[]): any[] {
    return data.map(country => ({
      name: country.country,
      value: country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
    }));
  }
}
