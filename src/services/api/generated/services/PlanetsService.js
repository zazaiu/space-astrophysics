import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlanetsService {
    /**
     * Список планет (guest, astronaut, mission_control)
     * @returns Planet Список планет
     * @throws ApiError
     */
    static getPlanets() {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/planets',
        });
    }
    /**
     * Создать планету (mission_control)
     * @returns any Планета создана
     * @throws ApiError
     */
    static postPlanets() {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/planets',
        });
    }
    /**
     * Детали планеты (guest, astronaut, mission_control)
     * @param id
     * @returns Planet Планета
     * @throws ApiError
     */
    static getPlanets1(id) {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/planets/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Обновить планету (mission_control)
     * @param id
     * @returns any Планета обновлена
     * @throws ApiError
     */
    static putPlanets(id) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/planets/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Удалить планету (mission_control)
     * @param id
     * @returns any Планета удалена
     * @throws ApiError
     */
    static deletePlanets(id) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/planets/{id}',
            path: {
                'id': id,
            },
        });
    }
}
