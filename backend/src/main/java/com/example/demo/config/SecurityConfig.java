package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configura CORS
            .csrf(csrf -> csrf.disable()) // Deshabilita CSRF
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Permitir todas las solicitudes
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173"); // Permite localhost
        configuration.addAllowedOrigin("https://appnotes-5hgt.vercel.app"); // Permite producción en Vercel
        configuration.addAllowedMethod("*"); // Permite todos los métodos (GET, POST, etc.)
        configuration.addAllowedHeader("*"); // Permite todos los encabezados
        configuration.setAllowCredentials(true); // Habilita credenciales si es necesario

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}