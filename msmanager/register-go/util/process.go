package util

import (
	"strings"

	"bitbucket.org/microservicemanagement/register-go/reglog"
	"github.com/mitchellh/go-ps"
)

// FindProcess : Find system process
func FindProcess(key string) (int, string, bool) {
	pname := ""
	pid := 0
	found := false
	ps, _ := ps.Processes()
	for i := range ps {
		reglog.Logger.Debugf("Process #%d in list -> PID: %d; Name: %s", i, ps[i].Pid(), ps[i].Executable())
		if strings.Contains(ps[i].Executable(), key) {
			pid = ps[i].Pid()
			pname = ps[i].Executable()
			found = true
			break
		}
	}
	return pid, pname, found
}
