package data

import (
	"time"

	"bitbucket.org/cloudedgemicroserviceteam/request-location-monitor/utils"
)

// LocationMonitoringData data
var LocationMonitoringData *utils.ConcurrentMap

// LocationMonitoringSimple type
type LocationMonitoringSimple struct {
	FromContinent string `json:"fromContinent"`
	FromRegion    string `json:"fromRegion"`
	FromCountry   string `json:"fromCountry"`
	FromCity      string `json:"fromCity"`
	ToService     string `json:"toService"`
	Count         int    `json:"count"`
}

// LocationMonitoring type
type LocationMonitoring struct {
	FromContinent string    `json:"fromContinent"`
	FromRegion    string    `json:"fromRegion"`
	FromCountry   string    `json:"fromCountry"`
	FromCity      string    `json:"fromCity"`
	ToService     string    `json:"toService"`
	Count         int       `json:"count"`
	Timestamp     time.Time `json:"timestamp"`
}

// LocationMonitoringResp type
type LocationMonitoringResp struct {
	ToService    string                   `json:"toService"`
	LocationData LocationMonitoringSimple `json:"locationData"`
}

// LocationMonitoringRespAll type
type LocationMonitoringRespAll struct {
	ToService    string             `json:"toService"`
	LocationData LocationMonitoring `json:"locationData"`
}

// Message type
type Message struct {
	Message string `json:"message"`
}

func init() {
	LocationMonitoringData = utils.NewConcurrentMap()
}
