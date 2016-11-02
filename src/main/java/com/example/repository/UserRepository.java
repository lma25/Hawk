package com.example.repository;

import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

/**
 * Created by Li on 2016/6/8.
 */

@Transactional
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserId(String userId);
    User findByUserName(String userName);
    User findByEmail(String email);

    /*@Query(value="select distinct trip_id from trips2 order by trip_id desc limit 10", nativeQuery = true)
    Collection<User> find10();*/
}
