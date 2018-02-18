package es.startuphero.rest.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author cenk
 */
@SpringBootApplication(scanBasePackages = "es.startuphero.rest")
public class Application {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(Application.class);
    app.run(args).getEnvironment();
  }
}
