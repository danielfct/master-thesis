FROM openjdk:8-jdk-alpine

WORKDIR /usr/src/app
COPY ./src/main/resources/aws/ec2.pem ./ec2.pem
COPY ./target/*.jar ./app.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/urandom","-jar","./app.jar"]
CMD ["--awskey=./ec2.pem", "--dockermaster=127.0.0.1"]