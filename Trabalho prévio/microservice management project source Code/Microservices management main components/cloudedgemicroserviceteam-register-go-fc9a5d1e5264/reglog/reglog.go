package reglog

import (
	"go.uber.org/zap"
)

//Logger to use
var Logger = getLog()

//getLog returns logger
func getLog() *zap.SugaredLogger {
	logger, _ := zap.NewDevelopment()
	defer logger.Sync()

	sugar := logger.Sugar()
	return sugar
}
