// src/hooks/usePlanets.ts
import { useState, useEffect } from 'react';
import type { Planet, CartState } from '../types/planets'; // Добавляем type

export const usePlanets = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [cart, setCart] = useState<CartState>({ count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock данные
        const mockPlanets: Planet[] = [
          {
            id: 1,
            name: "Меркурий",
            description: "Ближайшая к Солнцу планета",
            imageURL: "/images/mercury.jpg",
            perihelion: 0.307,
            aphelion: 0.467
          },
          {
            id: 2,
            name: "Венера", 
            description: "Вторая планета от Солнца",
            imageURL: "/images/venus.jpg",
            perihelion: 0.718,
            aphelion: 0.728
          },
          {
            id: 3,
            name: "Земля",
            description: "Наш дом",
            imageURL: "/images/earth.jpg",
            perihelion: 0.983,
            aphelion: 1.017
          },
          {
            id: 4,
            name: "Марс",
            description: "Красная планета", 
            imageURL: "/images/mars.jpg",
            perihelion: 1.381,
            aphelion: 1.666
          }
        ];

        setPlanets(mockPlanets);
        setCart({ count: 0 });
      } catch (error) {
        console.log('Using mock data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { planets, cart, loading };
};