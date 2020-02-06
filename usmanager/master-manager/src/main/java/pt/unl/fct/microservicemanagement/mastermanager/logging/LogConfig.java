/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *//*


package pt.unl.fct.microservicemanagement.mastermanager.logging;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Logger;
import org.apache.logging.log4j.core.appender.db.jdbc.ColumnConfig;
import org.apache.logging.log4j.core.appender.db.jdbc.JdbcAppender;
import org.apache.logging.log4j.core.filter.ThresholdFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class LogConfig {

  private final Environment env;

  public LogConfig(Environment env) {
    this.env = env;
  }

  @PostConstruct
  public void onStartUp() {
    String url = env.getProperty("spring.datasource.url");
    String userName = env.getProperty("spring.datasource.username");
    String password = env.getProperty("spring.datasource.password");
    String validationQuery = env.getProperty("spring.datasource.validation-query");

    // Create a new connectionSource build from the Spring properties
    JdbcConnectionSource connectionSource = new JdbcConnectionSource(url, userName, password, validationQuery);

    // This is the mapping between the columns in the table and what to insert in it.
    ColumnConfig[] columnConfigs = new ColumnConfig[5];
    columnConfigs[0] = ColumnConfig.createColumnConfig(null, "APPLICATION", "ACCESS", null, null, "false", null);
    columnConfigs[1] = ColumnConfig.createColumnConfig(null, "LOG_DATE", null, null, "true", null, null);
    columnConfigs[2] = ColumnConfig.createColumnConfig(null, "LOGGER", "%logger", null, null, "false", null);
    columnConfigs[3] = ColumnConfig.createColumnConfig(null, "LOG_LEVEL", "%level", null, null, "false", null);
    columnConfigs[4] = ColumnConfig.createColumnConfig(null, "MESSAGE", "%message", null, null, "false", null);

    // filter for the appender to keep only errors
    ThresholdFilter filter = ThresholdFilter.createFilter(Level.ERROR, null, null);

    // The creation of the new database appender passing:
    // - the name of the appender
    // - ignore exceptions encountered when appending events are logged
    // - the filter created previously
    // - the connectionSource,
    // - log buffer size,
    // - the name of the table
    // - the config of the columns.
    JdbcAppender appender = JdbcAppender.createAppender("DB", "true", filter, connectionSource,
        "1", "LOGS", columnConfigs);

    // start the appender, and this is it...
    appender.start();
    ((Logger) LogManager.getRootLogger()).addAppender(appender);
  }
}
*/
