import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[] | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<OlympicCountry[]> {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value: OlympicCountry[]) => this.olympics$.next(value)),
      catchError((error) => {
        console.error(error);
        this.olympics$.next(null);
        return throwError(() => new Error('Erreur lors du chargement des données'));
      })
    );
  }

  getOlympics(): Observable<OlympicCountry[] | null> {
    return this.olympics$.asObservable();
  }

  getTotalGames(): Observable<number> {
    return this.olympics$.pipe(
      map((data: OlympicCountry[] | null) => {
        if (!data) return 0;
        const uniqueYears = new Set<number>();
        data.forEach(country => {
          country.participations.forEach(participation => {
            uniqueYears.add(participation.year);
          });
        });
        return uniqueYears.size;
      })
    );
  }

  getTotalCountries(): Observable<number> {
    return this.olympics$.pipe(
      map((data: OlympicCountry[] | null) => data ? data.length : 0)
    );
  }

  getCountryDetails(id: string): Observable<OlympicCountry | null> {
    return this.olympics$.pipe(
      map((olympics: OlympicCountry[] | null) => {
        if (!olympics) return null;
        const countryId = Number(id);
        return olympics.find(country => country.id === countryId) || null;
      })
    );
  }
}
