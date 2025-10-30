# Contributing to Expense Claims System

## Development Setup

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- Redis >= 6
- Docker & Docker Compose

### Initial Setup
```bash
npm install
docker-compose up -d
cd packages/database && npm run db:migrate && npm run db:seed
cd ../.. && npm run dev
```

## Project Architecture

### Monorepo Structure
- **apps/api** - Express REST API backend
- **apps/web** - React frontend application
- **packages/database** - Prisma schema and database client
- **packages/types** - Shared TypeScript types

### Technology Stack
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **OCR/AI**: Tesseract.js, OpenAI GPT-4
- **Authentication**: JWT with refresh tokens
- **Notifications**: Nodemailer, Twilio

## Code Style

### TypeScript
- Use strict TypeScript
- Define interfaces for all data structures
- Avoid `any` types
- Use async/await over callbacks

### Naming Conventions
- **Files**: kebab-case (e.g., `claim.service.ts`)
- **Classes**: PascalCase (e.g., `ClaimService`)
- **Functions**: camelCase (e.g., `createClaim`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### Code Formatting
```bash
npm run format
```

## Adding New Features

### Backend Service
1. Create service in `apps/api/src/services/`
2. Create controller in `apps/api/src/controllers/`
3. Add routes in `apps/api/src/routes/`
4. Add types in `packages/types/src/`

Example:
```typescript
// services/feature.service.ts
export class FeatureService {
  async getFeature(id: string): Promise<Feature> {
    return await prisma.feature.findUnique({ where: { id } });
  }
}

// controllers/feature.controller.ts
export class FeatureController {
  async getFeature(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const feature = await featureService.getFeature(id);
    res.json(feature);
  }
}

// routes/index.ts
router.get('/features/:id', featureController.getFeature.bind(featureController));
```

### Frontend Component
1. Create component in `apps/web/src/components/`
2. Create page in `apps/web/src/pages/`
3. Add route in `apps/web/src/App.tsx`

Example:
```typescript
// components/FeatureCard.tsx
export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="p-4 border rounded">
      <h3>{feature.name}</h3>
      <p>{feature.description}</p>
    </div>
  );
}

// pages/Features.tsx
export default function Features() {
  const [features, setFeatures] = useState<Feature[]>([]);
  
  useEffect(() => {
    loadFeatures();
  }, []);
  
  return (
    <div>
      {features.map(f => <FeatureCard key={f.id} feature={f} />)}
    </div>
  );
}
```

### Database Schema Changes
1. Update `packages/database/prisma/schema.prisma`
2. Run migration:
```bash
cd packages/database
npx prisma migrate dev --name add_feature
npm run db:generate
```

## Testing

### Unit Tests
```bash
npm run test
```

### API Testing
```bash
curl http://localhost:3001/api/v1/claims/my \
  -H "Authorization: Bearer $TOKEN"
```

### Manual Testing
1. Start services: `npm run dev`
2. Login: http://localhost:3000
3. Test feature workflow

## Pull Request Process

1. Create feature branch from `main`
```bash
git checkout -b feature/awesome-feature
```

2. Make changes and commit
```bash
git add .
git commit -m "feat: add awesome feature"
```

3. Push and create PR
```bash
git push origin feature/awesome-feature
```

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

Example:
```
feat(claims): add OCR receipt processing

Implement automatic data extraction from receipts using
Tesseract.js and OpenAI GPT-4 Vision API.

Closes #123
```

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Types properly defined
- [ ] Security considerations addressed
- [ ] Performance optimized

## Common Issues

### Database Connection
```bash
docker-compose restart postgres
```

### Port Conflicts
```bash
lsof -ti:3001 | xargs kill -9
```

### Cache Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Express Docs](https://expressjs.com)

## License

Proprietary - All rights reserved
