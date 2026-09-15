\*\*TEAM 4 — MERIDIAN STAYS\*\*

\*\*Owner Account — Backend Design Document\*\*

\## 1. Purpose

This document defines the backend design for the Team 4 Meridian Stays Owner Account module. It covers the REST API, backend service operations, PostgreSQL schema, data validation, security, testing, and integration boundaries.

\## 2. Source Requirements & Design Boundaries

Meridian Stays is a vacation rental and property management company operating 150+ owner-listed vacation rental units across multiple cities. The Team 4 brief identifies OwnerAccount, UnitListing, and CleaningTask as its vertical entities. OwnerAccount is described in terms of the owner profile, payout terms, and properties owned. PostgreSQL is utilized for transactional data.

\* \*\*OwnerAccount\*\*: Dedicated owner account resource.

\* \*\*Owner profile\*\*: Owner-facing profile section.

\* \*\*Payout terms\*\*: Store and manage payout-related terms.

\* \*\*Properties owned\*\*: Owner-to-UnitListing database relationship.

\* \*\*REST API\*\*: Exposes stable endpoints for external client communication.

\* \*\*PostgreSQL\*\*: Persists transactional OwnerAccount and ownership data.

\## 3. Owner Account User Story

As a Meridian Stays property owner, I want to manage my owner account information, payout terms, and associated rental properties, so that my profile and ownership information is maintained accurately and can be securely used by the Meridian Stays platform.

\*\*Backend Scope:\*\*

\* Retrieve and serve data through the REST API.

\* Validate all incoming request data in the backend layer.

\* Persist and update data securely in PostgreSQL.

\* Apply centralized authentication and authorization for all endpoints.

4\. Backend Architecture

