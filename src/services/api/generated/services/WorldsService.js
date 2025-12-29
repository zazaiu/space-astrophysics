import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorldsService {
    /**
     * Список заявок
     * @returns World Заявки
     * @throws ApiError
     */
    static getWorlds() {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/worlds',
        });
    }
    /**
     * Создать заявку (astronaut)
     * @returns any Заявка создана
     * @throws ApiError
     */
    static postWorlds() {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/worlds',
        });
    }
    /**
     * Обновить заявку (astronaut)
     * @param id
     * @returns any Заявка обновлена
     * @throws ApiError
     */
    static putWorlds(id) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/worlds/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Удалить заявку (astronaut)
     * @param id
     * @returns void
     * @throws ApiError
     */
    static deleteWorlds(id) {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/worlds/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Завершение заявки (mission_control)
     * @param id
     * @returns any Заявка завершена
     * @throws ApiError
     */
    static putWorldsComplete(id) {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/worlds/{id}/complete',
            path: {
                'id': id,
            },
        });
    }
}
