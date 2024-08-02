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
@Table(name = "replacement")
public class Replacement implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String replacementNeededBefore;
    private String billingRate;
    private String accountType;
    private String yetToJoin;
    private String location;
    private String deliveryGroup;
    private String type;
    private String techGroup;
    private String monthGroup;
    private String currentStatus;
}