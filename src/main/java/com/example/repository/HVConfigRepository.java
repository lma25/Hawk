package com.example.repository;

import com.example.model.HVConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

/**
 * Created by Li on 2016/9/20.
 */

@Transactional
public interface HVConfigRepository extends JpaRepository<HVConfig, Integer> {

    Collection<HVConfig> findByUserNameAndLocation(String userName, int location);
    Collection<HVConfig> findByUserName(String userName);

    @Modifying
    @Query("update HVConfig c set c.src = ?3 where c.userName = ?1 and c.location = ?2")
    int updateConfig(String userName, int location, String src);


}
