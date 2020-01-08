package eurekaops

import (
	"math/rand"
	"strings"

	"bitbucket.org/cloudedgemicroserviceteam/register-go/api"
)

//GetBestInstance returns the best app instance
func GetBestInstance(thisInstance *Instance, instances []*Instance) api.App {
	var app api.App
	thisContinent, thisRegion, thisCountry, thisCity := getInstanceLocationInfo(*thisInstance)

	var instancesAll []api.App
	var instancesContinent []api.App
	var instancesRegion []api.App
	var instancesCountry []api.App
	var instancesCity []api.App
	for _, appInstance := range instances {
		app = api.App{
			InstanceId: appInstance.InstanceId,
			Endpoint:   appInstance.HomePageUrl,
		}
		instancesAll = append(instancesAll, app)

		appContinent, appRegion, appCountry, appCity := getInstanceLocationInfo(*appInstance)
		if strings.EqualFold(thisContinent, appContinent) {
			instancesContinent = append(instancesContinent, app)
		}
		if strings.EqualFold(thisRegion, appRegion) {
			instancesRegion = append(instancesRegion, app)
		}
		if strings.EqualFold(thisCountry, appCountry) && thisCountry != "" && appCountry != "" {
			instancesCountry = append(instancesCountry, app)
		}
		if strings.EqualFold(thisCity, appCity) && thisCity != "" && appCity != "" {
			instancesCity = append(instancesCity, app)
		}
	}

	if len(instancesCity) > 0 {
		maxIndex := len(instancesCity)
		app = instancesCity[randomIndex(maxIndex)]
	} else if len(instancesCountry) > 0 {
		maxIndex := len(instancesCountry)
		app = instancesCountry[randomIndex(maxIndex)]
	} else if len(instancesRegion) > 0 {
		maxIndex := len(instancesRegion)
		app = instancesRegion[randomIndex(maxIndex)]
	} else if len(instancesContinent) > 0 {
		maxIndex := len(instancesContinent)
		app = instancesContinent[randomIndex(maxIndex)]
	} else {
		maxIndex := len(instancesAll)
		app = instancesAll[randomIndex(maxIndex)]
	}
	return app
}

//GetApps returns apps instances
func GetApps(instances []*Instance) []api.App {
	var apps []api.App
	for _, appInstance := range instances {
		app := api.App{
			InstanceId: appInstance.InstanceId,
			Endpoint:   appInstance.HomePageUrl,
		}
		apps = append(apps, app)
	}
	return apps
}

//Returns serviceContinent, serviceRegion, serviceCountry, serviceCity
func getInstanceLocationInfo(instance Instance) (string, string, string, string) {
	serviceContinent, err := instance.Metadata.GetString("serviceContinent")
	if err != nil {
		serviceContinent = ""
	}
	serviceRegion, err := instance.Metadata.GetString("serviceRegion")
	if err != nil {
		serviceRegion = ""
	}
	serviceCountry, err := instance.Metadata.GetString("serviceCountry")
	if err != nil {
		serviceCountry = ""
	}
	serviceCity, err := instance.Metadata.GetString("serviceCity")
	if err != nil {
		serviceCity = ""
	}
	return serviceContinent, serviceRegion, serviceCountry, serviceCity
}

func randomIndex(max int) int {
	return rand.Intn(max)
}
