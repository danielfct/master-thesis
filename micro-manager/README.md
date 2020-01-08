# Manager on a Dynamic Microservice Management System #

dmanager is a system to dynamically manage microservices, both at the cloud and the edge. Takes into account multiple metrics, such as device cpu and ram usage, user requests, microservice dependencies and location to decide where to place microservices.
This is a project developed in the context of MIEI master thesis at [FCT-UNL](https://www.fct.unl.pt/).

# Project Layout #

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

# Usage

Open the project in your IDE as a Maven project, build the root module and then run the Main class in [launcher](launcher).

# License

micro-manager is licensed under the MIT license. See the license header in the respective file to be sure.
