package com.nnson128.userservice.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        log.info("=== REQUEST DEBUG ===");
        log.info("Path: {}", request.getRequestURI());
        log.info("Method: {}", request.getMethod());
        log.info("Authorization Header: {}", authHeader);
        log.info("=== END DEBUG ===");
        
        filterChain.doFilter(request, response);
    }
}
