// src/services/api/apiClient.ts
// Планеты
export const getAllPlanets = async () => {
    const res = await fetch('http://localhost:8080/api/planets');
    if (!res.ok)
        throw new Error('Ошибка загрузки планет');
    return res.json();
};
export const getPlanetById = async (id) => {
    const res = await fetch(`http://localhost:8080/api/planets/${id}`);
    if (!res.ok)
        throw new Error('Ошибка загрузки планеты');
    return res.json();
};
