import {CountryParticipation} from "./Participation";

export interface CountryData {
  id: number;
  country: string;
  participations: CountryParticipation[];
}
