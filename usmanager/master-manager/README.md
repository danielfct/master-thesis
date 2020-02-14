# Master manager   

[![js-standard-style](https://img.shields.io/badge/code%20style-checkstyle-brightgreen.svg)](https://checkstyle.org/)

Master manager é o módulo principal do sistema de gestão de micro-serviços.
Faz uso de conhecimento prévio (serviços e sua dependencias, regras, tipo de decisões, etc) e de conhecimento que adquire ao longo da sua execução (métricas obtidas dos containers e hosts, migração/replicação de serviços, etc).  
Usa o sistema de gestão de regras de negócios Drools para gerir as regras aplicadas. 
É também um projeto Spring Boot, gerido com maven, que disponibiliza um servidor restful.

### Requisitos

- #####Maven com java 11  
>`sudo apt install maven`  
>`maven --version` verificar que está associado ao java 11 ([solução](https://stackoverflow.com/a/49988988))
 
- #####SSH
>`sudo apt-get install ssh`

- #####Docker
>`sh src/main/resources/scripts/docker-install.sh`

- #####Node Exporter
>`sh src/main/resources/scripts/node-exporter-install.sh` 

### Ambiente

>`Ubuntu 18.04.4 LTS`

>`Apache Maven 3.6.0`  
 `Maven home: /usr/share/maven`  
 `Java version: 11.0.6, vendor: Ubuntu, runtime: /usr/lib/jvm/java-11-openjdk-amd64`  
 `Default locale: pt_PT, platform encoding: UTF-8`  
 `OS name: "linux", version: "5.3.0-28-generic", arch: "amd64", family: "unix"`

>`Docker version 19.03.5, build 633a0ea838`

### Ferramentas usadas

[<img src="https://i.imgur.com/71OViyN.png" alt="" width="48" height="62"> Drools](https://www.drools.org/) - Drools is a Business Rules Management System (BRMS) solution

[<img src="https://i.imgur.com/DBrGTaL.png" alt="" width="48" height="48"> Postman](https://www.postman.com/) - The Collaboration Platform for API Development

[<img src="https://i.imgur.com/M7dKRag.png" alt="" width="48" height="48"> Json Formatter](https://github.com/callumlocke/json-formatter) - Chrome extension for printing JSON and JSONP nicely when you visit it 'directly' in a browser tab

[<img src="https://i.imgur.com/JCWN9oL.png" alt="" width="48" height="48"> Project Lombok](https://projectlombok.org/) - Project Lombok is a java library that automatically plugs into your editor and build tools, spicing up your java

[<img src="https://i.imgur.com/6f2iyaR.png" alt="" width="48" height="24"> Checkstyle](https://checkstyle.org/) - Checkstyle is a development tool to help programmers write Java code that adheres to a coding standard

### Guias úteis
[<img src="https://i.imgur.com/WDbhA08.png" alt="" width="48" height="42"> Spring Boot](https://spring.io/projects/spring-boot) - Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run" 

<!--[<img src="https://i.imgur.com/ei7nKF5.png" alt="" width="48" height="42"> Spring HATEOAS](https://spring.io/projects/spring-hateoas) - Spring HATEOAS provides some APIs to ease creating REST representations that follow the HATEOAS principle when working with Spring and especially Spring MVC-->

[<img src="https://i.imgur.com/qFZtEoa.png" alt="" width="48" height="24"> Maven](http://maven.apache.org/guides/getting-started/) - Maven is essentially a project management and comprehension tool and as such provides a way to help with managing: Builds, Documentation, Reporting, Dependencies, SCMs, Release, Distribution and Documentation

### Executar

Com o maven instalado:

> `mvn spring-boot:run`

Sem o maven instalado:

> `./mvnw package`

### Troubleshooting

>Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock

`sudo setfacl --modify user:<user name or ID>:rw /var/run/docker.sock` ([solução](https://stackoverflow.com/a/54504083))

### Licença

Master manager está licenciado com o [MIT license](https://github.com/usmanager/usmanager/LICENSE). Ver a licença no cabeçalho do respetivo ficheiro para confirmar.