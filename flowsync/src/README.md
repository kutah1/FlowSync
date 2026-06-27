# Source Code Structure

This is the main source directory for the FlowSync application. Below is an overview of the folder structure and what each folder contains.

## 📁 Folder Organization

| Folder | Purpose |
|--------|---------|
| **components/** | Reusable UI components |
| **pages/** | Page-level components/routes |
| **hooks/** | Custom React hooks |
| **services/** | API calls and business logic |
| **utils/** | Helper and utility functions |
| **constants/** | Application-wide constants |
| **types/** | TypeScript type definitions |
| **contexts/** | React Context providers |
| **styles/** | Global styles and theme |
| **assets/** | Static files (images, fonts, etc.) |

## 🎯 Guidelines

### Naming Conventions
- **Components**: PascalCase (e.g., `Button.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useFetch.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### Component Organization
Keep components modular and focused:
```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.module.css
│   └── index.ts
└── Modal/
    ├── Modal.tsx
    ├── Modal.module.css
    └── index.ts
```

### Dependency Direction
Follow this hierarchy to avoid circular dependencies:
```
pages → components → hooks, utils, types
     → services → types, utils
     → contexts → types
```

Each folder has its own README with more details. Click into any folder to learn more!
