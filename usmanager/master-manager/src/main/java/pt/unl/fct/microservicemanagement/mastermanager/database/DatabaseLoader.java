/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package pt.unl.fct.microservicemanagement.mastermanager.database;

import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.apps.AppServiceRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.edge.EdgeHostEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.host.edge.EdgeHostRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.location.RegionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.location.RegionRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.fields.FieldEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.fields.FieldRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts.HostRuleConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts.HostRuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.rules.hosts.HostRuleRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.valuemodes.ValueModeEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.valuemodes.ValueModeRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.componenttypes.ComponentTypeEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.componenttypes.ComponentTypeRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.condition.ConditionRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.DecisionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.rulesystem.decision.DecisionRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.operators.OperatorEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.operators.OperatorRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.ServiceRepository;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.dependencies.ServiceDependency;
import pt.unl.fct.microservicemanagement.mastermanager.manager.services.dependencies.ServiceDependencyRepository;
import pt.unl.fct.microservicemanagement.mastermanager.users.UserEntity;
import pt.unl.fct.microservicemanagement.mastermanager.users.UsersRepository;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader {

  @Bean
  CommandLineRunner initDatabase(PasswordEncoder encoder, UsersRepository users, AppRepository apps,
                                 ServiceRepository services, AppServiceRepository appServices,
                                 ServiceDependencyRepository servicesDependencies, RegionRepository regions,
                                 EdgeHostRepository edgeHosts, ComponentTypeRepository componentTypes,
                                 OperatorRepository operators, DecisionRepository decisions, FieldRepository fields,
                                 ValueModeRepository valueModes, ConditionRepository conditions,
                                 HostRuleRepository hostRules) {
    return args -> {

      // users
      UserEntity sysAdmin = UserEntity.builder()
          .firstName("admin")
          .lastName("admin")
          .username("admin")
          .password(encoder.encode("admin"))
          .email("admin@admin.pt")
          .role(UserEntity.Role.ROLE_SYS_ADMIN)
          .build();
      users.save(sysAdmin);

      // services
      var frontend = ServiceEntity.builder()
          .serviceName("front-end")
          .dockerRepository("front-end")
          .defaultExternalPort("8079")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname}")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${front-endHost}")
          .serviceType("frontend")
          .expectedMemoryConsumption(209715200d)
          .build();
      frontend = services.save(frontend);
      var user = ServiceEntity.builder()
          .serviceName("user")
          .dockerRepository("user")
          .defaultExternalPort("8080")
          .defaultInternalPort("80")
          .defaultDb("user-db:27017")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${userDatabaseHost}")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${userHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(62914560d)
          .build();
      user = services.save(user);
      var userDb = ServiceEntity.builder()
          .serviceName("user-db")
          .dockerRepository("user-db")
          .defaultExternalPort("27017")
          .defaultInternalPort("27017")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${userDatabaseHost}")
          .serviceType("database")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(userDb);
      var catalogue = ServiceEntity.builder()
          .serviceName("catalogue")
          .dockerRepository("catalogue")
          .defaultExternalPort("8081")
          .defaultInternalPort("80")
          .defaultDb("catalogue-db:3306")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${catalogueDatabaseHost}")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${catalogueHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(62914560d)
          .build();
      services.save(catalogue);
      var catalogueDb = ServiceEntity.builder()
          .serviceName("catalogue-db")
          .dockerRepository("catalogue-db")
          .defaultExternalPort("3306")
          .defaultInternalPort("3306")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${catalogueDatabaseHost}")
          .serviceType("database")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(catalogueDb);
      var payment = ServiceEntity.builder()
          .serviceName("payment")
          .dockerRepository("payment")
          .defaultExternalPort("8082")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname}")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${paymentHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(62914560d)
          .build();
      services.save(payment);
      var carts = ServiceEntity.builder()
          .serviceName("carts")
          .dockerRepository("carts")
          .defaultExternalPort("8083")
          .defaultInternalPort("80")
          .defaultDb("carts-db:27017")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${cartsDatabaseHost}")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${cartsHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(carts);
      var cartsDb = ServiceEntity.builder()
          .serviceName("carts-db")
          .dockerRepository("carts-db")
          .defaultExternalPort("27016")
          .defaultInternalPort("27017")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${cartsDatabaseHost}")
          .serviceType("database")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(cartsDb);
      var orders = ServiceEntity.builder()
          .serviceName("orders")
          .dockerRepository("orders")
          .defaultExternalPort("8084")
          .defaultInternalPort("80")
          .defaultDb("orders-db:27017")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${ordersDatabaseHost}")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${ordersHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(orders);
      var ordersDb = ServiceEntity.builder()
          .serviceName("orders-db")
          //TODO wtf?
          .dockerRepository("mongo3")
          .defaultExternalPort("27015")
          .defaultInternalPort("27017")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${ordersDatabaseHost}")
          .serviceType("database")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(ordersDb);
      var shipping = ServiceEntity.builder()
          .serviceName("shipping")
          .dockerRepository("shipping")
          .defaultExternalPort("8085")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${rabbitmqHost}")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${shippingHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(shipping);
      var queueMaster = ServiceEntity.builder()
          .serviceName("queue-master")
          .dockerRepository("queue-master")
          .defaultExternalPort("8086")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${rabbitmqHost}")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${queue-masterHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(queueMaster);
      var rabbitmq = ServiceEntity.builder()
          .serviceName("rabbitmq")
          .dockerRepository("rabbitmq-glibc")
          .defaultExternalPort("5672")
          .defaultInternalPort("5672")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname}")
          .minReplicas(1)
          .maxReplicas(1)
          .outputLabel("${rabbitmqHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(rabbitmq);
      var eurekaServer = ServiceEntity.builder()
          .serviceName("eureka-server")
          .dockerRepository("registration-server")
          .defaultExternalPort("8761")
          .defaultInternalPort("8761")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${externalPort} ${internalPort} ${hostname} ${zone}")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${eurekaHost}")
          .serviceType("system")
          .expectedMemoryConsumption(262144000d)
          .build();
      services.save(eurekaServer);
      var loadBalancer = ServiceEntity.builder()
          .serviceName("load-balancer")
          .dockerRepository("nginx-load-balancer")
          .defaultExternalPort("1906")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${loadBalancerHost}")
          .serviceType("system")
          .expectedMemoryConsumption(10485760d)
          .build();
      services.save(loadBalancer);
      var dockerApiProxy = ServiceEntity.builder()
          .serviceName("docker-api-proxy")
          .dockerRepository("nginx-proxy")
          .defaultExternalPort("2375")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${dockerApiProxyHost}")
          .serviceType("system")
          .expectedMemoryConsumption(10485760d)
          .build();
      services.save(dockerApiProxy);
      var prometheus = ServiceEntity.builder()
          .serviceName("prometheus")
          .dockerRepository("prometheus")
          .defaultExternalPort("9090")
          .defaultInternalPort("9090")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${prometheusHost}")
          .serviceType("system")
          .expectedMemoryConsumption(52428800d)
          .build();
      services.save(prometheus);
      var requestLocationMonitor = ServiceEntity.builder()
          .serviceName("request-location-monitor")
          .dockerRepository("request-location-monitor")
          .defaultExternalPort("1919")
          .defaultInternalPort("1919")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${requestLocationMonitorHost}")
          .serviceType("system")
          .expectedMemoryConsumption(52428800d)
          .build();
      services.save(requestLocationMonitor);
      var masterManager = ServiceEntity.builder()
          .serviceName("master-manager")
          .dockerRepository("master-manager")
          // TODO
          .defaultExternalPort("1919")
          // TODO
          .defaultInternalPort("1919")
          .defaultDb("NOT_APPLICABLE")
          // TODO
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(1)
          .outputLabel("${masterManagerHost}")
          .serviceType("system")
          // TODO
          .expectedMemoryConsumption(0d)
          .build();
      services.save(masterManager);
      var localManager = ServiceEntity.builder()
          .serviceName("local-manager")
          .dockerRepository("local-manager")
          // TODO
          .defaultExternalPort("1919")
          // TODO
          .defaultInternalPort("1919")
          .defaultDb("NOT_APPLICABLE")
          // TODO
          .launchCommand("")
          // TODO
          .minReplicas(1)
          .maxReplicas(0)
          .outputLabel("${localManagerHost}")
          .serviceType("system")
          // TODO
          .expectedMemoryConsumption(0d)
          .build();
      services.save(localManager);
      var consulServer = ServiceEntity.builder()
          .serviceName("consul-server")
          .dockerRepository("docker-consul")
          // TODO
          .defaultExternalPort("8500+8600/udp")
          // TODO
          .defaultInternalPort("8500+8600/udp")
          .defaultDb("NOT_APPLICABLE")
          // TODO
          .launchCommand("agent -server -ui -node=server-1 -bootstrap-expect=1 -client=0.0.0.0")
          .minReplicas(1)
          .maxReplicas(3)
          .outputLabel("${consulServerHost}")
          .serviceType("system")
          // TODO
          .expectedMemoryConsumption(0d)
          .build();
      var consulAgent = ServiceEntity.builder()
          .serviceName("consul-client")
          .dockerRepository("docker-consul")
          // TODO
          .defaultExternalPort("8500+8600/udp")
          // TODO
          .defaultInternalPort("8500+8600/udp")
          .defaultDb("NOT_APPLICABLE")
          // TODO
          .launchCommand("")
          .minReplicas(1)
          .maxReplicas(1)
          .outputLabel("${consulClientHost}")
          .serviceType("system")
          // TODO
          .expectedMemoryConsumption(0d)
          .build();

      var sockShop = AppEntity.builder()
          .name("Sock Shop")
          .build();
      apps.save(sockShop);

      var sockShopFrontend = AppServiceEntity.builder()
          .app(sockShop)
          .service(frontend)
          .launchOrder(25)
          .build();
      appServices.save(sockShopFrontend);
      var sockShopUser = AppServiceEntity.builder()
          .app(sockShop)
          .service(user)
          .launchOrder(10)
          .build();
      appServices.save(sockShopUser);
      var sockShopUserDb = AppServiceEntity.builder()
          .app(sockShop)
          .service(userDb)
          .launchOrder(0)
          .build();
      appServices.save(sockShopUserDb);
      var sockShopCatalogue = AppServiceEntity.builder()
          .app(sockShop)
          .service(catalogue)
          .launchOrder(5)
          .build();
      appServices.save(sockShopCatalogue);
      var sockShopCatalogueDb = AppServiceEntity.builder()
          .app(sockShop)
          .service(catalogueDb)
          .launchOrder(0)
          .build();
      appServices.save(sockShopCatalogueDb);
      var sockShopPayment = AppServiceEntity.builder()
          .app(sockShop)
          .service(payment)
          .launchOrder(5)
          .build();
      appServices.save(sockShopPayment);
      var sockShopCarts = AppServiceEntity.builder()
          .app(sockShop)
          .service(carts)
          .launchOrder(10)
          .build();
      appServices.save(sockShopCarts);
      var sockShopCartsDb = AppServiceEntity.builder()
          .app(sockShop)
          .service(cartsDb)
          .launchOrder(0)
          .build();
      appServices.save(sockShopFrontend);
      var sockShopOrders = AppServiceEntity.builder()
          .app(sockShop)
          .service(orders)
          .launchOrder(20)
          .build();
      appServices.save(sockShopOrders);
      var sockShopOrdersDb = AppServiceEntity.builder()
          .app(sockShop)
          .service(ordersDb)
          .launchOrder(0)
          .build();
      appServices.save(sockShopCartsDb);
      var sockShopShipping = AppServiceEntity.builder()
          .app(sockShop)
          .service(shipping)
          .launchOrder(15)
          .build();
      appServices.save(sockShopShipping);
      var sockShopQueueMaster = AppServiceEntity.builder()
          .app(sockShop)
          .service(queueMaster)
          .launchOrder(15)
          .build();
      appServices.save(sockShopQueueMaster);
      var sockShopRabbitmq = AppServiceEntity.builder()
          .app(sockShop)
          .service(rabbitmq)
          .launchOrder(5)
          .build();
      appServices.save(sockShopRabbitmq);

      sockShop = sockShop.toBuilder().appServices(Set.of(
          sockShopFrontend,
          sockShopUser,
          sockShopUserDb,
          sockShopCatalogue,
          sockShopCatalogueDb,
          sockShopPayment,
          sockShopCarts,
          sockShopCartsDb,
          sockShopOrders,
          sockShopOrdersDb,
          sockShopShipping,
          sockShopQueueMaster,
          sockShopRabbitmq
      )).build();
      apps.save(sockShop);

      // service dependencies
      var frontendEurekaServerDependency = ServiceDependency.builder()
          .service(frontend)
          .dependency(eurekaServer)
          .build();
      servicesDependencies.save(frontendEurekaServerDependency);
      var frontendUserDependency = ServiceDependency.builder()
          .service(frontend)
          .dependency(user)
          .build();
      servicesDependencies.save(frontendUserDependency);
      var frontendCatalogueDependency = ServiceDependency.builder()
          .service(frontend)
          .dependency(catalogue)
          .build();
      servicesDependencies.save(frontendCatalogueDependency);
      var frontendPaymentDependency = ServiceDependency.builder()
          .service(frontend)
          .dependency(payment)
          .build();
      servicesDependencies.save(frontendPaymentDependency);
      var frontendCartsDependency = ServiceDependency.builder()
          .service(frontend)
          .dependency(carts)
          .build();
      servicesDependencies.save(frontendCartsDependency);
      var userEurekaServerDependency = ServiceDependency.builder()
          .service(user)
          .dependency(eurekaServer)
          .build();
      servicesDependencies.save(userEurekaServerDependency);
      var userUserDbDependency = ServiceDependency.builder()
          .service(user)
          .dependency(userDb)
          .build();
      servicesDependencies.save(userUserDbDependency);
      var catalogueEurekaServerDependency = ServiceDependency.builder()
          .service(catalogue)
          .dependency(eurekaServer)
          .build();
      servicesDependencies.save(catalogueEurekaServerDependency);
      var catalogueCatalogueDbDependency = ServiceDependency.builder()
          .service(catalogue)
          .dependency(catalogueDb)
          .build();
      servicesDependencies.save(catalogueCatalogueDbDependency);
      var paymentEurekaServerDependency = ServiceDependency.builder()
          .service(payment)
          .dependency(eurekaServer)
          .build();
      servicesDependencies.save(paymentEurekaServerDependency);
      var cartsEurekaServerDependency = ServiceDependency.builder()
          .service(carts)
          .dependency(eurekaServer)
          .build();
      servicesDependencies.save(cartsEurekaServerDependency);
      var cartsCartsDbDependency = ServiceDependency.builder()
          .service(carts)
          .dependency(cartsDb)
          .build();
      servicesDependencies.save(cartsCartsDbDependency);
      var ordersEurekaServerDependency = ServiceDependency.builder()
          .service(orders)
          .dependency(eurekaServer)
          .build();
      servicesDependencies.save(ordersEurekaServerDependency);
      var ordersPaymentDependency = ServiceDependency.builder()
          .service(orders)
          .dependency(payment)
          .build();
      servicesDependencies.save(ordersPaymentDependency);
      var ordersShippingDependency = ServiceDependency.builder()
          .service(orders)
          .dependency(shipping)
          .build();
      servicesDependencies.save(ordersShippingDependency);
      var ordersOrdersDbDependency = ServiceDependency.builder()
          .service(orders)
          .dependency(ordersDb)
          .build();
      servicesDependencies.save(ordersOrdersDbDependency);
      var shippingEurekaServerDependency = ServiceDependency.builder()
          .service(shipping)
          .dependency(eurekaServer)
          .build();
      servicesDependencies.save(shippingEurekaServerDependency);
      var shippingRabbitmqDependency = ServiceDependency.builder()
          .service(shipping)
          .dependency(rabbitmq)
          .build();
      servicesDependencies.save(shippingRabbitmqDependency);
      var queueMasterEurekaServerDependency = ServiceDependency.builder()
          .service(queueMaster)
          .dependency(eurekaServer)
          .build();
      servicesDependencies.save(queueMasterEurekaServerDependency);
      var queueMasterRabbitmqDependency = ServiceDependency.builder()
          .service(queueMaster)
          .dependency(rabbitmq)
          .build();
      servicesDependencies.save(queueMasterRabbitmqDependency);
      var rabbitmqEurekaServerDependency = ServiceDependency.builder()
          .service(rabbitmq)
          .dependency(eurekaServer)
          .build();
      servicesDependencies.save(rabbitmqEurekaServerDependency);

      // regions
      var usEast1 = RegionEntity.builder()
          .name("us-east-1")
          .description("US East (N. Virginia)")
          .active(true)
          .build();
      regions.save(usEast1);
      var euCentral1 = RegionEntity.builder()
          .name("eu-central-1")
          .description("EU (Frankfurt)")
          .active(true)
          .build();
      regions.save(euCentral1);
      var euWest2 = RegionEntity.builder()
          .name("eu-west-2")
          .description("EU (London)")
          .active(true)
          .build();
      regions.save(euWest2);

      // edge hosts
      var daniel127001 = EdgeHostEntity.builder()
          .hostname("127.0.0.1")
          .sshUsername("daniel")
          .sshPassword("enhj")
          .region("eu-central-1")
          .country("pt")
          .city("lisbon")
          .isLocal(true)
          .build();
      edgeHosts.save(daniel127001);
      var daniel192168176 = EdgeHostEntity.builder()
          .hostname("192.168.1.76")
          .sshUsername("daniel")
          .sshPassword("enhj")
          .region("eu-central-1")
          .country("pt")
          .city("lisbon")
          .isLocal(true)
          .build();
      edgeHosts.save(daniel192168176);
      var daniel192168168 = EdgeHostEntity.builder()
          .hostname("192.168.1.68")
          .sshUsername("daniel")
          .sshPassword("enhj")
          .region("eu-central-1")
          .country("pt")
          .city("lisbon")
          .isLocal(true)
          .build();
      edgeHosts.save(daniel192168168);
      var daniel192168172 = EdgeHostEntity.builder()
          .hostname("192.168.1.72")
          .sshUsername("daniel")
          .sshPassword("enhj")
          .region("eu-central-1")
          .country("pt")
          .city("lisbon")
          .isLocal(true)
          .build();
      edgeHosts.save(daniel192168172);
      var daniel1022245206 = EdgeHostEntity.builder()
          .hostname("10.22.245.206")
          .sshUsername("daniel")
          .sshPassword("enhj")
          .region("eu-central-1")
          .country("pt")
          .city("lisbon")
          .isLocal(true)
          .build();
      edgeHosts.save(daniel1022245206);

      // component types
      var container = ComponentTypeEntity.builder()
          .name("Service")
          .build();
      componentTypes.save(container);
      var host = ComponentTypeEntity.builder()
          .name("Host")
          .build();
      componentTypes.save(host);

      // operator
      var notEqualTo = OperatorEntity.builder()
          .name("NOT_EQUAL_TO")
          .symbol("!=")
          .build();
      operators.save(notEqualTo);
      var equalTo = OperatorEntity.builder()
          .name("EQUAL_TO")
          .symbol("==")
          .build();
      operators.save(equalTo);
      var greaterThan = OperatorEntity.builder()
          .name("GREATER_THAN")
          .symbol(">")
          .build();
      operators.save(greaterThan);
      var lessThan = OperatorEntity.builder()
          .name("LESS_THAN")
          .symbol("<")
          .build();
      operators.save(lessThan);
      var greaterThanOrEqualTo = OperatorEntity.builder()
          .name("GREATER_THAN_OR_EQUAL_TO")
          .symbol(">=")
          .build();
      operators.save(greaterThanOrEqualTo);
      var lessThanOrEqualTo = OperatorEntity.builder()
          .name("LESS_THAN_OR_EQUAL_TO")
          .symbol("<=")
          .build();
      operators.save(lessThanOrEqualTo);

      // decision
      var containerDecisionNone = DecisionEntity.builder()
          .componentType(container)
          .name("NONE")
          .build();
      decisions.save(containerDecisionNone);
      var containerDecisionReplicate = DecisionEntity.builder()
          .componentType(container)
          .name("REPLICATE")
          .build();
      decisions.save(containerDecisionReplicate);
      var containerDecisionMigrate = DecisionEntity.builder()
          .componentType(container)
          .name("MIGRATE")
          .build();
      decisions.save(containerDecisionMigrate);
      var containerDecisionStop = DecisionEntity.builder()
          .componentType(container)
          .name("STOP")
          .build();
      decisions.save(containerDecisionStop);
      var hostDecisionNone = DecisionEntity.builder()
          .componentType(host)
          .name("NONE")
          .build();
      decisions.save(hostDecisionNone);
      var hostDecisionStart = DecisionEntity.builder()
          .componentType(host)
          .name("START")
          .build();
      decisions.save(hostDecisionStart);
      var hostDecisionStop = DecisionEntity.builder()
          .componentType(host)
          .name("STOP")
          .build();
      decisions.save(hostDecisionStop);

      // fields

      // TODO is missing more fields...

      var cpu = FieldEntity.builder()
          .name("cpu")
          .build();
      fields.save(cpu);
      var ram = FieldEntity.builder()
          .name("ram")
          .build();
      fields.save(ram);
      var cpuPercentage = FieldEntity.builder()
          .name("cpu-%")
          .build();
      fields.save(cpuPercentage);
      var ramPercentage = FieldEntity.builder()
          .name("ram-%")
          .build();
      fields.save(ramPercentage);
      var rxBytes = FieldEntity.builder()
          .name("rx-bytes")
          .build();
      fields.save(rxBytes);
      var txBytes = FieldEntity.builder()
          .name("tx-bytes")
          .build();
      fields.save(txBytes);
      var rxBytesPerSec = FieldEntity.builder()
          .name("rx-bytes-per-sec")
          .build();
      fields.save(rxBytesPerSec);
      var txBytesPerSec = FieldEntity.builder()
          .name("tx-bytes-per-sec")
          .build();
      fields.save(txBytesPerSec);
      var latency = FieldEntity.builder()
          .name("latency")
          .build();
      fields.save(latency);
      var bandwidthPercentage = FieldEntity.builder()
          .name("bandwidth-%")
          .build();
      fields.save(bandwidthPercentage);

      // value modes
      var effectiveValue = ValueModeEntity.builder()
          .name("effective-val")
          .build();
      valueModes.save(effectiveValue);
      var averageValue = ValueModeEntity.builder()
          .name("avg-val")
          .build();
      valueModes.save(averageValue);
      var deviationPercentageOnAverageValue = ValueModeEntity.builder()
          .name("deviation-%-on-avg-val")
          .build();
      valueModes.save(deviationPercentageOnAverageValue);
      var deviationPercentageOnLastValue = ValueModeEntity.builder()
          .name("deviation-%-on-last-val")
          .build();
      valueModes.save(deviationPercentageOnLastValue);

      // conditions
      var cpuPercentageOver90 = ConditionEntity.builder()
          .name("cpuPercentageOver90")
          .valueMode(effectiveValue)
          .field(cpuPercentage)
          .operator(greaterThan)
          .value(90)
          .build();
      cpuPercentageOver90 = conditions.save(cpuPercentageOver90);
      var ramPercentageOver90 = ConditionEntity.builder()
          .name("ramPercentageOver90")
          .valueMode(effectiveValue)
          .field(ramPercentage)
          .operator(greaterThan)
          .value(90)
          .build();
      ramPercentageOver90 = conditions.save(ramPercentageOver90);

      // generic host rules
      var cpuAndRamOver90GenericHostRule = HostRuleEntity.builder()
          .name("CpuAndRamOver90")
          .priority(1)
          .decision(hostDecisionStart)
          .build();
      cpuAndRamOver90GenericHostRule = hostRules.save(cpuAndRamOver90GenericHostRule);
      var cpuOver90Condition = HostRuleConditionEntity.builder()
          .hostRule(cpuAndRamOver90GenericHostRule)
          .hostCondition(cpuPercentageOver90)
          .build();
      var ramOver90Condition = HostRuleConditionEntity.builder()
          .hostRule(cpuAndRamOver90GenericHostRule)
          .hostCondition(ramPercentageOver90)
          .build();
      cpuAndRamOver90GenericHostRule = cpuAndRamOver90GenericHostRule.toBuilder()
          .condition(cpuOver90Condition)
          .condition(ramOver90Condition)
          .build();
      hostRules.save(cpuAndRamOver90GenericHostRule);
    };
  }

}
