# CRM de Clientes

Este es un sistema CRM (Customer Relationship Management) desarrollado como proyecto fullstack. Permite gestionar clientes, productos, pedidos y usuarios, con autenticación y control de acceso.

## 🛠 Tecnologías utilizadas

-   **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Apollo Client](https://www.apollographql.com/docs/react/)
-   **Backend**: [Apollo Server](https://www.apollographql.com/docs/apollo-server/), [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/), GraphQL
-   **Autenticación**: JSON Web Tokens (JWT)

## 🚀 Funcionalidades

-   Registro e inicio de sesión de usuarios
-   Autenticación con JWT
-   CRUD de clientes, productos y pedidos
-   Gráficas con Recharts
-   Modificación de clientes, pedidos y productos
-   Gestión de stock y ventas
-   Panel de administración con las mejores ventas

## 📦 Instalación

-Clona ambos repositorios (backend y frontend):

```bash
git clone https://github.com/sergilh/CRM-GraphQL.git
git clone https://github.com/sergilh/CRMClientes.git
```

-Instala las dependencias:

npm install

-Crea un archivo .env en la raíz del proyecto con las siguientes variables:

MONGO_DB=
SECRET=
PORT=4000

-Inicia el servidor de desarrollo

npm run dev

## Deploy del Frontend en Producción

https://crm-clientes-omega.vercel.app/login
