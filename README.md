SecureVault API
===============

API para la notificación y gestión segura de credenciales a través de cofres virtuales cifrados.
Desarrollado con NestJS, PostgreSQL y Prisma ORM. Implementa las mejores prácticas de seguridad modernas (OAuth2, JWT, MFA, Zero-Knowledge, TLS, DKIM).

---

🚀 Funcionalidad
----------------

- Cofres cifrados con AES-256 + KEK (AWS KMS o HashiCorp Vault)
- Generación de enlaces de acceso sin exponer la clave
- MFA (Google Authenticator compatible)
- Envío de notificaciones seguras por correo (DKIM, SPF, DMARC)
- Auditar cada acceso con IP, navegador y hora
- Cierre anticipado del cofre y tokens temporales
- Arquitectura modular, escalable y documentada en Swagger

---

🧱 Tech Stack
-------------

- NestJS
- PostgreSQL
- Prisma ORM
- Nodemailer
- JWT / OAuth 2.0
- TOTP (MFA)
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Swagger (OpenAPI)

---

📦 Instalación
--------------

1. Clona el proyecto:

   git clone https://github.com/tu-usuario/securevault-api.git
   cd securevault-api

2. Crea un archivo `.env` basado en `.env.example`.

3. Instala dependencias:

   npm install

4. Ejecuta las migraciones de Prisma:

   npx prisma migrate dev --name init

5. Corre la aplicación:

   npm run start:dev

6. Accede a la documentación Swagger:

   http://localhost:3000/api/docs

---

🔐 Variables de entorno (resumen)
---------------------------------

- `DATABASE_URL`: cadena de conexión PostgreSQL
- `JWT_SECRET`: clave privada para firmar tokens JWT
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`: datos para envío de correos
- `DKIM_KEY`: clave privada para firma DKIM (escapada)
- `FRONTEND_URL`: dominio donde vive el frontend de cofres
- `AWS_REGION`, `KMS_KEY_ID`: datos de AWS para cifrado con KMS

Consulta `.env.example` para más detalles.

---

🐳 Docker (opcional)
--------------------

1. Construye e inicia los servicios:

   docker-compose up --build

2. Prisma se conectará a `db:5432` por defecto.

---

🔒 Seguridad implementada
-------------------------

- HTTPS obligatorio (TLS 1.2+)
- Cifrado AES-256-GCM
- Claves nunca almacenadas (Zero Knowledge)
- MFA obligatorio para accesos críticos
- Tokens temporales (One-Time Token)
- Auditoría de accesos: IP, User-Agent, resultado
- Protección CSRF, Rate Limiting, XSS headers
- SPF, DKIM, DMARC configurables en DNS
- Validación robusta con Zod / class-validator
- Cumplimiento de GDPR (revocación, expiración, logs controlados)

---

🧪 Pruebas
----------

- Unit tests: `npm run test`
- E2E tests (opcional): `npm run test:e2e`
- Linter: `npm run lint`

---

📁 Estructura principal
-----------------------

- `auth/` → autenticación, MFA, roles, JWT
- `vault/` → lógica de cofres, cifrado, acceso
- `notification/` → envío de correos seguros
- `audit/` → logs de auditoría
- `common/` → filtros, pipes, decoradores
- `main.ts` → bootstrap y configuración global
- `prisma/` → esquema y migraciones

---

🔄 CI/CD
--------

El proyecto incluye un workflow de GitHub Actions que:

- Instala dependencias
- Ejecuta pruebas
- Realiza build de producción

Archivo: `.github/workflows/deploy.yml`

---

📚 Créditos
-----------

Desarrollado por Hernán Pereira  
Licencia: MIT  
Contribuciones y mejoras son bienvenidas.

---

