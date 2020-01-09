-- TODO: insert without ids

--TODO add sock-shop name to docker-repository names

INSERT INTO app_package (id, app_name)
VALUES (
    1,
    'Sock Shop'
);

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                        launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    1,
    'front-end',
    'front-end',
    '8079',
    '80',
    'NOT_APPLICABLE',
    '${eurekaHost} ${externalPort} ${internalPort} ${hostname}',
    1,
    0,
    '${front-endHost}',
    'frontend',
    209715200
);

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    2,
    'user',
    'user',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    3,
    'catalogue',
    'catalogue',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    4,
    'payment',
    'payment',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    5,
    'carts',
    'carts',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    6,
    'orders',
    'orders',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    7,
    'shipping',
    'shipping',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    8,
    'queue-master',
    'queue-master',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    9,
    'rabbitmq',
    'rabbitmq-glibc',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    10,
    'user-db',
    'user-db',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    11,
    'catalogue-db',
    'catalogue-db',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    12,
    'carts-db',
    'mongo3',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    13,
    'orders-db',
    'mongo3',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    14,
    'eureka-server',
    'registration-server',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                     launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    15,
    'load-balancer',
    'nginx-load-balancer',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    16,
    'docker-api-proxy',
    'nginx-proxy',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    17,
    'prometheus',
    'prometheus',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    18,
    'request-location-monitor',
    'request-location-monitor',
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

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    19,
    'master-manager',
    'master-manager',
    '1919',
    '1919',
    'NOT_APPLICABLE',
    '', -- TODO
    1,
    1,
    '${masterManagerHost}',
    'system',
    0 --TODO
);

INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    20,
    'local-manager',
    'local-manager',
    '1919',
    '1919',
    'NOT_APPLICABLE',
    '', -- TODO
    1,
    0,
    '${localManagerHost}',
    'system',
    0 --TODO
);

/*INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                      launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    21,
    'consul-server',
    'docker-consul',
    '8500+8600/udp',
    '8500+8600/udp',
    'NOT_APPLICABLE',  --TODO try null values
    'agent -server -ui -node=server-1 -bootstrap-expect=1 -client=0.0.0.0', -- TODO
    '1',
    '3',
    '${consulServerHost}',
    'system',
    '0' --TODO
)
INSERT INTO service (id, service_name, docker_repository, default_external_port, default_internal_port, default_db,
                    launch_command, min_replics, max_replics, output_label, service_type, expected_memory_consumption)
VALUES (
    22,
    'consul-client',
    'docker-consul',
    '8500-8600/udp',
    '8500-8600/udp',
    'NOT_APPLICABLE',  --TODO try null values
    'TODO',
    '1',
    '1',
    '${consulClientHost}',
    'system',
    '0' --TODO
)
*/

----- APP SERVICES -----
INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    1,
    1,
    1, -- front-end
    25
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    2,
    1,
    2, -- user
    10
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    3,
    1,
    3, -- catalogue
    10
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    4,
    1,
    4, -- payment
    5
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    5,
    1,
    5, -- carts
    10
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    6,
    1,
    6, -- orders
    20
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    7,
    1,
    7, -- shipping
    15
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    8,
    1,
    8, -- queue-master
    15
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    9,
    1,
    9, -- rabbitmq
    5
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    11,
    1,
    11, -- user-db
    0
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    12,
    1,
    12, -- catalogue-db
    0
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    13,
    1,
    13, -- carts-db
    0
);

INSERT INTO app_service (id, app_package_id, service_id, launch_order)
VALUES (
    14,
    1,
    14, -- orders-db
    0
);


----- SERVICE DEPENDENCIES -----
INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    1,
    1,
    10
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    2,
    1,
    2
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    3,
    1,
    3
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    4,
    1,
    4
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    5,
    1,
    5
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    6,
    2,
    10
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    7,
    2,
    11
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    8,
    3,
    10
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    9,
    3,
    12
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    10,
    4,
    10
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    11,
    5,
    10
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    12,
    5,
    13
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    13,
    6,
    10
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    14,
    6,
    4
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    15,
    6,
    7
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    16,
    6,
    14
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    17,
    7,
    10
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    18,
    7,
    9
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    19,
    8,
    10
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    20,
    8,
    9
);

INSERT INTO service_dependency (id, service_id, service_dependency_id)
VALUES (
    21,
    9,
    10
);


----- REGIONS -----
INSERT INTO region (id, region_name, region_description, active)
VALUES (
    1,
    'us-east-1',
    'US East (N. Virginia)',
    TRUE
);

INSERT INTO region (id, region_name, region_description, active)
VALUES (
    2,
    'eu-central-1',
    'EU (Frankfurt)',
    TRUE
);

INSERT INTO region (id, region_name, region_description, active)
VALUES (
    3,
    'eu-west-2',
    'EU (London)',
    TRUE
);


----- EDGE HOSTS -----

