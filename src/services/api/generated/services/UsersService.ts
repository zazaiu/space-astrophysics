/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Регистрация пользователя
     * @param requestBody
     * @returns any Пользователь создан
     * @throws ApiError
     */
    public static postUsersRegister(
        requestBody: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Аутентификация
     * @param requestBody
     * @returns any Успешный вход
     * @throws ApiError
     */
    public static postUsersLogin(
        requestBody: {
            username?: string;
            password?: string;
        },
    ): CancelablePromise<{
        token?: string;
        user?: User;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
