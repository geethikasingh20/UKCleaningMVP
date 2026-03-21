package com.example.waitlist.service;

import com.example.waitlist.model.ServiceProvider;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class ProviderService {
  private final List<ServiceProvider> providers = new ArrayList<>();

  public ProviderService() {
    seedData();
  }

  private void seedData() {
    String[] vendorTypes = {"Independent", "Company"};
    String[] offerings = {"Housekeeping", "Window Cleaning", "Car Valet"};
    String[] statuses = {"Onboarded", "Rejected"};
    String[] postcodes = {"SW1A 1AA", "E1 6AN", "M1 1AE", "B1 1AA", "LS1 4AP", "G1 1AA", "L1 8JQ"};

    for (int i = 1; i <= 60; i++) {
      String vendorType = vendorTypes[i % vendorTypes.length];
      String offering = offerings[i % offerings.length];
      String status = statuses[i % statuses.length];
      String postcode = postcodes[i % postcodes.length];
      LocalDate date = LocalDate.now().minusDays(i * 2L);

      providers.add(new ServiceProvider(
          (long) i,
          String.format("provider%02d@cleaning.co.uk", i),
          String.format("+44 7700 %04d", 1000 + i),
          postcode,
          vendorType,
          offering,
          date,
          status
      ));
    }
  }

  public List<ServiceProvider> getFiltered(
      String search,
      String postcode,
      String status,
      LocalDate startDate,
      LocalDate endDate,
      String vendorType,
      String serviceOffering,
      String sortBy,
      String sortDir) {

    String normalizedSearch = normalize(search);
    String normalizedPostcode = normalize(postcode);
    String normalizedStatus = normalize(status);
    String normalizedVendorType = normalize(vendorType);
    String normalizedOffering = normalize(serviceOffering);

    List<ServiceProvider> filtered = providers.stream()
        .filter(p -> matchesSearch(p, normalizedSearch))
        .filter(p -> matchesField(p.getPostcode(), normalizedPostcode))
        .filter(p -> matchesField(p.getStatus(), normalizedStatus))
        .filter(p -> matchesField(p.getVendorType(), normalizedVendorType))
        .filter(p -> matchesField(p.getServiceOffering(), normalizedOffering))
        .filter(p -> matchesDateRange(p.getSignupDate(), startDate, endDate))
        .collect(Collectors.toList());

    Comparator<ServiceProvider> comparator = getComparator(sortBy);
    if ("desc".equalsIgnoreCase(sortDir)) {
      comparator = comparator.reversed();
    }
    filtered.sort(comparator);

    return filtered;
  }

  private boolean matchesSearch(ServiceProvider p, String search) {
    if (search == null || search.isBlank()) {
      return true;
    }
    String combined = String.join(" ",
        safe(p.getEmail()),
        safe(p.getPhoneNumber()),
        safe(p.getPostcode()),
        safe(p.getVendorType()),
        safe(p.getServiceOffering()),
        safe(p.getStatus())
    ).toLowerCase(Locale.UK);
    return combined.contains(search.toLowerCase(Locale.UK));
  }

  private boolean matchesField(String value, String filter) {
    if (filter == null || filter.isBlank()) {
      return true;
    }
    return safe(value).toLowerCase(Locale.UK).contains(filter.toLowerCase(Locale.UK));
  }

  private boolean matchesDateRange(LocalDate date, LocalDate start, LocalDate end) {
    if (date == null) {
      return false;
    }
    boolean afterStart = start == null || !date.isBefore(start);
    boolean beforeEnd = end == null || !date.isAfter(end);
    return afterStart && beforeEnd;
  }

  private Comparator<ServiceProvider> getComparator(String sortBy) {
    if (sortBy == null) {
      return Comparator.comparing(ServiceProvider::getId);
    }
    return switch (sortBy) {
      case "email" -> Comparator.comparing(ServiceProvider::getEmail, Comparator.nullsLast(String::compareToIgnoreCase));
      case "phoneNumber" -> Comparator.comparing(ServiceProvider::getPhoneNumber, Comparator.nullsLast(String::compareToIgnoreCase));
      case "postcode" -> Comparator.comparing(ServiceProvider::getPostcode, Comparator.nullsLast(String::compareToIgnoreCase));
      case "vendorType" -> Comparator.comparing(ServiceProvider::getVendorType, Comparator.nullsLast(String::compareToIgnoreCase));
      case "serviceOffering" -> Comparator.comparing(ServiceProvider::getServiceOffering, Comparator.nullsLast(String::compareToIgnoreCase));
      case "signupDate" -> Comparator.comparing(ServiceProvider::getSignupDate, Comparator.nullsLast(LocalDate::compareTo));
      case "status" -> Comparator.comparing(ServiceProvider::getStatus, Comparator.nullsLast(String::compareToIgnoreCase));
      default -> Comparator.comparing(ServiceProvider::getId);
    };
  }

  private String normalize(String value) {
    return value == null ? null : value.trim();
  }

  private String safe(String value) {
    return Objects.requireNonNullElse(value, "");
  }
}
