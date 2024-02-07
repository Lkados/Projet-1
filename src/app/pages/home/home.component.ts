import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {CountryData} from "../../core/models/Olympic";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public graphData$: Observable<{id: number; name: string; value: number; }[]> | undefined;

  constructor(private olympicService: OlympicService, private router: Router) {}

  // initialisation du composant et modification des données pour l'affichage avec ngx-charts
  ngOnInit(): void {
    this.graphData$ = this.olympicService.getOlympics().pipe(
      map((countries: CountryData[] | null) =>
        countries?.map(country => ({
          id: country.id,
          name: country.country,
          value: country.participations.reduce((acc, curr) => acc + curr.medalsCount, 0),
        })) ?? []
      )
    );
  }

// Méthode de gestion des clics sur les barres du graphique
  onBarClick(event: any) {
    // Récupérez le nom du pays depuis les données de l'événement
    const countryName = event.name;

    // On soucris a l'observale sinon je peut pas recupérer les données de l'événement
    this.olympicService.getOlympics().subscribe((countries: CountryData[] | null) => {
      // Trouvez le pays correspondant au nom
      const selectedCountry = countries?.find(country => country.country === countryName);

      if (selectedCountry) {
        // Récupérez l'ID du pays
        const countryId = selectedCountry.id;
        // Effectuez la redirection vers la page de détail avec l'ID du pays en tant que paramètre de route
        this.router.navigate(['detail', countryId]);
      }
    });
  }

}