API Layer: Expose stable \`/api/v1\` endpoints utilizing a common response envelope.

Router Layer\*\*: Manage authentication/authorization dependencies, request validation, and trigger service operations.

CRUD/Service Layer: Enforce owner business rules and execute database operations.

Model/ORM Layer: Map the OwnerAccount entity and ownership relationships to the database.

Database (PostgreSQL): Persist owner and unit ownership data safely.

\## 5. REST API Design

The following proposed Team 4 OwnerAccount endpoints must be agreed upon and frozen with the team before implementation.

\`GET /api/v1/owners/{owner_id}\`: Get owner profile, payout terms, and ownership summary.

\`PATCH /api/v1/owners/{owner_id}\`: Update permitted owner fields.

\`GET /api/v1/owners/{owner_id}/properties\`: Get properties/units associated with the specified owner.

Success Response Envelope Example:

json

{

"success": true,

"data": {

"id": "uuid",

"name": "Demo Owner",

"email": "<owner@example.com>",

"phone": "+91XXXXXXXXXX",

"payout_terms": "monthly",

"payout_percentage": 80.00,

"is_active": true,

"properties": \[\]

},

"message": null,

"meta": {"request_id": "uuid"}

}

Update Request Payload Example:

\`\`\`json

{

"name": "Updated Owner",

"phone": "+91XXXXXXXXXX",

"payout_terms": "monthly",

"payout_percentage": 80.00

}

\`\`\`

\## 6. API HTTP Contract

Use the common \`/api/v1\` prefix and a predictable response envelope.

\* \*\*200\*\*: Successful GET/PATCH request.

\* \*\*401\*\*: Missing or invalid authentication.

\* \*\*403\*\*: Authenticated but not permitted to access resource.

\* \*\*404\*\*: Owner not found.

\* \*\*409\*\*: Duplicate data or business rule conflict.

\* \*\*422\*\*: Validation error on incoming data.

\* \*\*500\*\*: Unexpected server error.

\## 7. Backend Project Structure

The backend implementation utilizes FastAPI and PostgreSQL, containerized via Docker for reliable deployment. The module integrates directly into the established flat \`app/\` directory architecture.

backend/

├── app/

│ ├── routers/

│ │ ├── \__init_\_.py

│ │ ├── availability.py

│ │ ├── folios.py

│ │ ├── guests.py

│ │ ├── reservations.py

│ │ └── owner_accounts.py <-- Proposed addition

│ ├── \__init_\_.py

│ ├── config.py

│ ├── crud.py <-- Owner business logic & DB operations

│ ├── database.py

│ ├── main.py

│ ├── models.py <-- OwnerAccount ORM mapping

│ ├── mongo.py

│ ├── schemas.py <-- Request/Response validation

│ └── seed.py

├── tests/

├── .dockerignore

├── Dockerfile

├── pyproject.toml

└── uv.lock

\`\`\`

\* \*\*Router (\`routers/owner_accounts.py\`)\*\*: Define routes, auth dependencies, and response schemas.

\* \*\*Schema (\`schemas.py\`)\*\*: Validate request and response fields.

\* \*\*CRUD (\`crud.py\`)\*\*: Owner lookup, update rules, and property retrieval.

\* \*\*Model (\`models.py\`)\*\*: ORM mapping.

\* \*\*Database (\`database.py\`)\*\*: Constraints, indexes, transactions, and persistence.

\* \*\*Tests (\`tests/\`)\*\*: OwnerAccount unit and API tests.

**8\. Database Design**

PostgreSQL serves as the transactional store. The Owner Account module must integrate seamlessly with the pre-existing core data model.

**8.1 Existing Core Data Model**

The system already defines the following core entities:

| **Entity**      | **Key fields**                                                       | **Notes**                                       |
| --------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| **Guest**       | id, name, email, phone, loyalty_tier, created_at                     | Core guest profile                              |
| **Property**    | id, name, brand, address, timezone                                   | A physical hotel / restaurant / unit / building |
| **Reservation** | id, guest_id, property_id, check_in, check_out, status, rate_plan_id | Core booking record                             |
| **RatePlan**    | id, property_id, name, nightly_rate, cancellation_policy             | Pricing rules                                   |
| **Folio**       | id, reservation_id, line_items\[\], balance, status                  | Guest bill / invoice                            |
| **Order**       | id, property_id, guest_id (nullable), items\[\], total, placed_at    | F&B order at an outlet                          |

**8.2 owner_accounts Table Extensions**

To support Team 4's requirements without duplicating the concept of a "unit" (which is handled by Property), we propose the following owner_accounts table:

| **Column**        | **Type**     | **Null?** | **Rule**                     |
| ----------------- | ------------ | --------- | ---------------------------- |
| id                | UUID         | NO        | PK                           |
| name              | VARCHAR(150) | NO        | Owner name                   |
| email             | VARCHAR(255) | NO        | Unique                       |
| phone             | VARCHAR(30)  | YES       | Validated phone              |
| payout_terms      | VARCHAR(100) | NO        | Agreed payout term/frequency |
| payout_percentage | NUMERIC(5,2) | YES       | 0–100 if percentage-based    |
| is_active         | BOOLEAN      | NO        | Default true                 |
| created_at        | TIMESTAMPTZ  | NO        | UTC                          |
| updated_at        | TIMESTAMPTZ  | NO        | UTC                          |

\* \`unit_listings.owner_id\` (UUID) serves as a Foreign Key mapping to \`owner_accounts.id\`.

\* An index must be placed on \`unit_listings.owner_id\` to optimize owner-property lookups.

\## 9. Naming Contract

\* \*\*DB tables\*\*: snake_case, plural (e.g., \`owner_accounts\`).

\* \*\*DB columns\*\*: snake_case (e.g., \`payout_percentage\`).

\* \*\*Python classes\*\*: PascalCase (e.g., \`OwnerAccount\`).

\* \*\*API paths\*\*: lowercase plural nouns (e.g., \`/api/v1/owners/{owner_id}\`).

\* \*\*JSON fields\*\*: snake_case (e.g., \`payout_terms\`).

\* \*\*IDs\*\*: UUID.

\* \*\*Foreign keys\*\*: \`&lt;entity&gt;\_id\` (e.g., \`owner_id\`).

\* \*\*Dates/times\*\*: UTC ISO 8601 (e.g., \`2026-09-10T10:30:00Z\`).

\## 10. Authentication & Authorization

\* The Owner Account module operates within the project's centralized role-based authentication design.

\* Owners should only read or update their own account data unless staff/admin access is explicitly authorized.

\* Apply role checks centrally within the backend routers.

\* Never trust a client-supplied \`owner_id\` as the only authorization check.

\* Do not log passwords, tokens, API keys, or unnecessary sensitive owner data.

\* Do not hard-code secrets in the source code.

\## 11. Backend Data Validation

\* \*\*name\*\*: Required; input normalized and length checked.

\* \*\*email\*\*: Required; confirmed valid format and checked for uniqueness.

\* \*\*phone\*\*: Optional; normalized and validated if provided.

\* \*\*payout_terms\*\*: Checked against internal business-rule validation.

\* \*\*payout_percentage\*\*: Confirmed numeric between 0–100.

\* \*\*is_active\*\*: Strict authorization required to change this state.

\## 12. Testing Requirements

\* \*\*Get owner\*\*: Ensure correct owner data is returned.

\* \*\*Get properties\*\*: Ensure only the specified owner's associated properties are returned.

\* \*\*Update profile\*\*: Ensure valid changes are safely persisted to the database.

\* \*\*Invalid email\*\*: Assert a 422 validation response.

\* \*\*Invalid payout percentage\*\*: Assert a 422 validation response.

\* \*\*Duplicate email\*\*: Assert a 409 Conflict/validation response.

\* \*\*Owner not found\*\*: Assert a 404 response.

\* \*\*Unauthorized access\*\*: Assert 401 or 403 responses.

\## 13. Integration with Other Modules

\* \*\*UnitListing\*\*: The Owner Account provides the ownership context for units.

\* \*\*Reservation\*\*: Reservation logic remains completely backend-owned. \*\*CleaningTask\*\*: Staff operations use cleaning tasks; OwnerAccount does not implement the cleaning workflow.

\* \*\*RAG Assistant\*\*: Guest-facing listing Q&A logic is separate from the OwnerAccount.

\## 14. Definition of Done

\* OwnerAccount schema and the ownership relationship are fully implemented.

\* REST endpoints utilize \`/api/v1\` and the agreed common response envelope.

\* The backend successfully validates and authorizes all OwnerAccount requests.

\* Unit, API, and integration tests pass successfully.

\* No secrets are hard-coded, and sensitive data is not unnecessarily logged.

\## 15. Developer Checklist

\* Confirm starter repository naming conventions before integrating new files.

\* Freeze OwnerAccount columns and API paths with Team 4.

\* Ensure all new ID fields use UUIDs, timestamps utilize UTC, and fields follow snake_case.

\* Implement centralized authorization for all new router endpoints.

\* Add database migrations and corresponding test coverage.

\* Ensure the \`Dockerfile\` and \`.dockerignore\` properly package the backend dependencies for isolated testing.

\* Run full backend and integration test suites before creating a merge request.