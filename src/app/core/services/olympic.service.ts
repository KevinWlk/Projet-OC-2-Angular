import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
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
    return new Observable<number>((observer) => {
      this.olympics$.subscribe((data) => {
        if (data) {
          const totalGames = data.reduce((acc, country) => acc + country.participations.length, 0);
          observer.next(totalGames);
        } else {
          observer.next(0);
        }
      });
    });
  }

  getTotalCountries(): Observable<number> {
    return new Observable<number>((observer) => {
      this.olympics$.subscribe((data) => {
        if (data) {
          observer.next(data.length);
        } else {
          observer.next(0);
        }
      });
    });
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
