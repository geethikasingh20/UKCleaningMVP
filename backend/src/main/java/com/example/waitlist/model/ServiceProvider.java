package com.example.waitlist.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "service_providers")
public class ServiceProvider {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String phoneNumber;

  @Column(nullable = false)
  private String postcode;

  @Column(nullable = false)
  private String vendorType;

  @Column(nullable = false)
  private String serviceOffering;

  @Column(nullable = false)
  private LocalDate signupDate;

  @Column(nullable = false)
  private String status;

  public ServiceProvider() {}

  public ServiceProvider(Long id, String email, String phoneNumber, String postcode,
      String vendorType, String serviceOffering, LocalDate signupDate, String status) {
    this.id = id;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.postcode = postcode;
    this.vendorType = vendorType;
    this.serviceOffering = serviceOffering;
    this.signupDate = signupDate;
    this.status = status;
  }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPhoneNumber() { return phoneNumber; }
  public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
  public String getPostcode() { return postcode; }
  public void setPostcode(String postcode) { this.postcode = postcode; }
  public String getVendorType() { return vendorType; }
  public void setVendorType(String vendorType) { this.vendorType = vendorType; }
  public String getServiceOffering() { return serviceOffering; }
  public void setServiceOffering(String serviceOffering) { this.serviceOffering = serviceOffering; }
  public LocalDate getSignupDate() { return signupDate; }
  public void setSignupDate(LocalDate signupDate) { this.signupDate = signupDate; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
}
