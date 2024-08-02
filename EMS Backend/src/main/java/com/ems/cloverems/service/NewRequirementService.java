package com.ems.cloverems.service;

import com.ems.cloverems.model.Employee;
import com.ems.cloverems.model.NewRequirement;
import com.ems.cloverems.repository.NewRequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
@Transactional
public class NewRequirementService {
    private final NewRequirementRepository newRequirementRepository;

    @Autowired
    public NewRequirementService(NewRequirementRepository newRequirementRepository) {
        this.newRequirementRepository = newRequirementRepository;
    }

    public NewRequirement addNewRequirement(NewRequirement newRequirement) {
        return newRequirementRepository.save(newRequirement);
    }

    public List<NewRequirement> findAllNewRequirements() {
        return newRequirementRepository.findAll();
    }

    public NewRequirement updateNewRequirement(NewRequirement newRequirement) {
        return newRequirementRepository.save(newRequirement);
    }

    public NewRequirement findNewRequirementById(Long id) {
        return newRequirementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NewRequirement by id " + id + " was not found"));
    }

    public void deleteNewRequirement(Long id) {
        newRequirementRepository.deleteById(id);
    }

    public List<Employee> saveAll(List<NewRequirement> newRequirements) {
        newRequirementRepository.saveAll(newRequirements);
        return null;
    }
}
