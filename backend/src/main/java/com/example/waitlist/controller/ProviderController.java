package com.example.waitlist.controller;

import com.example.waitlist.model.ServiceProvider;
import com.example.waitlist.service.ProviderService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ProviderController {
  private final ProviderService providerService;

  public ProviderController(ProviderService providerService) {
    this.providerService = providerService;
  }

  @GetMapping
  public Map<String, Object> listProviders(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) String postcode,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) String vendorType,
      @RequestParam(required = false) String serviceOffering,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
  ) {
    System.out.println("*********** inside list poviders");
    List<ServiceProvider> filtered = providerService.getFiltered(
        search, postcode, status, startDate, endDate, vendorType, serviceOffering, sortBy, sortDir);

    int totalElements = filtered.size();
    int fromIndex = Math.max(0, page * size);
    int toIndex = Math.min(totalElements, fromIndex + size);
    System.out.println("*********** inside totalElements");
    List<ServiceProvider> content = fromIndex >= totalElements ? List.of() : filtered.subList(fromIndex, toIndex);
    int totalPages = (int) Math.ceil((double) totalElements / size);

    return Map.of(
        "content", content,
        "page", page,
        "size", size,
        "totalElements", totalElements,
        "totalPages", totalPages
    );
  }
}
