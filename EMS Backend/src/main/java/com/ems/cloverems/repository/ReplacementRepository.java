package com.ems.cloverems.repository;

import com.ems.cloverems.model.Replacement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReplacementRepository extends JpaRepository<Replacement, Long> {
    void deleteReplacementById(Long id);
    Optional<Replacement> findReplacementById(Long id);
}
