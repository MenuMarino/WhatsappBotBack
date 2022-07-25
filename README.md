# Dashboard (backend)

- Lo primero es correr `npm install`, para instalar las dependencias del proyecto.
- Después se ejecuta `npm run seed`, este guarda en la base de datos el usuario con rol de administrador.
- Para correr el backend se utiliza `npm run local`

## Dependencias

- Node.js v16.15.0
- MongoDB

## Env

- PORT: Puerto en el cual correra el webhook
- URI: URI para conectar con la base de datos de Mongo
- JWTSECRET: Esto se usa para generar los jwt para el frontend.
- WHATSAPP_TOKEN: Token para conectar con el app de whatsapp.
- URL: Url que reenvia el bot.
