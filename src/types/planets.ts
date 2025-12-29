// UI Planet
export interface Planet {
  id: number;
  name: string;
  description: string;
  imageURL: string;

  // орбитальные параметры
  a?: number;
  e?: number;
  period?: number;
  t0?: number;
  status?: string;

  // вычисляемые
  perihelion?: number;
  aphelion?: number;
}

export interface CartState {
  count: number;
  user_id?: number;
  worldId?: number;
}

export interface FilterParams {
  name?: string;
  startDate?: string;
  endDate?: string;
}
