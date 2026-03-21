# Waitlist Dashboard (React + Spring Boot)

This project implements the Waitlist ? Service Providers page with sorting, filtering, selection, pagination, and a demo edit modal.

## Prerequisites
- Node.js 18+
- Java 17+
- Maven 3+

## Run Backend
```
cd C:\geetika\zest\businessIdeas\UKCleaningMVP\backend
mvn spring-boot:run
```
API runs at `http://localhost:8080/api/providers`.

## Run Frontend
```
cd C:\geetika\zest\businessIdeas\UKCleaningMVP\frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

## Notes
- Pagination is set to 10 rows per page with 60 seed rows.
- Filters apply with the sidebar button and search is live with debounce.
- The edit action opens a demo modal and triggers a toast.
