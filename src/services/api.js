// Конфигурация API в зависимости от окружения
const IS_PRODUCTION = import.meta.env.PROD;
const BASE_PATH = IS_PRODUCTION ? '/space-astrophysics' : '';
export const API_CONFIG = {
    BASE_URL: IS_PRODUCTION
        ? `${BASE_PATH}/mock-data` // Для GitHub Pages используем мок-данные
        : '/api', // Для разработки используем локальный API
    IMAGES_URL: `${BASE_PATH}/images`,
    ENDPOINTS: {
        PLANETS: '/planets.json',
        PLANET_DETAIL: '/planets' // будет использоваться с ID
    }
};
// Функция для преобразования данных с бэкенда в формат фронтенда
export const adaptBackendPlanet = (backendPlanet) => {
    // A (большая полуось в а.е.) преобразуем в миллионы км (1 а.е. = 149.6 млн км)
    const distanceInMkm = (backendPlanet.A * 149.6).toFixed(1);
    return {
        id: backendPlanet.ID,
        name: backendPlanet.Name,
        description: backendPlanet.Description,
        image: backendPlanet.ImageURL || `${API_CONFIG.IMAGES_URL}/default.png`,
        distance: `${distanceInMkm} млн км`,
        orbitalPeriod: `${backendPlanet.Period} дней`,
        characteristics: {
            'Большая полуось (A)': `${backendPlanet.A} а.е.`,
            'Эксцентриситет (E)': backendPlanet.E.toString(),
            'Период обращения': `${backendPlanet.Period} дней`,
            'Эпоха (T0)': backendPlanet.T0.toString(),
            'Статус': backendPlanet.Status
        }
    };
};
// Функция для получения планет
export const fetchPlanets = async () => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PLANETS}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const backendPlanets = await response.json();
        // Фильтруем только активные планеты и адаптируем
        const activePlanets = backendPlanets.filter(planet => planet.Status === 'active');
        return activePlanets.map(adaptBackendPlanet);
    }
    catch (error) {
        console.error('Используем mock данные для планет:', error);
        // Возвращаем мок-данные при ошибке
        return getMockPlanets();
    }
};
// Функция для получения конкретной планеты
export const fetchPlanetById = async (id) => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PLANET_DETAIL}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const backendPlanet = await response.json();
        // Проверяем, активна ли планета
        if (backendPlanet.Status !== 'active') {
            return null;
        }
        return adaptBackendPlanet(backendPlanet);
    }
    catch (error) {
        console.error('Ошибка загрузки планеты:', error);
        return getMockPlanets().find(p => p.id === Number(id)) || null;
    }
};
// Мок-данные планет в формате BackendPlanet
const getMockPlanets = () => {
    const mockBackendPlanets = [
        {
            ID: 1,
            Name: "Меркурий",
            Description: "Самая маленькая планета Солнечной системы и ближайшая к Солнцу.",
            ImageURL: `${API_CONFIG.IMAGES_URL}/mercury.png`,
            Status: "active",
            A: 0.387,
            E: 0.2056,
            Period: 88,
            T0: 2451545.0
        },
        {
            ID: 2,
            Name: "Венера",
            Description: "Вторая планета от Солнца, самая горячая планета системы.",
            ImageURL: `${API_CONFIG.IMAGES_URL}/venus.png`,
            Status: "active",
            A: 0.723,
            E: 0.0068,
            Period: 225,
            T0: 2451545.0
        },
        {
            ID: 3,
            Name: "Земля",
            Description: "Третья планета от Солнца, единственная известная планета с жизнью.",
            ImageURL: `${API_CONFIG.IMAGES_URL}/earth.png`,
            Status: "active",
            A: 1.0,
            E: 0.0167,
            Period: 365.25,
            T0: 2451545.0
        },
        {
            ID: 4,
            Name: "Марс",
            Description: "Четвертая планета от Солнца, известная как Красная планета.",
            ImageURL: `${API_CONFIG.IMAGES_URL}/mars.png`,
            Status: "active",
            A: 1.524,
            E: 0.0934,
            Period: 687,
            T0: 2451545.0
        },
        {
            ID: 5,
            Name: "Юпитер",
            Description: "Крупнейшая планета Солнечной системы, газовый гигант.",
            ImageURL: `${API_CONFIG.IMAGES_URL}/jupiter.png`,
            Status: "active",
            A: 5.203,
            E: 0.0484,
            Period: 4332.59,
            T0: 2451545.0
        }
    ];
    // Используем адаптер для преобразования
    return mockBackendPlanets.map(adaptBackendPlanet);
};
// Вспомогательная функция для получения изображения
export const getPlanetImage = (imageName) => {
    return imageName.startsWith('http') || imageName.startsWith('/')
        ? imageName
        : `${API_CONFIG.IMAGES_URL}/${imageName}`;
};
// Вспомогательная функция для получения изображения планеты по ID
export const getPlanetImageById = (planetId) => {
    const planet = getMockPlanets().find(p => p.id === planetId);
    return planet ? planet.image : `${API_CONFIG.IMAGES_URL}/default.png`;
};
