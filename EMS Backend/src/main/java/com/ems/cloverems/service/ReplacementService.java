package com.ems.cloverems.service;

import com.ems.cloverems.exception.UserNotFoundException;
import com.ems.cloverems.model.Employee;
import com.ems.cloverems.model.Replacement;
import com.ems.cloverems.repository.ReplacementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
@Transactional
public class ReplacementService {

    private final ReplacementRepository replacementRepository;

    @Autowired
    public ReplacementService(ReplacementRepository replacementRepository) {
        this.replacementRepository = replacementRepository;
    }

    public Replacement addReplacement(Replacement replacement) {
        return replacementRepository.save(replacement);
    }

    public List<Replacement> findAllReplacements() {
        return replacementRepository.findAll();
    }

    public Replacement updateReplacement(Replacement replacement) {
        return replacementRepository.save(replacement);
    }

    public Replacement findReplacementById(Long id) {
        return replacementRepository.findReplacementById(id)
                .orElseThrow(() -> new UserNotFoundException("Replacement by id " + id + " was not found"));
    }

    public void deleteReplacement(Long id) {
        replacementRepository.deleteReplacementById(id);
    }

    public List<Employee> saveAll(List<Replacement> replacement) {
        replacementRepository.saveAll(replacement);
        return null;
    }
}
