package com.ems.cloverems.controller;

import com.ems.cloverems.model.Employee;
import com.ems.cloverems.model.NewRequirement;
import com.ems.cloverems.service.NewRequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/new-requirements")
public class NewRequirementController {

    private final NewRequirementService newRequirementService;

    @Autowired
    public NewRequirementController(NewRequirementService newRequirementService) {
        this.newRequirementService = newRequirementService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<NewRequirement>> getAllNewRequirements() {
        List<NewRequirement> newRequirements = newRequirementService.findAllNewRequirements();
        return new ResponseEntity<>(newRequirements, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<NewRequirement> getNewRequirementById(@PathVariable("id") Long id) {
        NewRequirement newRequirement = newRequirementService.findNewRequirementById(id);
        return new ResponseEntity<>(newRequirement, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<NewRequirement> addNewRequirement(@RequestBody NewRequirement newRequirement) {
        NewRequirement savedNewRequirement = newRequirementService.addNewRequirement(newRequirement);
        return new ResponseEntity<>(savedNewRequirement, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<NewRequirement> updateNewRequirement(@RequestBody NewRequirement newRequirement) {
        NewRequirement updatedNewRequirement = newRequirementService.updateNewRequirement(newRequirement);
        return new ResponseEntity<>(updatedNewRequirement, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNewRequirement(@PathVariable("id") Long id) {
        newRequirementService.deleteNewRequirement(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> uploadNewRequirements(@RequestBody List<NewRequirement> newRequirements) {
        try {
            List<Employee> savedNewRequirements = newRequirementService.saveAll(newRequirements);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employees uploaded successfully");
            response.put("count", savedNewRequirements.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error uploading employees");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
