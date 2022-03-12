# Customer Service

The `Customer Service` implements a REST API for managing customers.
The service persists the `Customer` entity in a MySQL database.
It publishes `Customer` domain events that are consumed by the `Order Service`.
