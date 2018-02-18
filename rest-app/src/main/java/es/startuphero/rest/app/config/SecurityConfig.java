package es.startuphero.rest.app.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationTargetUrlRequestHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;

/**
 * @author onurozcan
 */
@SuppressWarnings("SpringJavaAutowiringInspection")
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private final ObjectMapper objectMapper;

  private final ApplicationEventPublisher publisher;

  public SecurityConfig(ObjectMapper objectMapper, ApplicationEventPublisher publisher) {
    this.objectMapper = objectMapper;
    this.publisher = publisher;
  }

  @Override
  public void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.inMemoryAuthentication()
        .withUser("user")  // #1
        .password("password")
        .roles("USER")
        .and()
        .withUser("admin") // #2
        .password("password")
        .roles("ADMIN", "USER");
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    RestLoginFilter restLoginFilter = getLoginFilter();
    // @formatter:off
    http.exceptionHandling()
        .authenticationEntryPoint(
            (request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                                                                     "Authentication required!"))
        .and()
        .addFilterBefore(restLoginFilter, SecurityContextHolderAwareRequestFilter.class)
        .logout()
        .logoutUrl("/api/logout")
        .logoutSuccessHandler(new SimpleJsonUrlLogoutSuccessHandler())
        .deleteCookies("JSESSIONID", "SESSION")
        .and()
        .csrf()
        .disable()
        .headers()
        .xssProtection()
        .and()
        .cacheControl()
        .and()
        .and()
        .requestMatchers()
        .antMatchers("/api/**");
  }

  private RestLoginFilter getLoginFilter() throws Exception {
    RestLoginFilter loginFilter = new RestLoginFilter(objectMapper, "/api/login");
    loginFilter.setApplicationEventPublisher(publisher);
    loginFilter.setAuthenticationManager(authenticationManager());
    loginFilter.setAuthenticationSuccessHandler(restfulAuthenticationHandler());
    return loginFilter;
  }

  private AuthenticationSuccessHandler restfulAuthenticationHandler() {
    return (request, response, authentication) -> {
      response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
      response
          .getWriter()
          .write(objectMapper.writeValueAsString(
              SecurityContextHolder.getContext().getAuthentication().getPrincipal()));
      response.flushBuffer();
    };
  }

  public class SimpleJsonUrlLogoutSuccessHandler extends AbstractAuthenticationTargetUrlRequestHandler
      implements LogoutSuccessHandler {

    private static final String EMPTY_JSON = "{}";

    @Override
    public void onLogoutSuccess(HttpServletRequest request,
                                HttpServletResponse response,
                                Authentication authentication) throws IOException, ServletException {
      response.setCharacterEncoding(StandardCharsets.UTF_8.name());
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      try {
        response.getWriter().print(EMPTY_JSON);
        response.getWriter().flush();
      } catch (IOException ignored) {
        //no-op
      }
    }
  }
}
