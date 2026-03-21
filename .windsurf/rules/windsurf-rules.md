# Playwright Automation Suite - Development Rules

## 🔄 Project Awareness & Context

Always read PLANNING.md at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
Check TASK.md before starting a new task. If the task isn't listed, add it with a brief description and today's date.
Use consistent naming conventions, file structure, and architecture patterns as described in PLANNING.md.

## 🧱 Code Structure & Modularity

Never create a file longer than 500 lines of code. If a file approaches this limit, refactor by splitting it into smaller classes, helpers, components.

### Follow separation of concerns

- **API** → `src/api`
- **UI Pages** → `src/pages`
- **Reusable UI** → `src/components`
- **Setup logic** → `src/fixtures`
- **Helpers** → `src/utils`

### No mixing responsibilities

❌ API calls inside pages  
❌ UI locators inside tests  
❌ Business logic inside components

## 🧪 Testing & Reliability

All tests must be written using Playwright Test

Each test should:

- Use fixtures for setup
- Use page objects (no raw locators)
- Be independent

For each new feature/test:
Cover:

- happy path
- edge case (if applicable)
- failure/validation case (if applicable)

Test location: `tests/widget/`  
Naming: `OAC-20001_BookAppointment.spec.ts`

## ✅ Task Completion

Mark completed tasks in TASK.md immediately after finishing them.
Add new sub-tasks or TODOs discovered during development to TASK.md under a "Discovered During Work" section.

## 📎 Style & Conventions

**Language:** TypeScript

Follow best practices:

- Strong typing
- Async/await (no .then() chains)
- Clean, readable methods

Use Page Object Model (POM) for all UI interactions.

Write JSDoc for every function and class using the following style:

```typescript
/**
 * Brief summary of the method.
 * @param param1 - Description of the parameter.
 * @returns Description of the return value.
 */
async function example(param1: string): Promise<void> {}
```

### Naming Conventions

- Pages → `ServicePage.ts`
- Components → `CalendarComponent.ts`
- API Clients → `ProvisioningClient.ts`
- Fixtures → `bookingFixture.ts`
- Tests → `OAC-20001_BookAppointment.spec.ts`

### Code Style Rules

- Use small, reusable methods
- Prefer explicit method names:
  - `selectService()`
  - `fillDetails()`
  - `selectAvailableSlot()`

## 📚 Documentation & Explainability

Update README.md when:

- New APIs added
- New fixtures introduced
- Setup changes
- Dependencies change

Add comments for:

- Complex selectors
- Dynamic waits
- API dependencies

When writing complex logic (like custom Playwright fixtures), add an inline `// Reason:` comment explaining the why, not just the what.

## Framework Design Rules (CRITICAL)

Always follow:

```
Test → Fixture → Page → Component → UI

Fixture → API
```

### Strict Rules

❌ No locators in tests  
❌ No API calls in tests  
❌ No hardcoded data  
✅ Use fixtures for setup  
✅ Use components for reusable UI  
✅ Keep pages thin

## ⚙️ API Usage Rules

All API calls must go through: `src/api/*Client.ts`

Do NOT:

- Call APIs directly in tests
- Duplicate API logic

## 🧩 Selector Strategy

Prefer:

- Role-based selectors
- Text-based selectors

Avoid:

- Brittle CSS chains
- Index-based selectors

## 🔁 Reusability Rules

If logic repeats twice → move to:

- Component OR utility

If UI repeats → component  
If data logic repeats → utils  
If setup repeats → fixture

## 🚫 Anti-Patterns to Avoid

- Writing large test files
- Duplicating flows across tests
- Hardcoding test data
- Mixing API + UI logic in same place

## 🧠 AI Behavior Rules

Do NOT assume UI structure → ask if unclear  
Do NOT invent APIs → use provided API table

Confirm:

- File paths
- Method names
- Data contracts

Do NOT:

- Delete existing working code
- Refactor without reason

Always align with:

- PLANNING.md
- TASK.md

## 🏁 Goal of This Setup

- Scalable test suite
- Reusable components
- API-driven setup
- Stable, maintainable automation
