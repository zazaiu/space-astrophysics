import { API_BASE } from '../target_config';

class ApiService {
  private baseURL: string;

  constructor() {
    // Используем конфиг вместо хардкода
    this.baseURL = `${API_BASE}/api`;
    console.log('Desktop App API Base URL:', this.baseURL);
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('Desktop App API Request to:', url);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Desktop App API request failed:', error);
      // Возвращаем mock данные
      throw error;
    }
  }

  async getPlanets() {
    try {
      const data = await this.request('/planets');
      console.log('Desktop App - Planets data received:', data);
      return data;
    } catch (error) {
      console.log('Desktop App - Using mock planets data');
      return this.getMockPlanets();
    }
  }

  async getPlanet(id: string | number) {
    try {
      const data = await this.request(`/planets/${id}`);
      console.log('Desktop App - Planet data received:', data);
      return data;
    } catch (error) {
      console.log('Desktop App - Using mock planet data');
      return this.getMockPlanet(Number(id));
    }
  }

  private getMockPlanets() {
    return [
      {
        id: 1,
        name: "Меркурий",
        description: "Ближайшая к Солнцу планета",
        imageURL: "/planets/mercury.png",
        perihelion: 0.307,
        aphelion: 0.467
      },
      {
        id: 2,
        name: "Венера",
        description: "Вторая планета от Солнца", 
        imageURL: "/planets/venus.png",
        perihelion: 0.718,
        aphelion: 0.728
      },
      {
        id: 3,
        name: "Земля",
        description: "Наш дом",
        imageURL: "/planets/earth.png",
        perihelion: 0.983,
        aphelion: 1.017
      },
      {
        id: 4,
        name: "Марс",
        description: "Красная планета",
        imageURL: "/planets/mars.png", 
        perihelion: 1.381,
        aphelion: 1.666
      }
    ];
  }

  private getMockPlanet(id: number) {
    const planets: { [key: number]: any } = {
      1: {
        id: 1,
        name: "Меркурий", 
        description: "Ближайшая к Солнцу планета с экстремальными температурными перепадами",
        imageURL: "/planets/mercury.png",
        perihelion: 0.307,
        aphelion: 0.467
      },
      2: {
        id: 2,
        name: "Венера",
        description: "Вторая планета от Солнца с плотной атмосферой из углекислого газа",
        imageURL: "/planets/venus.png",
        perihelion: 0.718, 
        aphelion: 0.728
      },
      3: {
        id: 3,
        name: "Земля",
        description: "Третья планета от Солнца. Единственная известная планета с жизнью",
        imageURL: "/planets/earth.png",
        perihelion: 0.983,
        aphelion: 1.017
      },
      4: {
        id: 4,
        name: "Марс", 
        description: "Четвертая планета от Солнца. Известен как 'Красная планета'",
        imageURL: "/planets/mars.png",
        perihelion: 1.381,
        aphelion: 1.666
      }
    };
    
    return planets[id] || planets[1];
  }
}

export const apiService = new ApiService();