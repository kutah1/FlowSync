# Services

Contains API calls, external service integrations, and business logic services.

## What goes here:
- API client instances and functions
- External service integrations (auth, payments, etc.)
- Business logic that's not tied to components
- Data fetching and manipulation logic

## Examples:
- `api.ts` - Main API client configuration
- `authService.ts` - Authentication-related API calls
- `userService.ts` - User-related API calls
- `taskService.ts` - Task/resource API calls
- `storageService.ts` - Local storage or database operations

## Note:
Services should be pure functions that can be tested independently.
