package com.group09.commonsecurity.config;

import com.group09.commonsecurity.filter.CurrentUserHeaderFilter;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
public class CommonSecurityAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnClass(CurrentUserHeaderFilter.class)
    CurrentUserHeaderFilter currentUserHeaderFilter() {
        return new CurrentUserHeaderFilter();
    }
}
