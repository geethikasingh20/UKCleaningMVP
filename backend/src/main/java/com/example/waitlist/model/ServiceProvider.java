package com.example.waitlist.model;

import java.time.LocalDate;

public class ServiceProvider {
  private Long id;
  private String email;
  private String phoneNumber;
  private String postcode;
  private String vendorType;
  private String serviceOffering;
  private LocalDate signupDate;
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
