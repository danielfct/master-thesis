package api

// App type
type App struct {
	InstanceId string `json:"instanceId,omitempty"`
	Endpoint   string `json:"endpoint,omitempty"`
}

//Empty type
type Empty struct {
}

// LocationMonitoring type
type LocationMonitoring struct {
	Valid         bool   `json:"valid,omitempty"`
	FromContinent string `json:"fromContinent,omitempty"`
	FromRegion    string `json:"fromRegion,omitempty"`
	FromCountry   string `json:"fromCountry,omitempty"`
	FromCity      string `json:"fromCity,omitempty"`
	ToService     string `json:"toService,omitempty"`
	Count         int    `json:"count,omitempty"`
}

// LocationMonitoringSimple type
type LocationMonitoringSimple struct {
	FromContinent string `json:"fromContinent,omitempty"`
	FromRegion    string `json:"fromRegion,omitempty"`
	FromCountry   string `json:"fromCountry,omitempty"`
	FromCity      string `json:"fromCity,omitempty"`
	ToService     string `json:"toService,omitempty"`
	Count         int    `json:"count,omitempty"`
}

// LocationMonitoringCustom type
type LocationMonitoringCustom struct {
	FromContinent string `json:"fromContinent,omitempty"`
	FromCountry   string `json:"fromCountry,omitempty"`
	FromCity      string `json:"fromCity,omitempty"`
	ToService     string `json:"toService,omitempty"`
	Count         int    `json:"count,omitempty"`
}

//Msg type
type Msg struct {
	Content string `json:"content,omitempty"`
}
