# Security Specification for Illusion Rack Designer

## 1. Data Invariants
- A user document can only be read or written by the authenticated owner of that user ID (`request.auth.uid == userId`).
- A rack project document under `/users/{userId}/projects/{projectId}` can only be created, read, updated, or deleted by the authenticated user matching `userId`.
- Project records must strictly associate `userId` with `request.auth.uid`.
- No unauthenticated or cross-tenant user can read or overwrite another user's saved racks.

## 2. The Dirty Dozen Attack Payloads & Mitigation Plan
1. **Unauthenticated Read:** Anonymous or unauthenticated request to `/users/{userId}/projects/{projectId}` -> Denied (Requires `request.auth != null`).
2. **Cross-User Project Snooping:** User A attempts to read `/users/userB/projects/{projId}` -> Denied (`request.auth.uid == userId` check fails).
3. **Cross-User Project Creation:** User A attempts to write a project inside `/users/userB/projects/{projId}` -> Denied (`request.auth.uid == userId` check fails).
4. **Document ID Poisoning / Oversized ID:** Request with invalid characters or >128 chars in `userId` or `projectId` -> Denied by `isValidId()`.
5. **Payload Bloating (Denial of Wallet):** Attempting to store strings > 100,000 characters in element structure -> Denied by `isValidRackProject()`.
6. **Owner Spoofing on Update:** User A attempting to change `userId` inside their project document -> Denied by immutability check `incoming().userId == existing().userId`.
7. **Malformed Entity Fields:** Writing invalid data types (e.g. number for `nombre` or array for `userId`) -> Denied by `isValidRackProject()`.
8. **Catch-All Default Deny:** Accessing any unspecified collection -> Denied by global catch-all `match /{document=**} { allow read, write: if false; }`.
9. **Blanket Query Scraping:** Attempting to query all projects across users without scoping to authenticated user path -> Denied by path-based security.
10. **Null Pointer on Delete:** Checking `request.resource` in delete rule -> Prevented by isolating delete check to `request.auth.uid == userId`.
11. **Profile Escalation:** User modifying system flags -> Schema strictly limits allowed fields.
12. **Shadow Field Injection:** Adding arbitrary unauthorized keys -> Checked by schema validation.
