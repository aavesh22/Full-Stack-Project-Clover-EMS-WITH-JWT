package com.ems.cloverems.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "employee")
public class Employee implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)

    private Long id;
    private String employeeCode;
    private String employeeName;
    private String cloverDoj;
    private String qualification;
    private String technology;
    private String lateralHireOrAcademy;
    private String experience;
    private String location;
}