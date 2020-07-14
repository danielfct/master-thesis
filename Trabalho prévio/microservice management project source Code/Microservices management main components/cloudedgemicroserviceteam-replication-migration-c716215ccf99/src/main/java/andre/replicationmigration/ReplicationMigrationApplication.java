package andre.replicationmigration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.ErrorMvcAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;

@EnableAutoConfiguration(exclude = { ErrorMvcAutoConfiguration.class })
@SpringBootApplication
@EnableCaching
public class ReplicationMigrationApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReplicationMigrationApplication.class, args);
	}
}
