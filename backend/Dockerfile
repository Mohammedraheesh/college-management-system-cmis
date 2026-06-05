# ====================================================
# STAGE 1: Build Java Jar
# ====================================================
FROM maven:3.8.5-openjdk-17 AS builder
WORKDIR /app
COPY pom.xml .
# Pre-cache Maven dependencies
RUN mvn dependency:go-offline -B

COPY src ./src
# Build package skipping tests (tests run in CI/CD)
RUN mvn package -DskipTests

# ====================================================
# STAGE 2: Expose and Run Runtime Container
# ====================================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/cmis-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
