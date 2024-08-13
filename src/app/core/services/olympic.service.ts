import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, filter, map, Observable, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[] | null>(null);

  constructor(private http: HttpClient) {}

  // Chargement des données initiales depuis le fichier JSON
  loadInitialData(): Observable<OlympicCountry[]> {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      // Mise à jour du BehaviorSubject avec les nouvelles données
      tap((value) => this.olympics$.next(value)),
      // Gestion des erreurs
      catchError((error) => {
        console.error(error);
        this.olympics$.next(null);
        // Retourne un observable d'erreur pour informer les abonnés de l'erreur
        return throwError(() => new Error('Erreur lors du chargement des données'));
      })
    );
  }

  getOlympics(): Observable<OlympicCountry[] | null> {
    return this.olympics$.asObservable();
  }

  getTotalGames(): Observable<number> {
    return this.olympics$.pipe(
      map(data => {
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
      map(data => data ? data.length : 0)
    );
  }

  getCountryDetails(id: string): Observable<OlympicCountry | null> {
    return this.olympics$.pipe(
      map(olympics => {
        if (!olympics) return null;
        const countryId = Number(id);
        return olympics.find(country => country.id === countryId) || null;
      })
    );
  }
}
