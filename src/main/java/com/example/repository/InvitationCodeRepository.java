package com.example.repository;

import com.example.model.InvitationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

/**
 * Created by Li on 2016/7/14.
 */
@Transactional
public interface InvitationCodeRepository extends JpaRepository<InvitationCode, Integer> {

    InvitationCode findByCode(String code);

    @Modifying
    @Query("update InvitationCode i set i.used = 1 where i.code = ?1")
    void useCode(String code);

    //@Query("select i from InvitationCode i where i.level = -1")
    Collection<InvitationCode> findByLevel(Integer level);

    @Modifying
    @Query("update InvitationCode i set i.level = ?2 where i.id = ?1")
    void setCode(Integer id, Integer level);
}
