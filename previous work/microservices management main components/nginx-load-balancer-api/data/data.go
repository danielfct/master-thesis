package data

import (
	"flag"
	"os"
)

// ServerWeight type
type ServerWeight struct {
	Hostname  string `json:"hostname,omitempty"`
	Continent string `json:"continent,omitempty"`
	Region    string `json:"region,omitempty"`
	Country   string `json:"country,omitempty"`
	City      string `json:"city,omitempty"`
	Weight    string `json:"weight,omitempty"`
}

// Server type
type Server struct {
	Hostname  string `json:"hostname,omitempty"`
	Continent string `json:"continent,omitempty"`
	Region    string `json:"region,omitempty"`
	Country   string `json:"country,omitempty"`
	City      string `json:"city,omitempty"`
}

// SimpleServer type
type SimpleServer struct {
	Hostname string `json:"hostname,omitempty"`
}

// Message type
type Message struct {
	Message string `json:"message,omitempty"`
}

// Location type
type Location struct {
	Continent string `json:"continent,omitempty"`
	Region    string `json:"region,omitempty"`
	Country   string `json:"country,omitempty"`
	City      string `json:"city,omitempty"`
}

//Servers list of servers
var Servers []ServerWeight

//OtherRegionsServers other regions servers
var OtherRegionsServers []ServerWeight

//SameRegionsServers same region servers as load balancer
var SameRegionsServers []ServerWeight

// LoadBalancerLocation load balancer location
var LoadBalancerLocation Location

// LoadBalancerIsEdge load balancer is edge
var LoadBalancerIsEdge bool

// WeightSameRegion Same region servers weight
var WeightSameRegion *string

// WeightOtherRegion Other region servers weight
var WeightOtherRegion *string

func init() {
	WeightSameRegion = flag.String("weightsameregion", "5", "Same region servers weight")
	WeightOtherRegion = flag.String("weightotherregion", "4", "Other region servers weight")
	flag.Parse()

	LoadBalancerLocation = Location{
		Continent: os.Getenv("SERVICE_CONTINENT"),
		Region:    os.Getenv("SERVICE_REGION"),
		Country:   os.Getenv("SERVICE_COUNTRY"),
		City:      os.Getenv("SERVICE_CITY"),
	}

	LoadBalancerIsEdge = LoadBalancerLocation.Country != ""

	server1 := Server{
		Hostname:  os.Getenv("SERVER1"),
		Continent: os.Getenv("SERVER1_CONTINENT"),
		Region:    os.Getenv("SERVER1_REGION"),
		Country:   os.Getenv("SERVER1_COUNTRY"),
		City:      os.Getenv("SERVER1_CITY"),
	}

	serverW := GetServerWeight(server1)

	if server1.Region != "none" {
		if LoadBalancerLocation.Region == server1.Region {
			SameRegionsServers = append(SameRegionsServers, serverW)
		} else {
			OtherRegionsServers = append(OtherRegionsServers, serverW)
		}
	}
	Servers = append(Servers, serverW)
}

// GetServerWeight result the server with weight
func GetServerWeight(server Server) ServerWeight {
	var weight string
	if LoadBalancerLocation.Region == server.Region {
		weight = *WeightSameRegion
	} else {
		weight = *WeightOtherRegion
	}

	serverW := ServerWeight{
		Hostname:  server.Hostname,
		Continent: server.Continent,
		Region:    server.Region,
		Country:   server.Country,
		City:      server.City,
		Weight:    weight,
	}
	return serverW
}
