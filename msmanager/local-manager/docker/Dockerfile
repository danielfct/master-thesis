FROM openjdk:11-jdk-alpine

WORKDIR /usr/src/app
COPY ./target/*.jar ./managerMaster.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/urandom","-jar","./managerLocal.jar"]