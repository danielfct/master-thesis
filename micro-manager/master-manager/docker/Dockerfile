FROM openjdk:11.0.5-jdk-stretch

WORKDIR /usr/src/app
COPY ./src/main/resources/aws/ec2.pem ./ec2.pem
COPY ./target/*.jar ./managerMaster.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/urandom","-jar","./managerMaster.jar"]
CMD ["--awskey=./ec2.pem", "--dockermaster=127.0.0.1"]