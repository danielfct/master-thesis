#!/bin/sh
#Script to launch processes

java -Djava.security.egd=file:/dev/urandom -jar ./app.jar --port=$3 --db=$5 &
exec ./register -execapp=java -app=CARTS -autoregister=false -eureka=$1 -port=$2 -hostname=$4