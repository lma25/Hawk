package com.example.repository;

import com.example.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Date;

/**
 * Created by Li on 2016/6/10.
 */

@Transactional
public interface TripRepository extends JpaRepository<Trip, Integer> {
    Collection<Trip> findByUserName(String userName);
    Collection<Trip> findByUserNameAndTripId(String userName, String tripId);
    void deleteByUserName(String userName);

    @Query(value="select *, abs(timediff(?3, record_time)) as distance from trips2 where user_name = ?1 and trip_id = ?2 order by distance asc limit 1", nativeQuery = true)
    Collection<Trip> findByTime(String userName, String tripId, Date time);

    @Query(value="select distinct trip_id from trips2 where user_name = ?1 order by trip_id desc limit 1", nativeQuery = true)
    String findMostRecentTripId(String userName);

    @Query(value="select distinct trip_id from trips2 where user_name = ?1 order by trip_id desc limit 5", nativeQuery = true)
    Collection<String> find5MostRecentTripId(String userName);

    @Query(value="select user_name from (select user_name, max(trip_id) from trips2 group by user_name limit 15) as t1", nativeQuery = true)
    Collection<String> find15MostActivityUserName();

}