INSERT INTO edge_host (id, hostname, ssh_username, ssh_password, region, country, city, is_local)
VALUES (
    1,
    '127.0.0.1',
    'daniel',
    'enhj',
    'eu-central-1',
    'pt',
    'lisbon',
    TRUE
);

INSERT INTO edge_host (id, hostname, ssh_username, ssh_password, region, country, city, is_local)
VALUES (
    2,
    '192.168.1.76',
    'daniel',
    'enhj',
    'eu-central-1',
    'pt',
    'lisbon',
    TRUE
);

INSERT INTO edge_host (id, hostname, ssh_username, ssh_password, region, country, city, is_local)
VALUES (
    3,
    '192.168.1.68',
    'daniel',
    'enhj',
    'eu-central-1',
    'pt',
    'lisbon',
    TRUE
);

INSERT INTO edge_host (id, hostname, ssh_username, ssh_password, region, country, city, is_local)
VALUES (
    4,
    '192.168.1.72',
    'daniel',
    'enhj',
    'eu-central-1',
    'pt',
    'lisbon',
    TRUE
);

INSERT INTO edge_host (id, hostname, ssh_username, ssh_password, region, country, city, is_local)
VALUES (
    5,
    '10.22.245.206',
    'daniel',
    'enhj',
    'eu-central-1',
    'pt',
    'lisbon',
    TRUE
);

----- RULES TABLES -----

----- OPERATOR -----
INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (
    1,
    'NOT_EQUAL_TO',
    '!='
);

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (
    2,
    'EQUAL_TO',
    '=='
);

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (
    3,
    'GREATER_THAN',
    '>'
);

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (
    4,
    'LESS_THAN',
    '<'
);

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (
    5,
    'GREATER_THAN_OR_EQUAL_TO',
    '>='
);

INSERT INTO operator (id, operator_name, operator_symbol)
VALUES (
    6,
    'LESS_THAN_OR_EQUAL_TO',
    '<='
);

----- COMPONENT_TYPE -----
INSERT INTO component_type (id, component_type_name)
VALUES (
    1,
    'CONTAINER'
);

INSERT INTO component_type (id, component_type_name)
VALUES (
    2,
    'HOST'
);

----- DECISION -----
INSERT INTO decision (id, component_type_id, decision_name)
VALUES (
    1,
    1,
    'NONE'
);

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (
    2,
    1,
    'REPLICATE'
);

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (
    3,
    1,
    'MIGRATE'
);

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (
    4,
    1,
    'STOP'
);

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (
    5,
    2,
    'NONE'
);

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (
    6,
    2,
    'START'
);

INSERT INTO decision (id, component_type_id, decision_name)
VALUES (
    7,
    2,
    'STOP'
);

----- FIELD -----
INSERT INTO field (id, field_name)
VALUES (
    1,
    'cpu'
);

INSERT INTO field (id, field_name)
VALUES (
    2,
    'ram'
);

INSERT INTO field (id, field_name)
VALUES (
    3,
    'cpu-%'
);

INSERT INTO field (id, field_name)
VALUES (
    4,
    'ram-%'
);

INSERT INTO field (id, field_name)
VALUES (
    5,
    'rx-bytes'
);

INSERT INTO field (id, field_name)
VALUES (
    6,
    'tx-bytes'
);

INSERT INTO field (id, field_name)
VALUES (
    7,
    'rx-bytes-per-sec'
);

INSERT INTO field (id, field_name)
VALUES (
    8,
    'tx-bytes-per-sec'
);

INSERT INTO field (id, field_name)
VALUES (
    9,
    'latency'
);

INSERT INTO field (id, field_name)
VALUES (
    10,
    'bandwidth-%'
);

-- Is missing more fields...

----- VALUE_MODE -----

INSERT INTO value_mode (id, value_mode_name)
VALUES (
    1,
    'deviation-%-on-avg-val'
);

INSERT INTO value_mode (id, value_mode_name)
VALUES (
    2,
    'effective-val'
);

INSERT INTO value_mode (id, value_mode_name)
VALUES (
    3,
    'avg-val'
);

INSERT INTO value_mode (id, value_mode_name)
VALUES (
    4,
    'deviation-%-on-last-val'
);


----- RULES TESTS -----

INSERT INTO rule (id, rule_name, component_type_id, priority, decision_id)
VALUES (
    1,
    '%CPU > 90% and %RAM > 90',
    2,
    1,
    6
);

INSERT INTO condition (id, value_mode_id, field_id, operator_id, condition_value)
VALUES (
    1,
    2,
    3,
    3,
    90
);

INSERT INTO condition (id, value_mode_id, field_id, operator_id, condition_value)
VALUES (
    2,
    2,
    4,
    3,
    90
);

INSERT INTO rule_condition (id, rule_id, condition_id)
VALUES (
    1,
    1,
    1
);

INSERT INTO rule_condition (id, rule_id, condition_id)
VALUES (
    2,
    1,
    2
);

INSERT INTO generic_host_rule (id, rule_id)
VALUES (
    1,
    1
);