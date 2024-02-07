import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {CountryData} from "../models/Olympic";


@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<CountryData[] | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<CountryData[] | null> {
    return this.http.get<CountryData[]>(this.olympicUrl).pipe(
      tap((data: CountryData[]) => this.olympics$.next(data)),
      catchError((error) => {
        console.error('Error loading the olympic data:', error);
        this.olympics$.next([]); // Utiliser un tableau vide pour éviter les problèmes si les données ne sont pas chargées
        return of(null); // Retourne un Observable qui émet null
      })
    );
  }

  getOlympics(): Observable<CountryData[] | null> {
    return this.olympics$.asObservable();
  }
}
