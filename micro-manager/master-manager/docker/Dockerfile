FROM openjdk:11.0.5-jdk-stretch

WORKDIR /usr/src/app
COPY ./src/main/resources/aws/ec2.pem ./ec2.pem
COPY ./target/*.jar ./master-manager.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/urandom","-jar","./master-manager.jar"]
CMD ["--awsAccessKeyFilePath=./ec2.pem", "--dockerManager=127.0.0.1"]