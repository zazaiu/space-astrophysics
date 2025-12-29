/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { World } from '../models/World';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export type { World } from '../models/World';
export class WorldsService {
    /**
     * Список заявок
     * @returns World Заявки
     * @throws ApiError
     */
    public static getWorlds(): CancelablePromise<Array<World>> {
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
    public static postWorlds(): CancelablePromise<any> {
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
    public static putWorlds(
        id: number,
    ): CancelablePromise<any> {
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
    public static deleteWorlds(
        id: number,
    ): CancelablePromise<void> {
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
    public static putWorldsComplete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/worlds/{id}/complete',
            path: {
                'id': id,
            },
        });
    }
}
