package com.dsleandro.chatear.security;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;

import com.dsleandro.chatear.service.UserDetailsServiceImpl;

import static com.dsleandro.chatear.security.SecurityConstants.SIGN_UP_URL;

import java.util.Arrays;

@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {
  @Autowired
  private UserDetailsServiceImpl userDetailsService;
  @Autowired
  private BCryptPasswordEncoder bCryptPasswordEncoder;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.cors().and().csrf().disable().authorizeRequests()
        // set SignUp as public path
        .antMatchers(HttpMethod.POST, SIGN_UP_URL).permitAll()
        .antMatchers("/ws/**").permitAll()
        .anyRequest().authenticated().and()
        // Provide a token to user if authentication is success
        .addFilter(new JwtAuthFilter(authenticationManager()))
        // Verify if user has a token
        .addFilter(new JwtAuthorizationFilter(authenticationManager()))
        // this disables session creation on Spring Security
        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
  }

  // Encrypt password
  @Override
  public void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.applyPermitDefaultValues();
    config.setAllowCredentials(true);
    config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
    config.setExposedHeaders(Arrays.asList("Authorization", "user"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));

    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}