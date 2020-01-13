INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		1,
		'front-end',
		'acarrusca/front-end',
		'80',
		'8079',
		'NOT_APPLICABLE',
		'${eurekaHost} ${externalPort} ${internalPort} ${hostname}',
		1,
		0,
		'${front-endHost}',
		'frontend',
		209715200
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		2,
		'user',
		'acarrusca/user',
		'8080',
		'80',
		'user-db:27017',
		'${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${userDatabaseHost}',
		1,
		0,
		'${userHost}',
		'backend',
		62914560
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		3,
		'catalogue',
		'acarrusca/catalogue',
		'8081',
		'80',
		'catalogue-db:3306',
		'${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${catalogueDatabaseHost}',
		1,
		0,
		'${catalogueHost}',
		'backend',
		62914560
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		4,
		'payment',
		'acarrusca/payment',
		'8082',
		'80',
		'NOT_APPLICABLE',
		'${eurekaHost} ${externalPort} ${internalPort} ${hostname}',
		1,
		0,
		'${paymentHost}',
		'backend',
		62914560
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		5,
		'carts',
		'acarrusca/carts',
		'8083',
		'80',
		'carts-db:27017',
		'${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${cartsDatabaseHost}',
		1,
		0,
		'${cartsHost}',
		'backend',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		6,
		'orders',
		'acarrusca/orders',
		'8084',
		'80',
		'orders-db:27017',
		'${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${ordersDatabaseHost}',
		1,
		0,
		'${ordersHost}',
		'backend',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		7,
		'shipping',
		'acarrusca/shipping',
		'8085',
		'80',
		'NOT_APPLICABLE',
		'${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${rabbitmqHost}',
		1,
		0,
		'${shippingHost}',
		'backend',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		8,
		'queue-master',
		'acarrusca/queue-master',
		'8086',
		'80',
		'NOT_APPLICABLE',
		'${eurekaHost} ${externalPort} ${internalPort} ${hostname} ${rabbitmqHost}',
		1,
		0,
		'${queue-masterHost}',
		'backend',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		9,
		'rabbitmq',
		'acarrusca/rabbitmq-glibc',
		'5672',
		'5672',
		'NOT_APPLICABLE',
		'${eurekaHost} ${externalPort} ${internalPort} ${hostname}',
		1,
		1,
		'${rabbitmqHost}',
		'backend',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		10,
		'eureka-server',
		'acarrusca/registration-server',
		'8761',
		'8761',
		'NOT_APPLICABLE',
		'${externalPort} ${internalPort} ${hostname} ${zone}',
		1,
		0,
		'${eurekaHost}',
		'system',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		11,
		'user-db',
		'acarrusca/user-db',
		'27017',
		'27017',
		'NOT_APPLICABLE',
		'', --No need for launch command
		1,
		0,
		'${userDatabaseHost}',
		'database',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		12,
		'catalogue-db',
		'acarrusca/catalogue-db',
		'3306',
		'3306',
		'NOT_APPLICABLE',
		'', --No need for launch command
		1,
		0,
		'${catalogueDatabaseHost}',
		'database',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		13,
		'carts-db',
		'acarrusca/mongo3',
		'27016',
		'27017',
		'NOT_APPLICABLE',
		'', --No need for launch command
		1,
		0,
		'${cartsDatabaseHost}',
		'database',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		14,
		'orders-db',
		'acarrusca/mongo3',
		'27015',
		'27017',
		'NOT_APPLICABLE',
		'', --No need for launch command
		1,
		0,
		'${ordersDatabaseHost}',
		'database',
		262144000
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		15,
		'load-balancer',
		'acarrusca/nginx-load-balancer',
		'1906',
		'80',
		'NOT_APPLICABLE',
		'', --No need for launch command
		1,
		0,
		'${loadBalancerHost}',
		'system',
		10485760
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		16,
		'docker-api-proxy',
		'acarrusca/nginx-proxy',
		'2375',
		'80',
		'NOT_APPLICABLE',
		'', --No need for launch command
		1,
		0,
		'${dockerApiProxyHost}',
		'system',
		10485760
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		17,
		'prometheus',
		'acarrusca/prometheus',
		'9090',
		'9090',
		'NOT_APPLICABLE',
		'', --No need for launch command
		1,
		0,
		'${prometheusHost}',
		'system',
		52428800
);

INSERT INTO service_config
	(id, service_name, docker_repo, default_external_port, default_internal_port, default_db, 
	launch_command, min_replics, max_replics, output_label, service_type, avg_mem)
VALUES
	(
		18,
		'request-location-monitor',
		'acarrusca/request-location-monitor',
		'1919',
		'1919',
		'NOT_APPLICABLE',
		'', --No need for launch command
		1,
		0,
		'${requestLocationMonitorHost}',
		'system',
		52428800
);

INSERT INTO app_package
	(id, app_name)
VALUES
	(1, 'Sock Shop');

----- APP SERVICES -----
INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(1, 1, 1, 25); -- front-end

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(2, 1, 2, 10); -- user

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(3, 1, 3, 10); -- catalogue

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(4, 1, 4, 5); -- payment

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(5, 1, 5, 10); -- carts

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(6, 1, 6, 20); -- orders

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES 
	(7, 1, 7, 15); -- shipping

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(8, 1, 8, 15); -- queue-master

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(9, 1, 9, 5); -- rabbitmq

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(11, 1, 11, 0); -- user-db

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(12, 1, 12, 0); -- catalogue-db

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(13, 1, 13, 0); -- carts-db

