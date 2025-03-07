# Stage 1: Build frontend using pnpm
FROM node:18-alpine AS frontend-build

WORKDIR /memopad

# Make sure backend/src/main/resources/static/ exists
RUN mkdir -p backend/src/main/resources/static

WORKDIR /memopad/frontend

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install

# Copy source code
COPY frontend/ ./

# Build the frontend
RUN pnpm build

# Stage 2: Build backend using gradle
FROM gradle:8.1.1-jdk21 AS backend-build

WORKDIR /memopad/backend

# Make sure backend/src/main/resources/static/ exists
RUN mkdir -p src/main/resources/static

# Copy static directory from frontend stage
COPY --from=frontend-build /memopad/backend/src/main/resources/static backend/src/main/resources/static

# Copy source code
COPY backend/ ./

# Build the backend
RUN gradle build bootJar

# Stage 3: Run the backend
FROM openjdk:21-jdk-alpine

WORKDIR /memopad

# Copy built jar file from backend stage
COPY --from=backend-build /memopad/backend/build/libs/memopad-*-SNAPSHOT.jar memopad.jar

# Expose port 8080
EXPOSE 8080

# Run the backend
ENTRYPOINT ["java", "-jar", "memopad.jar"]
