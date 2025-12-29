/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type User = {
    id?: number;
    username?: string;
    role?: User.role;
};
export namespace User {
    export enum role {
        GUEST = 'guest',
        ASTRONAUT = 'astronaut',
        MISSION_CONTROL = 'mission_control',
    }
}

