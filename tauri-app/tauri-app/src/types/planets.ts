// src/types/planet.ts
export interface Planet {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  perihelion: number;
  aphelion: number;
}

export interface PlanetPosition {
  planet: Planet;
  r_au: number;
  nu_deg: number;
}

export interface World {
  id: number;
  date: string;
  results: PlanetPosition[];
}



export interface CartState {
  count: number;
  user_id?: number;
  worldId?: number;
}
export interface FilterParams {
  startDate?: string;
  endDate?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
}