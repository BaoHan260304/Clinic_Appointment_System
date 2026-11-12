package com.group05.commonsecurity.filter;

import com.group05.commonsecurity.currentuser.CurrentUser;
import com.group05.commonsecurity.currentuser.CurrentUserHolder;
import com.group05.commonsecurity.header.SecurityHeaders;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CurrentUserHeaderFilterTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    private FilterChain filterChain;

    @AfterEach
    void tearDown() {
        CurrentUserHolder.clear();
    }

    @Test
    void setsCurrentUserFromHeadersAndClearsAfterChain() throws ServletException, IOException {
        CurrentUserHeaderFilter filter = new CurrentUserHeaderFilter();
        UUID userId = UUID.randomUUID();
        when(request.getHeader(SecurityHeaders.USER_ID)).thenReturn(userId.toString());
        when(request.getHeader(SecurityHeaders.USER_EMAIL)).thenReturn("nam.patient@example.com");
        when(request.getHeader(SecurityHeaders.USER_ROLES)).thenReturn("PATIENT, ADMIN");

        AtomicReference<CurrentUser> capturedUser = new AtomicReference<>();
        filterChain = (req, res) -> capturedUser.set(CurrentUserHolder.get().orElse(null));

        filter.doFilter(request, response, filterChain);

        assertThat(capturedUser.get()).isNotNull();
        assertThat(capturedUser.get().userId()).isEqualTo(userId);
        assertThat(capturedUser.get().email()).isEqualTo("nam.patient@example.com");
        assertThat(capturedUser.get().roles()).containsExactly("PATIENT", "ADMIN");

        // After filter execution, context must be cleared to prevent thread leak
        assertThat(CurrentUserHolder.get()).isEmpty();
    }

    @Test
    void proceedsWhenNoUserIdHeaderPresent() throws ServletException, IOException {
        CurrentUserHeaderFilter filter = new CurrentUserHeaderFilter();
        when(request.getHeader(SecurityHeaders.USER_ID)).thenReturn(null);

        AtomicReference<CurrentUser> capturedUser = new AtomicReference<>();
        filterChain = (req, res) -> capturedUser.set(CurrentUserHolder.get().orElse(null));

        filter.doFilter(request, response, filterChain);

        assertThat(capturedUser.get()).isNull();
        assertThat(CurrentUserHolder.get()).isEmpty();
    }
}
