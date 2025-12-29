import { defineConfig } from 'openapi-typescript-codegen';

export default defineConfig({
  input: '../swagger.yml',                // путь к swagger-файлу
  output: './src/services/api/generated', // куда класть код
  clientName: 'Api',                      // имя основного клиента
  useOptions: true,                       // параметры запроса через объект
  useUnionTypes: true,                    // TS union types вместо enum classes
});
