# {{PROJECT_NAME}} — PRODUCT BIBLE

> The single source of truth for all product behaviour. Claude reads this before writing any code.
> If Claude's output contradicts this document — the output is wrong, not the Bible.
> Mark uncertain facts with ⚠️. Never leave gaps — write TBD with a decision deadline.

---

## 1. Product Overview

**What it is:** {{ONE_LINE_DESCRIPTION}}
**Who it's for:** {{TARGET_USER}}
**Core problem it solves:** {{CORE_PROBLEM}}
**What makes it different:** {{DIFFERENTIATOR}}

---

## 2. User Types & Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| {{ROLE_1}} | {{DESCRIPTION}} | {{PERMISSIONS}} |
| {{ROLE_2}} | {{DESCRIPTION}} | {{PERMISSIONS}} |

---

## 3. Core Domain Concepts

> Define every domain-specific term Claude needs to understand. Never assume shared knowledge.

| Term | Definition |
|------|-----------|
| {{TERM}} | {{DEFINITION}} |

---

## 4. Data Model

> Every table, every column, every relationship. If a column isn't here, it doesn't exist.

### {{TABLE_NAME}}

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default gen_random_uuid() | |
| created_at | timestamp | NOT NULL, default now() | |
| updated_at | timestamp | NOT NULL, default now() | |
| {{COLUMN}} | {{TYPE}} | {{CONSTRAINTS}} | {{DESCRIPTION}} |

---

## 5. Business Rules

> Every rule that governs product behaviour. These are non-negotiable. Claude must implement them exactly.

### {{RULE_GROUP}}

- **BR-01:** {{RULE_DESCRIPTION}}
- **BR-02:** {{RULE_DESCRIPTION}}

---

## 6. State Machines

> Every entity that has states. Every valid transition. Every guard condition.

### {{ENTITY}} States

```
{{STATE_A}} → {{STATE_B}} (trigger: {{EVENT}}, guard: {{CONDITION}})
{{STATE_B}} → {{STATE_C}} (trigger: {{EVENT}}, guard: {{CONDITION}})
```

Invalid transitions: {{LIST_INVALID}}

---

## 7. Edge Cases

> Every known edge case. Claude must handle these — not ignore them.

- **EC-01:** {{EDGE_CASE}} → {{EXPECTED_BEHAVIOUR}}
- **EC-02:** {{EDGE_CASE}} → {{EXPECTED_BEHAVIOUR}}

---

## 8. Error Messages

> Exact error messages. No paraphrasing. Copy-paste into code.

| Code | Message | When |
|------|---------|------|
| {{ERROR_CODE}} | `{{EXACT_MESSAGE}}` | {{CONDITION}} |

---

## 9. API Contracts

> Every API endpoint. Request shape, response shape, error codes.

### {{METHOD}} /api/{{ROUTE}}

**Auth:** {{AUTH_REQUIREMENT}}
**Request:**
```typescript
{
  {{FIELD}}: {{TYPE}} // {{DESCRIPTION}}
}
```
**Response (200):**
```typescript
{
  {{FIELD}}: {{TYPE}}
}
```
**Errors:** {{ERROR_CODES}}

---

## 10. Domain-Specific Rules

> Regulatory, compliance, or domain facts Claude cannot infer from general training.
> These override Claude's defaults.

- ⚠️ {{UNCERTAIN_FACT}} — verify before shipping
- **FACT:** {{VERIFIED_FACT}}

---

## 11. Integration Contracts

> Every external service. Auth method, base URL, rate limits, retry behaviour.

### {{SERVICE_NAME}}

- **Auth:** {{AUTH_METHOD}}
- **Base URL:** {{BASE_URL}}
- **Rate limit:** {{RATE_LIMIT}}
- **Retry:** {{RETRY_POLICY}}
- **Timeout:** {{TIMEOUT}}
- **Error handling:** {{ERROR_STRATEGY}}

---

## 12. Banned Patterns (product-level)

> Things that must never appear in this product, regardless of technical feasibility.

- NEVER: {{BANNED_PATTERN}}

---

*Last updated: {{DATE}}*
*Version: {{VERSION}}*