INSERT INTO app_service
	(id, app_package_id, service_config_id, launch_order)
VALUES
	(14, 1, 14, 0); -- orders-db


----- SERVICE DEPENDENCIES -----
INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(1, 1, 10);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(2, 1, 2);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(3, 1, 3);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(4, 1, 4);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(5, 1, 5);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(6, 2, 10);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(7, 2, 11);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(8, 3, 10);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(9, 3, 12);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(10, 4, 10);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(11, 5, 10);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(12, 5, 13);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(13, 6, 10);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(14, 6, 4);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(15, 6, 7);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(16, 6, 14);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(17, 7, 10);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(18, 7, 9);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(19, 8, 10);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(20, 8, 9);

INSERT INTO service_config_dependecy
	(id, service_config_id, service_config_dependency_id)
VALUES
	(21, 9, 10);


----- REGIONS -----
INSERT INTO region
	(id, region_name, region_description, active)
VALUES
	(1, 'us-east-1', 'US East (N. Virginia)', TRUE);

INSERT INTO region
	(id, region_name, region_description, active)
VALUES
	(2, 'eu-central-1', 'EU (Frankfurt)', TRUE);

INSERT INTO region
	(id, region_name, region_description, active)
VALUES
	(3, 'eu-west-2', 'EU (London)', TRUE);


----- EDGE HOSTS -----
INSERT INTO edge_host
	(id, hostname, ssh_username, ssh_password, region, country, city, is_local)
VALUES
	(1, '192.168.184.128', 'andre', 'MTIzNDU2', 'eu-central-1', 'pt', 'lisbon', TRUE);

INSERT INTO edge_host
	(id, hostname, ssh_username, ssh_password, region, country, city, is_local)
VALUES
	(2, '192.168.184.156', 'andre', 'MTIzNDU2', 'eu-central-1', 'pt', 'lisbon', TRUE);


INSERT INTO edge_host
	(id, hostname, ssh_username, ssh_password, region, country, city, is_local)
VALUES
	(3, '192.168.1.68', 'daniel', 'enhj', 'eu-central-1', 'pt', 'lisbon', TRUE);


----- RULES TABLES -----

----- OPERATOR -----
INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (1, 'NOT_EQUAL_TO', '!=');

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (2, 'EQUAL_TO', '==');

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (3, 'GREATER_THAN', '>');

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (4, 'LESS_THAN', '<');

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (5, 'GREATER_THAN_OR_EQUAL_TO', '>=');

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (6, 'LESS_THAN_OR_EQUAL_TO', '<=');

----- COMPONENT_TYPE -----
INSERT INTO component_type (id, component_type_name)
VALUES (1, 'CONTAINER');

INSERT INTO component_type (id, component_type_name)
VALUES (2, 'HOST');

----- DECISION -----
INSERT INTO decision (id, component_type_id, decision_name)
VALUES (1, 1, 'NONE');

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (2, 1, 'REPLICATE');

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (3, 1, 'MIGRATE');

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (4, 1, 'STOP');

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (5, 2, 'NONE');

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (6, 2, 'START');

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (7, 2, 'STOP');

----- FIELD -----
INSERT INTO field (id, field_name)
VALUES (1, 'cpu');

INSERT INTO field (id, field_name)
VALUES (2, 'ram');

INSERT INTO field (id, field_name)
VALUES (3, 'cpu-%');

INSERT INTO field (id, field_name)
VALUES (4, 'ram-%');

INSERT INTO field (id, field_name)
VALUES (5, 'rx-bytes');

INSERT INTO field (id, field_name)
VALUES (6, 'tx-bytes');

INSERT INTO field (id, field_name)
VALUES (7, 'rx-bytes-per-sec');

INSERT INTO field (id, field_name)
VALUES (8, 'tx-bytes-per-sec');

INSERT INTO field (id, field_name)
VALUES (9, 'latency');

INSERT INTO field (id, field_name)
VALUES (10, 'bandwidth-%');

-- Is missing more fields...


----- VALUE_MODE -----

INSERT INTO value_mode (id, value_mode_name)
VALUES (1, 'deviation-%-on-avg-val');

INSERT INTO value_mode (id, value_mode_name)
VALUES (2, 'effective-val');

INSERT INTO value_mode (id, value_mode_name)
VALUES (3, 'avg-val');

INSERT INTO value_mode (id, value_mode_name)
VALUES (4, 'deviation-%-on-last-val');


----- RULES TESTS -----

INSERT INTO rule (id, rule_name, component_type_id, priority, decision_id)
VALUES (1, '%CPU > 90% and %RAM > 90', 2, 1, 6);

INSERT INTO condition (id, value_mode_id, field_id, operator_id, condition_value)
VALUES (1, 2, 3, 3, 90);

INSERT INTO condition (id, value_mode_id, field_id, operator_id, condition_value)
VALUES (2, 2, 4, 3, 90);

INSERT INTO rule_condition (id, rule_id, condition_id)
VALUES (1, 1, 1);

INSERT INTO rule_condition (id, rule_id, condition_id)
VALUES (2, 1, 2);

INSERT INTO generic_host_rule (id, rule_id)
VALUES (1, 1);
