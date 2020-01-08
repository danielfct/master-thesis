FROM acarrusca/nginx-load-balancer-api

FROM nginx:alpine

# for htpasswd command
RUN apk add --no-cache --update \
      apache2-utils
RUN rm -f /etc/nginx/conf.d/*

RUN mkdir -p /etc/nginx/geoip
RUN wget http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz -P /etc/nginx/geoip
RUN wget http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz -P /etc/nginx/geoip
RUN gunzip /etc/nginx/geoip/GeoIP.dat.gz
RUN gunzip /etc/nginx/geoip/GeoLiteCity.dat.gz


ENV SERVER_NAME load-balancer.com
# ENV ALG round-robin

COPY --from=0 /nginx-load-balancer-api ./nginx-load-balancer-api
COPY files/run.sh /
COPY files/nginx.conf.tmpl /

# use SIGQUIT for graceful shutdown
# c.f. http://nginx.org/en/docs/control.html
STOPSIGNAL SIGQUIT

ENTRYPOINT ["/run.sh"]