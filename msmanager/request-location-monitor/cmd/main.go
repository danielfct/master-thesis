package main

import (
	"flag"
	"log"
	"net/http"

	"bitbucket.org/microservicemanagement/request-location-monitor/api"
	"github.com/gorilla/mux"
)

func main() {

	var port = flag.String("port", "1919", "Port to bind HTTP listener")
	flag.Parse()

	router := mux.NewRouter()
	router.HandleFunc("/api/monitoringinfo/all", api.ListAllMonitoring).Methods("GET")
	router.HandleFunc("/api/monitoringinfo/all/top", api.ListAllMonitoringTop).Methods("GET")
	router.HandleFunc("/api/monitoringinfo/all/top/{seconds}", api.ListAllMonitoringTop).Methods("GET")
	//router.HandleFunc("/api/monitoringinfo/service/{serviceName}", api.AddServer).Methods("GET")
	//router.HandleFunc("/api/monitoringinfo/service/{serviceName}/top", api.DeleteServer).Methods("GET")
	router.HandleFunc("/api/monitoringinfo/add", api.AddMonitoringData).Methods("POST")
	log.Printf("-> request-location-monitor is listening on port %s.", *port)
	log.Fatal(http.ListenAndServe(":"+*port, router))
}
