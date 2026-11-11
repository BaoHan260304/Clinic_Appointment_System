package com.group05.user.domain.repository;

import com.group05.user.domain.aggregate.Role;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RoleRepository {
    Optional<Role> findByName(String name);
    List<Role> findByNames(Collection<String> names);
}
