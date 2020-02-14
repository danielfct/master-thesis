# μsManager 

Manager on a Dynamic Microservice Management System

μsManager is a system to dynamically manage microservices, both at the cloud and the edge. Takes into account multiple metrics, such as device cpu and ram usage, user requests, microservice dependencies and location to decide where to place microservices.
This is a project developed in the context of several MIEI master thesis at [FCT-UNL](https://www.fct.unl.pt/).


### Organização do projeto

- docker-images
  - [docker-alpine](docker-images/docker-alpine)
  - [docker-consul](docker-images/docker-consul)
  - [docker-java](docker-images/docker-java)
  - [docker-mongo3](docker-images/docker-mongo3)

- [java-client-register-go](java-client-register-go)

- [launcher](launcher)

- [local-manager](local-manager)

- [master-manager](master-manager)

- microservices
  - sock-shop
    - [carts](microservices/sock-shop/carts)
    - [docker-rabbitmq](microservices/sock-shop/docker-rabbitmq)
    - [front-end](microservices/sock-shop/front-end)
    - [orders](microservices/sock-shop/orders)
    - [queue-master](microservices/sock-shop/queue-master)
    - [shipping](microservices/sock-shop/shipping)

- [nginx-basic-auth-proxy](nginx-basic-auth-proxy)

- [nginx-load-balancer](nginx-load-balancer)

- [prometheus](prometheus)

- [register-go-clients](register-go-clients)

- [registration-server](registration-server)

### Ferramentas usadas

[<img src="https://i.imgur.com/c6X4nsq.png" alt="" width="48" height="48"> IntelliJ IDEA](https://docs.npmjs.com/) - IntelliJ IDEA is an integrated development environment written in Java for developing computer software

As ferramentas especificas usadas em cada um dos módulos podem ser vistas nos respetivos ficheiros README.md:

> [Master manager](master-manager/README.md#ferramentas-usadas)  
> [Local manager](local-manager/README.md#ferramentas-usadas)  
> [Web manager](web-manager/README.md#ferramentas-usadas)  
> TODO adicionar os outros módulos

### Utilização

TODO  
Open the project in your IDE as a Maven project, build the root module and then run the Main class in [launcher](launcher).

### Licença

μsManager está licenciado com o [MIT license](https://github.com/usmanager/usmanager/LICENSE). Ver a licença no cabeçalho do respetivo ficheiro para confirmar.

