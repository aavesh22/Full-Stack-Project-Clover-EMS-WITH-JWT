package com.ems.cloverems.repository;

import com.ems.cloverems.model.NewRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewRequirementRepository extends JpaRepository<NewRequirement, Long> {

}
