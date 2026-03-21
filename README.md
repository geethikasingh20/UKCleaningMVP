# Waitlist Dashboard (React + Spring Boot)

This project implements the Waitlist ? Service Providers page with sorting, filtering, selection, pagination, and a demo edit modal.

## Prerequisites
- Java 17+
- Maven 3+
- ReactJS
- Postgresql
- springboot
## Run Backend
```
cd \UKCleaningMVP\backend
mvn spring-boot:run
```
API runs at `http://localhost:8080/api/providers`.

Deployed at https://ukcleaningmvp.onrender.com/api/providers
This gives the data in JSON format

## Run Frontend
```
cd \UKCleaningMVP\frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.
Deployed at `https://ukcleaningmvp-fe.onrender.com/`
## Notes
- Pagination is set to 10 rows per page with 60 seed rows.
- Filters apply with the sidebar button and search is live with debounce.
- The edit action opens a demo modal and triggers a toast.
