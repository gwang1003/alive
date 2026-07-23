# === 빌드 스테이지 ===
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -q -B clean package -DskipTests

# === 실행 스테이지 ===
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# 플랫폼(Railway 등)이 주입하는 $PORT 로 리슨한다 (application.yml: server.port=${PORT:8282})
ENTRYPOINT ["java", "-jar", "app.jar"]
