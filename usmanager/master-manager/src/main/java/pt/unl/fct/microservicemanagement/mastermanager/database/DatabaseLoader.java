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

import pt.unl.fct.microservicemanagement.mastermanager.apps.AppPackage;
import pt.unl.fct.microservicemanagement.mastermanager.apps.AppPackageRepository;
import pt.unl.fct.microservicemanagement.mastermanager.apps.AppService;
import pt.unl.fct.microservicemanagement.mastermanager.apps.AppServiceRepository;
import pt.unl.fct.microservicemanagement.mastermanager.host.edge.EdgeHost;
import pt.unl.fct.microservicemanagement.mastermanager.host.edge.EdgeHostRepository;
import pt.unl.fct.microservicemanagement.mastermanager.location.Region;
import pt.unl.fct.microservicemanagement.mastermanager.location.RegionRepository;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.FieldEntity;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.FieldRepository;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.ValueModeEntity;
import pt.unl.fct.microservicemanagement.mastermanager.monitoring.metric.ValueModeRepository;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.ComponentTypeEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.ComponentTypeRepository;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.condition.ConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.condition.ConditionRepository;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision.DecisionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.decision.DecisionRepository;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.GenericHostRuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.GenericHostRuleRepository;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.OperatorEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.OperatorRepository;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RuleConditionEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RuleConditionRepository;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RuleEntity;
import pt.unl.fct.microservicemanagement.mastermanager.rulesystem.rule.RuleRepository;
import pt.unl.fct.microservicemanagement.mastermanager.services.ServiceEntity;
import pt.unl.fct.microservicemanagement.mastermanager.services.ServiceRepository;
import pt.unl.fct.microservicemanagement.mastermanager.services.dependency.ServiceDependency;
import pt.unl.fct.microservicemanagement.mastermanager.services.dependency.ServiceDependencyRepository;
import pt.unl.fct.microservicemanagement.mastermanager.users.User;
import pt.unl.fct.microservicemanagement.mastermanager.users.UsersRepository;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader {

  @Bean
  CommandLineRunner initDatabase(PasswordEncoder encoder, UsersRepository users, AppPackageRepository appPackages,
                                 ServiceRepository services, AppServiceRepository appServices,
                                 ServiceDependencyRepository servicesDependencies, RegionRepository regions,
                                 EdgeHostRepository edgeHosts, ComponentTypeRepository componentTypes,
                                 OperatorRepository operators, DecisionRepository decisions, FieldRepository fields,
                                 ValueModeRepository valueModes, RuleRepository rules, ConditionRepository conditions,
                                 RuleConditionRepository ruleConditions, GenericHostRuleRepository genericHostRules) {
    return args -> {

      System.out.println("running db population");

      // sytem users
      User sysAdmin = User.builder()
          .firstName("admin")
          .lastName("admin")
          .username("admin")
          .password(encoder.encode("password"))
          .email("admin@admin.pt")
          .role(User.Role.ROLE_SYS_ADMIN)
          .build();
      sysAdmin = users.save(sysAdmin);
      System.out.println(sysAdmin);

      // services
      var frontend = ServiceEntity.builder()
          .serviceName("front-end")
          .dockerRepository("front-end")
          .defaultExternalPort("8079")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname}")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${front-endHost}")
          .serviceType("frontend")
          .expectedMemoryConsumption(209715200)
          .build();
      frontend = services.save(frontend);
      System.out.println(frontend);
      var user = ServiceEntity.builder()
          .serviceName("user")
          .dockerRepository("user")
          .defaultExternalPort("8080")
          .defaultInternalPort("80")
          .defaultDb("user-db:27017")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${userDatabaseHost}")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${userHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(62914560)
          .build();
      user = services.save(user);
      System.out.println(user);
      var userDb = ServiceEntity.builder()
          .serviceName("user-db")
          .dockerRepository("user-db")
          .defaultExternalPort("27017")
          .defaultInternalPort("27017")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${userDatabaseHost}")
          .serviceType("database")
          .expectedMemoryConsumption(262144000)
          .build();
      services.save(userDb);
      var catalogue = ServiceEntity.builder()
          .serviceName("catalogue")
          .dockerRepository("catalogue")
          .defaultExternalPort("8081")
          .defaultInternalPort("80")
          .defaultDb("catalogue-db:3306")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${catalogueDatabaseHost}")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${catalogueHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(62914560)
          .build();
      services.save(catalogue);
      var catalogueDb = ServiceEntity.builder()
          .serviceName("catalogue-db")
          .dockerRepository("catalogue-db")
          .defaultExternalPort("3306")
          .defaultInternalPort("3306")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${catalogueDatabaseHost}")
          .serviceType("database")
          .expectedMemoryConsumption(262144000)
          .build();
      services.save(catalogueDb);
      var payment = ServiceEntity.builder()
          .serviceName("payment")
          .dockerRepository("payment")
          .defaultExternalPort("8082")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname}")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${paymentHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(62914560)
          .build();
      services.save(payment);
      var carts = ServiceEntity.builder()
          .serviceName("carts")
          .dockerRepository("carts")
          .defaultExternalPort("8083")
          .defaultInternalPort("80")
          .defaultDb("carts-db:27017")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${cartsDatabaseHost}")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${cartsHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000)
          .build();
      services.save(carts);
      var cartsDb = ServiceEntity.builder()
          .serviceName("carts-db")
          .dockerRepository("carts-db")
          .defaultExternalPort("27016")
          .defaultInternalPort("27017")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${cartsDatabaseHost}")
          .serviceType("database")
          .expectedMemoryConsumption(262144000)
          .build();
      services.save(cartsDb);
      var orders = ServiceEntity.builder()
          .serviceName("orders")
          .dockerRepository("orders")
          .defaultExternalPort("8084")
          .defaultInternalPort("80")
          .defaultDb("orders-db:27017")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${ordersDatabaseHost}")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${ordersHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000)
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
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${ordersDatabaseHost}")
          .serviceType("database")
          .expectedMemoryConsumption(262144000)
          .build();
      services.save(ordersDb);
      var shipping = ServiceEntity.builder()
          .serviceName("shipping")
          .dockerRepository("shipping")
          .defaultExternalPort("8085")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${rabbitmqHost}")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${shippingHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000)
          .build();
      services.save(shipping);
      var queueMaster = ServiceEntity.builder()
          .serviceName("queue-master")
          .dockerRepository("queue-master")
          .defaultExternalPort("8086")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${rabbitmqHost}")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${queue-masterHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000)
          .build();
      services.save(queueMaster);
      var rabbitmq = ServiceEntity.builder()
          .serviceName("rabbitmq")
          .dockerRepository("rabbitmq-glibc")
          .defaultExternalPort("5672")
          .defaultInternalPort("5672")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${eurekaHost} ${externalPort} ${internalPort} ${hostname}")
          .minReplics(1)
          .maxReplics(1)
          .outputLabel("${rabbitmqHost}")
          .serviceType("backend")
          .expectedMemoryConsumption(262144000)
          .build();
      services.save(rabbitmq);
      var eurekaServer = ServiceEntity.builder()
          .serviceName("eureka-server")
          .dockerRepository("registration-server")
          .defaultExternalPort("8761")
          .defaultInternalPort("8761")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("${externalPort} ${internalPort} ${hostname} ${zone}")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${eurekaHost}")
          .serviceType("system")
          .expectedMemoryConsumption(262144000)
          .build();
      services.save(eurekaServer);
      var loadBalancer = ServiceEntity.builder()
          .serviceName("load-balancer")
          .dockerRepository("nginx-load-balancer")
          .defaultExternalPort("1906")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${loadBalancerHost}")
          .serviceType("system")
          .expectedMemoryConsumption(10485760)
          .build();
      services.save(loadBalancer);
      var dockerApiProxy = ServiceEntity.builder()
          .serviceName("docker-api-proxy")
          .dockerRepository("nginx-proxy")
          .defaultExternalPort("2375")
          .defaultInternalPort("80")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${dockerApiProxyHost}")
          .serviceType("system")
          .expectedMemoryConsumption(10485760)
          .build();
      services.save(dockerApiProxy);
      var prometheus = ServiceEntity.builder()
          .serviceName("prometheus")
          .dockerRepository("prometheus")
          .defaultExternalPort("9090")
          .defaultInternalPort("9090")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${prometheusHost}")
          .serviceType("system")
          .expectedMemoryConsumption(52428800)
          .build();
      services.save(prometheus);
      var requestLocationMonitor = ServiceEntity.builder()
          .serviceName("request-location-monitor")
          .dockerRepository("request-location-monitor")
          .defaultExternalPort("1919")
          .defaultInternalPort("1919")
          .defaultDb("NOT_APPLICABLE")
          .launchCommand("")
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${requestLocationMonitorHost}")
          .serviceType("system")
          .expectedMemoryConsumption(52428800)
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
          .minReplics(1)
          .maxReplics(1)
          .outputLabel("${masterManagerHost}")
          .serviceType("system")
          // TODO
          .expectedMemoryConsumption(0)
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
          .minReplics(1)
          .maxReplics(0)
          .outputLabel("${localManagerHost}")
          .serviceType("system")
          // TODO
          .expectedMemoryConsumption(0)
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
          .minReplics(1)
          .maxReplics(3)
          .outputLabel("${consulServerHost}")
          .serviceType("system")
          // TODO
          .expectedMemoryConsumption(0)
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
          .minReplics(1)
          .maxReplics(1)
          .outputLabel("${consulClientHost}")
          .serviceType("system")
          // TODO
          .expectedMemoryConsumption(0)
          .build();

      var sockShop = AppPackage.builder()
          .appName("Sock Shop")
          .build();
      appPackages.save(sockShop);

      var sockShopFrontend = AppService.builder()
          .appPackage(sockShop)
          .service(frontend)
          .launchOrder(25)
          .build();
      appServices.save(sockShopFrontend);
      var sockShopUser = AppService.builder()
          .appPackage(sockShop)
          .service(user)
          .launchOrder(10)
          .build();
      appServices.save(sockShopUser);
      var sockShopUserDb = AppService.builder()
          .appPackage(sockShop)
          .service(userDb)
          .launchOrder(0)
          .build();
      appServices.save(sockShopUserDb);
      var sockShopCatalogue = AppService.builder()
          .appPackage(sockShop)
          .service(catalogue)
          .launchOrder(5)
          .build();
      appServices.save(sockShopCatalogue);
      var sockShopCatalogueDb = AppService.builder()
          .appPackage(sockShop)
          .service(catalogueDb)
          .launchOrder(0)
          .build();
      appServices.save(sockShopCatalogueDb);
      var sockShopPayment = AppService.builder()
          .appPackage(sockShop)
          .service(payment)
          .launchOrder(5)
          .build();
      appServices.save(sockShopPayment);
      var sockShopCarts = AppService.builder()
          .appPackage(sockShop)
          .service(carts)
          .launchOrder(10)
          .build();
      appServices.save(sockShopCarts);
      var sockShopCartsDb = AppService.builder()
          .appPackage(sockShop)
          .service(cartsDb)
          .launchOrder(0)
          .build();
      appServices.save(sockShopFrontend);
      var sockShopOrders = AppService.builder()
          .appPackage(sockShop)
          .service(orders)
          .launchOrder(20)
          .build();
      appServices.save(sockShopOrders);
      var sockShopOrdersDb = AppService.builder()
          .appPackage(sockShop)
          .service(ordersDb)
          .launchOrder(0)
          .build();
      appServices.save(sockShopCartsDb);
      var sockShopShipping = AppService.builder()
          .appPackage(sockShop)
          .service(shipping)
          .launchOrder(15)
          .build();
      appServices.save(sockShopShipping);
      var sockShopQueueMaster = AppService.builder()
          .appPackage(sockShop)
          .service(queueMaster)
          .launchOrder(15)
          .build();
      appServices.save(sockShopQueueMaster);
      var sockShopRabbitmq = AppService.builder()
          .appPackage(sockShop)
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
      appPackages.save(sockShop);

      // service dependencies
      var frontendEurekaServerDependency = ServiceDependency.builder()
          .service(frontend)
          .serviceDependency(eurekaServer)
          .build();
      servicesDependencies.save(frontendEurekaServerDependency);
      var frontendUserDependency = ServiceDependency.builder()
          .service(frontend)
          .serviceDependency(user)
          .build();
      servicesDependencies.save(frontendUserDependency);
      var frontendCatalogueDependency = ServiceDependency.builder()
          .service(frontend)
          .serviceDependency(catalogue)
          .build();
      servicesDependencies.save(frontendCatalogueDependency);
      var frontendPaymentDependency = ServiceDependency.builder()
          .service(frontend)
          .serviceDependency(payment)
          .build();
      servicesDependencies.save(frontendPaymentDependency);
      var frontendCartsDependency = ServiceDependency.builder()
          .service(frontend)
          .serviceDependency(carts)
          .build();
      servicesDependencies.save(frontendCartsDependency);
      var userEurekaServerDependency = ServiceDependency.builder()
          .service(user)
          .serviceDependency(eurekaServer)
          .build();
      servicesDependencies.save(userEurekaServerDependency);
      var userUserDbDependency = ServiceDependency.builder()
          .service(user)
          .serviceDependency(userDb)
          .build();
      servicesDependencies.save(userUserDbDependency);
      var catalogueEurekaServerDependency = ServiceDependency.builder()
          .service(catalogue)
          .serviceDependency(eurekaServer)
          .build();
      servicesDependencies.save(catalogueEurekaServerDependency);
      var catalogueCatalogueDbDependency = ServiceDependency.builder()
          .service(catalogue)
          .serviceDependency(catalogueDb)
          .build();
      servicesDependencies.save(catalogueCatalogueDbDependency);
      var paymentEurekaServerDependency = ServiceDependency.builder()
          .service(payment)
          .serviceDependency(eurekaServer)
          .build();
      servicesDependencies.save(paymentEurekaServerDependency);
      var cartsEurekaServerDependency = ServiceDependency.builder()
          .service(carts)
          .serviceDependency(eurekaServer)
          .build();
      servicesDependencies.save(cartsEurekaServerDependency);
      var cartsCartsDbDependency = ServiceDependency.builder()
          .service(carts)
          .serviceDependency(cartsDb)
          .build();
      servicesDependencies.save(cartsCartsDbDependency);
      var ordersEurekaServerDependency = ServiceDependency.builder()
          .service(orders)
          .serviceDependency(eurekaServer)
          .build();
      servicesDependencies.save(ordersEurekaServerDependency);
      var ordersPaymentDependency = ServiceDependency.builder()
          .service(orders)
          .serviceDependency(payment)
          .build();
      servicesDependencies.save(ordersPaymentDependency);
      var ordersShippingDependency = ServiceDependency.builder()
          .service(orders)
          .serviceDependency(shipping)
          .build();
      servicesDependencies.save(ordersShippingDependency);
      var ordersOrdersDbDependency = ServiceDependency.builder()
          .service(orders)
          .serviceDependency(ordersDb)
          .build();
      servicesDependencies.save(ordersOrdersDbDependency);
      var shippingEurekaServerDependency = ServiceDependency.builder()
          .service(shipping)
          .serviceDependency(eurekaServer)
          .build();
      servicesDependencies.save(shippingEurekaServerDependency);
      var shippingRabbitmqDependency = ServiceDependency.builder()
          .service(shipping)
          .serviceDependency(rabbitmq)
          .build();
      servicesDependencies.save(shippingRabbitmqDependency);
      var queueMasterEurekaServerDependency = ServiceDependency.builder()
          .service(queueMaster)
          .serviceDependency(eurekaServer)
          .build();
      servicesDependencies.save(queueMasterEurekaServerDependency);
      var queueMasterRabbitmqDependency = ServiceDependency.builder()
          .service(queueMaster)
          .serviceDependency(rabbitmq)
          .build();
      servicesDependencies.save(queueMasterRabbitmqDependency);
      var rabbitmqEurekaServerDependency = ServiceDependency.builder()
          .service(rabbitmq)
          .serviceDependency(eurekaServer)
          .build();
      servicesDependencies.save(rabbitmqEurekaServerDependency);

      // regions
      var usEast1 = Region.builder()
          .regionName("us-east-1")
          .regionDescription("US East (N. Virginia)")
          .active(true)
          .build();
      regions.save(usEast1);
      var euCentral1 = Region.builder()
          .regionName("eu-central-1")
          .regionDescription("EU (Frankfurt)")
          .active(true)
          .build();
      regions.save(euCentral1);
      var euWest2 = Region.builder()
          .regionName("eu-west-2")
          .regionDescription("EU (London)")
          .active(true)
          .build();
      regions.save(euWest2);

      // edge hosts
      var daniel127001 = EdgeHost.builder()
          .hostname("127.0.0.1")
          .sshUsername("daniel")
          .sshPassword("enhj")
          .region("eu-central-1")
          .country("pt")
          .city("lisbon")
          .isLocal(true)
          .build();
      edgeHosts.save(daniel127001);
      var daniel192168176 = EdgeHost.builder()
          .hostname("192.168.1.76")
          .sshUsername("daniel")
          .sshPassword("enhj")
          .region("eu-central-1")
          .country("pt")
          .city("lisbon")
          .isLocal(true)
          .build();
      edgeHosts.save(daniel192168176);
      var daniel192168168 = EdgeHost.builder()
          .hostname("192.168.1.68")
          .sshUsername("daniel")
          .sshPassword("enhj")
          .region("eu-central-1")
          .country("pt")
          .city("lisbon")
          .isLocal(true)
          .build();
      edgeHosts.save(daniel192168168);
      var daniel192168172 = EdgeHost.builder()
          .hostname("192.168.1.72")
          .sshUsername("daniel")
          .sshPassword("enhj")
          .region("eu-central-1")
          .country("pt")
          .city("lisbon")
          .isLocal(true)
          .build();
      edgeHosts.save(daniel192168172);
      var daniel1022245206 = EdgeHost.builder()
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
          .componentTypeName("Container")
          .build();
      componentTypes.save(container);
      var host = ComponentTypeEntity.builder()
          .componentTypeName("Host")
          .build();
      componentTypes.save(host);

      // operator
      var notEqualTo = OperatorEntity.builder()
          .operatorName("NOT_EQUAL_TO")
          .operatorSymbol("!=")
          .build();
      operators.save(notEqualTo);
      var equalTo = OperatorEntity.builder()
          .operatorName("EQUAL_TO")
          .operatorSymbol("==")
          .build();
      operators.save(equalTo);
      var greaterThan = OperatorEntity.builder()
          .operatorName("GREATER_THAN")
          .operatorSymbol(">")
          .build();
      operators.save(greaterThan);
      var lessThan = OperatorEntity.builder()
          .operatorName("LESS_THAN")
          .operatorSymbol("<")
          .build();
      operators.save(lessThan);
      var greaterThanOrEqualTo = OperatorEntity.builder()
          .operatorName("GREATER_THAN_OR_EQUAL_TO")
          .operatorSymbol(">=")
          .build();
      operators.save(greaterThanOrEqualTo);
      var lessThanOrEqualTo = OperatorEntity.builder()
          .operatorName("LESS_THAN_OR_EQUAL_TO")
          .operatorSymbol("<=")
          .build();
      operators.save(lessThanOrEqualTo);

      // decision
      var containerDecisionNone = DecisionEntity.builder()
          .componentType(container)
          .decisionName("NONE")
          .build();
      decisions.save(containerDecisionNone);
      var containerDecisionReplicate = DecisionEntity.builder()
          .componentType(container)
          .decisionName("REPLICATE")
          .build();
      decisions.save(containerDecisionReplicate);
      var containerDecisionMigrate = DecisionEntity.builder()
          .componentType(container)
          .decisionName("MIGRATE")
          .build();
      decisions.save(containerDecisionMigrate);
      var containerDecisionStop = DecisionEntity.builder()
          .componentType(container)
          .decisionName("STOP")
          .build();
      decisions.save(containerDecisionStop);
      var hostDecisionNone = DecisionEntity.builder()
          .componentType(host)
          .decisionName("NONE")
          .build();
      decisions.save(hostDecisionNone);
      var hostDecisionStart = DecisionEntity.builder()
          .componentType(host)
          .decisionName("START")
          .build();
      decisions.save(hostDecisionStart);
      var hostDecisionStop = DecisionEntity.builder()
          .componentType(host)
          .decisionName("STOP")
          .build();
      decisions.save(hostDecisionStop);

      // fields

      // TODO is missing more fields...

      var cpu = FieldEntity.builder()
          .fieldName("cpu")
          .build();
      fields.save(cpu);
      var ram = FieldEntity.builder()
          .fieldName("ram")
          .build();
      fields.save(ram);
      var cpuPercentage = FieldEntity.builder()
          .fieldName("cpu-%")
          .build();
      fields.save(cpuPercentage);
      var ramPercentage = FieldEntity.builder()
          .fieldName("ram-%")
          .build();
      fields.save(ramPercentage);
      var rxBytes = FieldEntity.builder()
          .fieldName("rx-bytes")
          .build();
      fields.save(rxBytes);
      var txBytes = FieldEntity.builder()
          .fieldName("tx-bytes")
          .build();
      fields.save(txBytes);
      var rxBytesPerSec = FieldEntity.builder()
          .fieldName("rx-bytes-per-sec")
          .build();
      fields.save(rxBytesPerSec);
      var txBytesPerSec = FieldEntity.builder()
          .fieldName("tx-bytes-per-sec")
          .build();
      fields.save(txBytesPerSec);
      var latency = FieldEntity.builder()
          .fieldName("latency")
          .build();
      fields.save(latency);
      var bandwidthPercentage = FieldEntity.builder()
          .fieldName("bandwidth-%")
          .build();
      fields.save(bandwidthPercentage);

      // value modes
      var effectiveValue = ValueModeEntity.builder()
          .valueModeName("effective-val")
          .build();
      valueModes.save(effectiveValue);
      var averageValue = ValueModeEntity.builder()
          .valueModeName("avg-val")
          .build();
      valueModes.save(averageValue);
      var deviationPercentageOnAverageValue = ValueModeEntity.builder()
          .valueModeName("deviation-%-on-avg-val")
          .build();
      valueModes.save(deviationPercentageOnAverageValue);
      var deviationPercentageOnLastValue = ValueModeEntity.builder()
          .valueModeName("deviation-%-on-last-val")
          .build();
      valueModes.save(deviationPercentageOnLastValue);

      // rules
      var cpuAndRamPercentageOver90Rule = RuleEntity.builder()
          .ruleName("%CPU > 90% and %RAM > 90")
          .componentType(host)
          .priority(1)
          .decision(hostDecisionStart)
          .build();
      rules.save(cpuAndRamPercentageOver90Rule);

      // conditions
      var cpuPercentageOver90 = ConditionEntity.builder()
          .valueMode(effectiveValue)
          .field(cpuPercentage)
          .operator(greaterThan)
          .conditionValue(90)
          .build();
      conditions.save(cpuPercentageOver90);
      var ramPercentageOver90 = ConditionEntity.builder()
          .valueMode(effectiveValue)
          .field(ramPercentage)
          .operator(greaterThan)
          .conditionValue(90)
          .build();
      conditions.save(ramPercentageOver90);

      // rule conditions
      var cpuAndRamPercentageOver90Condition1 = RuleConditionEntity.builder()
          .rule(cpuAndRamPercentageOver90Rule)
          .condition(cpuPercentageOver90)
          .build();
      ruleConditions.save(cpuAndRamPercentageOver90Condition1);
      var cpuAndRamPercentageOver90Condition2 = RuleConditionEntity.builder()
          .rule(cpuAndRamPercentageOver90Rule)
          .condition(ramPercentageOver90)
          .build();
      ruleConditions.save(cpuAndRamPercentageOver90Condition2);

      // generic host rules
      var cpuAndRamPercentageOver90GenericHostRule = GenericHostRuleEntity.builder()
          .rule(cpuAndRamPercentageOver90Rule)
          .build();
      genericHostRules.save(cpuAndRamPercentageOver90GenericHostRule);
    };
  }

}
