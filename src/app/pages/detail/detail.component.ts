import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CountryData } from '../../core/models/Olympic';
import { CountryParticipation } from '../../core/models/Participation';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  countryId!: number;
  country: CountryData | undefined;
  chartData$: Observable<{ name: string; value: number; }[]> | undefined;

  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    // Récupérez l'ID du pays à partir de la route
    this.route.paramMap.subscribe(params => {
      this.countryId = parseInt(params.get('id') || '', 10);
      console.log(this.countryId);
      // Utilisez l'ID pour obtenir les données du pays
      this.olympicService.getOlympics().subscribe((countries: CountryData[] | null) => {
        if (countries && this.countryId !== undefined) {
          this.country = countries.find(country => country.id === this.countryId);
          console.log(this.country);
          // on prépare les donnés pour ngx-charts
          if (this.country) {
            // Vu que map me retounre un tableau de type { name: string; value: number; } on le transforme en observable en utilisant 'of'
            this.chartData$ = of(this.country.participations.map((participation: CountryParticipation) => ({
              name: participation.year.toString(),
              value: participation.medalsCount,
            })));
          }
        }
      });
    });
  }

  // Méthode pour retourner à la page d'accueil
  goBack() {
    this.router.navigate(['']);
  }

  getTotalMedalsCount() {
    return this.country?.participations.reduce((acc, curr) => acc + curr.medalsCount, 0);
  }

  getTotalAthletesCount() {
    return this.country?.participations.reduce((acc, curr) => acc + curr.athleteCount, 0);
  }
}
