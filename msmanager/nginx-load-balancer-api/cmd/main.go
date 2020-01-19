package main

import (
	"flag"
	"log"
	"net/http"

	"bitbucket.org/microservicemanagement/nginx-load-balancer-api/api"
	"github.com/gorilla/mux"
)

func main() {

	var port = flag.String("port", "1907", "Port to bind HTTP listener")
	flag.Parse()

	router := mux.NewRouter()
	router.HandleFunc("/_/nginx-load-balancer-api/api/servers", api.GetServers).Methods("GET")
	router.HandleFunc("/_/nginx-load-balancer-api/api/sameregionservers", api.GetSameRegionServers).Methods("GET")
	router.HandleFunc("/_/nginx-load-balancer-api/api/otherregionservers", api.GetOtherRegionsServers).Methods("GET")
	router.HandleFunc("/_/nginx-load-balancer-api/api/servers", api.AddServer).Methods("POST")
	router.HandleFunc("/_/nginx-load-balancer-api/api/servers", api.DeleteServer).Methods("DELETE")
	log.Printf("-> Nginx API is listening on port %s.", *port)
	log.Fatal(http.ListenAndServe(":"+*port, router))
}
