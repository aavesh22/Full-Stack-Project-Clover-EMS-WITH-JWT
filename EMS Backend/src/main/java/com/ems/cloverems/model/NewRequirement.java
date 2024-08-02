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
@Table(name = "new_requirement")
public class NewRequirement implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)

    private Long id;
    private String salesPerson;
    private String deliveryHead;
    private String requirementRecordDate;
    private String customerName;
    private String opportunity;
    private String ltc;
    private String poReceived;
    private String experience;
    private String numberOfRequirements;
    private String perMonthValue;
    private String deliveryGroup;
    private String closed;
    private String location;

}