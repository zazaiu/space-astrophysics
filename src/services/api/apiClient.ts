// src/services/api/apiClient.ts

export interface PlanetAPI {
  id: number
  name: string
  description: string
  image_url?: string
  status: string
  a: number
  e: number
  period: number
  t0: number
}

// Планеты
export const getAllPlanets = async (): Promise<PlanetAPI[]> => {
  const res = await fetch('http://localhost:8080/api/planets')
  if (!res.ok) throw new Error('Ошибка загрузки планет')
  return res.json()
}

export const getPlanetById = async (id: number): Promise<PlanetAPI> => {
  const res = await fetch(`http://localhost:8080/api/planets/${id}`)
  if (!res.ok) throw new Error('Ошибка загрузки планеты')
  return res.json()
}
