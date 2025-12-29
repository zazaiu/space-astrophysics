import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Регистрация пользователя
     * @param requestBody
     * @returns any Пользователь создан
     * @throws ApiError
     */
    static postUsersRegister(requestBody) {
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
    static postUsersLogin(requestBody) {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
