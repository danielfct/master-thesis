package eurekaops

// MIT Licensed (see README.md) - Copyright (c) 2013 Hudl <@Hudl>

import (
	"math/rand"
	"time"

	"bitbucket.org/cloudedgemicroserviceteam/register-go/reglog"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

// SelectServiceURL gets a eureka instance based on the connection's load
// balancing scheme.
// TODO: Make this not just pick a random one.
func (e *EurekaConnection) SelectServiceURL() string {
	return choice(e.ServiceUrls)
}

func choice(options []string) string {
	if len(options) == 0 {
		reglog.Logger.Infof("There are no ServiceUrls to choose from, bailing out")
	}
	return options[rand.Int()%len(options)]
}

// NewConn is a default connection with just a list of ServiceUrls. Most basic
// way to make a new connection. Generally only if you know what you're doing
// and are going to do the configuration yourself some other way.
func NewConn(address ...string) (e EurekaConnection) {
	e.ServiceUrls = address
	return e
}
