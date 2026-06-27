# Contexts

Contains React Context providers for global state management.

## What goes here:
- React Context API providers
- Global state (auth, theme, user, etc.)
- Context consumers/hooks
- State reducers for complex state

## Examples:
- `AuthContext.tsx` - Authentication state
- `ThemeContext.tsx` - Theme/dark mode state
- `UserContext.tsx` - Current user state
- `NotificationContext.tsx` - App notifications

## Structure:
Each context should include:
- The context creation
- The provider component
- A custom hook to use the context (e.g., `useAuth`)
