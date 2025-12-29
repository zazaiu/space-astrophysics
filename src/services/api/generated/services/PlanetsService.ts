/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Planet } from '../models/Planet';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export type { Planet } from '../models/Planet'; 
export class PlanetsService {
    /**
     * Список планет (guest, astronaut, mission_control)
     * @returns Planet Список планет
     * @throws ApiError
     */
    public static getPlanets(): CancelablePromise<Array<Planet>> {
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
    public static postPlanets(): CancelablePromise<any> {
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
    public static getPlanets1(
        id: number,
    ): CancelablePromise<Planet> {
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
    public static putPlanets(
        id: number,
    ): CancelablePromise<any> {
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
    public static deletePlanets(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/planets/{id}',
            path: {
                'id': id,
            },
        });
    }
}
