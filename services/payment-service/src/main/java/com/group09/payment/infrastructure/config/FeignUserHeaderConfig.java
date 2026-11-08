package com.group09.payment.infrastructure.config;

import com.group09.commonsecurity.currentuser.CurrentUser;
import com.group09.commonsecurity.currentuser.CurrentUserHolder;
import com.group09.commonsecurity.header.SecurityHeaders;
import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignUserHeaderConfig {

    @Bean
    RequestInterceptor currentUserForwardingInterceptor() {
        return template -> CurrentUserHolder.get().ifPresent(currentUser -> {
            template.header(SecurityHeaders.USER_ID, currentUser.userId().toString());
            template.header(SecurityHeaders.USER_EMAIL, currentUser.email() == null ? "" : currentUser.email());
            template.header(SecurityHeaders.USER_ROLES, roles(currentUser));
        });
    }

    private String roles(CurrentUser currentUser) {
        return currentUser.roles() == null
                ? ""
                : String.join(",", currentUser.roles());
    }
}
