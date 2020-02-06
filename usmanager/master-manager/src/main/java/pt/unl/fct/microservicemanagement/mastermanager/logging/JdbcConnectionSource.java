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

import org.apache.commons.dbcp.DriverManagerConnectionFactory;
import org.apache.commons.dbcp.PoolableConnection;
import org.apache.commons.dbcp.PoolableConnectionFactory;
import org.apache.commons.dbcp.PoolingDataSource;
import org.apache.commons.pool.impl.GenericObjectPool;
import org.apache.logging.log4j.core.appender.db.jdbc.ConnectionSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public class JdbcConnectionSource implements ConnectionSource {

  private DataSource dataSource;

  public JdbcConnectionSource(String url, String userName, String password, String validationQuery) {
    Properties properties = new Properties();
    properties.setProperty("user", userName);
    properties.setProperty("password", password);

    GenericObjectPool<PoolableConnection> pool = new GenericObjectPool<>();
    DriverManagerConnectionFactory cf = new DriverManagerConnectionFactory(url, properties);
    new PoolableConnectionFactory(cf, pool, null, validationQuery, 3, false, false, Connection.TRANSACTION_READ_COMMITTED);
    this.dataSource = new PoolingDataSource(pool);
  }

  @Override
  public Connection getConnection() throws SQLException {
    return dataSource.getConnection();
  }

}
*/
