package es.startuphero.rest.app.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.Assert;

/**
 * @author cenk
 */
public class RestLoginFilter extends UsernamePasswordAuthenticationFilter {

  private static final Logger LOGGER = LoggerFactory.getLogger(RestLoginFilter.class);

  private final ObjectMapper objectMapper;

  RestLoginFilter(ObjectMapper objectMapper, String loginUrl) {
    this.objectMapper = objectMapper;
    setRequiresAuthenticationRequestMatcher(new FilterProcessUrlRequestMatcher(loginUrl));
  }

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
    if (!request.getMethod().equals("POST")) {
      throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
    }
    LoginRequest loginRequest = this.getLoginRequest(request);
    UsernamePasswordAuthenticationToken authRequest =
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                                                loginRequest.getPassword());
    setDetails(request, authRequest);
    return getAuthenticationManager().authenticate(authRequest);
  }

  private LoginRequest getLoginRequest(HttpServletRequest request) {
    try {
      BufferedReader reader = request.getReader();
      return objectMapper.readerFor(LoginRequest.class).readValue(reader);
    } catch (IOException e) {
      LOGGER.debug("Exception for reader", e);
      return new LoginRequest();
    }
  }

  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                          Authentication authResult)
      throws IOException, ServletException {
    if (LOGGER.isDebugEnabled()) {
      LOGGER.debug("Authentication success. Updating SecurityContextHolder to contain: " + authResult);
    }
    SecurityContextHolder.getContext().setAuthentication(authResult);
    getRememberMeServices().loginSuccess(request, response, authResult);
    getSuccessHandler().onAuthenticationSuccess(request, response, authResult);
  }

  private static class LoginRequest {

    private String username;

    private String password;

    String getUsername() {
      return username;
    }

    public void setUsername(String username) {
      this.username = username;
    }

    public String getPassword() {
      return password;
    }

    public void setPassword(String password) {
      this.password = password;
    }
  }

  private static final class FilterProcessUrlRequestMatcher implements RequestMatcher {

    private final String filterProcessesUrl;

    FilterProcessUrlRequestMatcher(String filterProcessesUrl) {
      Assert.hasLength(filterProcessesUrl, "filterProcessesUrl must be specified");
      Assert.isTrue(UrlUtils.isValidRedirectUrl(filterProcessesUrl),
                    filterProcessesUrl + " isn't a valid redirect URL");
      this.filterProcessesUrl = filterProcessesUrl;
    }

    public boolean matches(HttpServletRequest request) {
      String uri = request.getRequestURI();
      int pathParamIndex = uri.indexOf(';');
      if (pathParamIndex > 0) {
        // strip everything after the first semi-colon
        uri = uri.substring(0, pathParamIndex);
      }
      if ("".equals(request.getContextPath())) {
        return uri.endsWith(filterProcessesUrl);
      }
      return uri.endsWith(request.getContextPath() + filterProcessesUrl);
    }
  }
}
