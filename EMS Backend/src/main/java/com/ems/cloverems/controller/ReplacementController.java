package com.ems.cloverems.controller;

import com.ems.cloverems.model.Employee;
import com.ems.cloverems.model.NewRequirement;
import com.ems.cloverems.model.Replacement;
import com.ems.cloverems.service.ReplacementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/replacements")
public class ReplacementController {

    private final ReplacementService replacementService;

    @Autowired
    public ReplacementController(ReplacementService replacementService) {
        this.replacementService = replacementService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Replacement>> getAllReplacements() {
        List<Replacement> replacements = replacementService.findAllReplacements();
        return new ResponseEntity<>(replacements, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Replacement> getReplacementById(@PathVariable("id") Long id) {
        Replacement replacement = replacementService.findReplacementById(id);
        return new ResponseEntity<>(replacement, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Replacement> addReplacement(@RequestBody Replacement replacement) {
        Replacement newReplacement = replacementService.addReplacement(replacement);
        return new ResponseEntity<>(newReplacement, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Replacement> updateReplacement(@RequestBody Replacement replacement) {
        Replacement updatedReplacement = replacementService.updateReplacement(replacement);
        return new ResponseEntity<>(updatedReplacement, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReplacement(@PathVariable("id") Long id) {
        replacementService.deleteReplacement(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> uploadReplacement(@RequestBody List<Replacement> replacement) {
        try {
            List<Employee> savedReplacement = replacementService.saveAll(replacement);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employees uploaded successfully");
            response.put("count", savedReplacement.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error uploading employees");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

}
