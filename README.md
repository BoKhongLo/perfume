# PerfumeDK - Perfume Sales Website

PerfumeDK is an e-commerce platform specializing in selling premium perfumes. This project leverages a modern web stack to deliver a fast, scalable, and secure shopping experience. The application is built using the following technologies:

- **Next.js**: A React-based framework for server-side rendering and static site generation, ensuring high performance and SEO-friendly pages.
- **NestJS**: A robust Node.js framework for building efficient and scalable server-side applications with TypeScript.
- **FastAPI**: A high-performance Python framework for building APIs, responsible for handling file uploads and processing order, user, and product data.
- **MySQL**: A reliable relational database for storing and managing product, user, and order information.

## Note
1. BackEnd_URL:
   ```bash
   If you want public web in vps. U need change BackEnd_Url next-app\src\lib\Constants.ts
   ```

## Start Auto with docker

1. Start all services server using Docker Compose:

   ```bash
   $ docker-compose -f docker-compose.backend.yml -d
   ```

2. Start front-end

   ```bash
   $ cd next-app
   $ npm i
   $ npm run build
   $ npm run start
   ```
## Start manual
1. Change ENV:

   ```bash
   Change ./.env.docker to ./.env.manually in src/app.module.ts
   ```
2. Start nest-app

   ```bash
   $ cd nest-app
   $ npm i
   $ npm run build
   $ npm run start
   ```
3. Start fastapi

   ```bash
   $ cd python-module
   $ pip install --no-cache-dir -r requirements.txt   
   $ uvicorn main:app --host localhost --port 8000
   ```

4. Start next-app

   ```bash
   $ cd next-app
   $ npm i
   $ npm run build
   $ npm run start
   ```

The application will be available at the designated domain or localhost.

