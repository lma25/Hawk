package com.example.repository;

import com.example.model.Marker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

/**
 * Created by Li on 2016/6/20.
 */
@Transactional
public interface MarkerRepository extends JpaRepository<Marker, Integer> {
    Collection<Marker> findByUserNameAndTripIdOrderByRecordTimeDesc(String userName, String tripId);

    @Modifying
    @Query("update Marker m set m.recordFile = m.recordFile + 1 where m.userName = ?1 and m.tripId = ?2")
    int updateAfterInsert(String userName, String tripId);

    @Modifying
    @Query("delete from Marker m where m.recordFile = 11")
    int delete11();

    @Modifying
    @Query("delete from Marker m where m.userName = ?1")
    int deleteByUserName(String userName);
}
