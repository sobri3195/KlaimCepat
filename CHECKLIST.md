# 🚀 Setup & Configuration Checklist

## Initial Setup

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed (or Docker)
- [ ] Redis 6+ installed (or Docker)
- [ ] Git installed

### Installation
- [ ] Clone repository
- [ ] Run `npm install` in root directory
- [ ] Start Docker services: `docker-compose up -d`
- [ ] Navigate to database package: `cd packages/database`
- [ ] Generate Prisma client: `npm run db:generate`
- [ ] Run migrations: `npm run db:migrate`
- [ ] Seed database: `npm run db:seed`
- [ ] Return to root: `cd ../..`

### Configuration

#### API Environment (`apps/api/.env`)
- [ ] Set `DATABASE_URL` (default works with Docker)
- [ ] Set `JWT_SECRET` (change in production)
- [ ] Set `JWT_REFRESH_SECRET` (change in production)
- [ ] Configure `OPENAI_API_KEY` for OCR features
- [ ] Configure email settings (SMTP_HOST, SMTP_USER, etc.)
- [ ] Configure Twilio for WhatsApp (optional)
- [ ] Set `CORS_ORIGIN` to frontend URL

#### Optional Integrations
- [ ] AWS S3 for file storage
- [ ] Twilio for WhatsApp notifications
- [ ] Bank Indonesia API for exchange rates

## Testing

### Basic Functionality
- [ ] Start dev servers: `npm run dev`
- [ ] Access web app: http://localhost:3000
- [ ] Login with test account: `employee@company.com` / `Admin123!`
- [ ] Create a new claim
- [ ] Add expense items
- [ ] Submit claim for approval
- [ ] Login as manager: `manager@company.com` / `Admin123!`
- [ ] Approve/reject claim
- [ ] Check analytics dashboard

### OCR Testing
- [ ] Upload a receipt image
- [ ] Verify OCR extracts: date, amount, vendor
- [ ] Check confidence score
- [ ] Verify auto-filled data

### Policy Testing
- [ ] Create claim exceeding daily limit
- [ ] Verify policy violation is detected
- [ ] Check violation message
- [ ] Test with missing receipt

### Approval Workflow
- [ ] Submit claim as employee
- [ ] Verify notification sent
- [ ] Check approval appears in manager's queue
- [ ] Test approval action
- [ ] Test rejection with comments
- [ ] Verify status updates

### Budget Control
- [ ] View budget status
- [ ] Check utilization percentage
- [ ] Verify alert at 80% threshold
- [ ] Test over-budget detection

## Production Deployment

### Pre-deployment
- [ ] Run tests: `npm run test`
- [ ] Build packages: `npm run build`
- [ ] Check for TypeScript errors
- [ ] Review security settings
- [ ] Update environment variables
- [ ] Set strong JWT secrets
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates

### Database
- [ ] Backup current data (if migrating)
- [ ] Run production migrations
- [ ] Verify data integrity
- [ ] Set up automated backups
- [ ] Configure connection pooling

### Security
- [ ] Change all default passwords
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Review API permissions
- [ ] Run security audit: `npm audit`

### Monitoring
- [ ] Set up error logging
- [ ] Configure performance monitoring
- [ ] Set up health check endpoints
- [ ] Configure alerting
- [ ] Set up log rotation

### Post-deployment
- [ ] Test all endpoints
- [ ] Verify user workflows
- [ ] Check email notifications
- [ ] Test file uploads
- [ ] Monitor performance
- [ ] Review logs for errors

## Feature Configuration

### Company Policies
- [ ] Review default policies in seed data
- [ ] Update meal allowance limits
- [ ] Configure accommodation limits
- [ ] Set transportation policies
- [ ] Define approval thresholds

### Approval Policies
- [ ] Configure approval levels
- [ ] Set amount-based routing
- [ ] Define department-specific flows
- [ ] Assign approvers by role

### Notifications
- [ ] Test email delivery
- [ ] Configure email templates
- [ ] Test WhatsApp notifications
- [ ] Set notification preferences

### Budget Setup
- [ ] Create department budgets
- [ ] Set fiscal periods
- [ ] Configure alert thresholds
- [ ] Assign budget owners

### Users & Departments
- [ ] Create departments
- [ ] Add users
- [ ] Assign roles
- [ ] Set reporting structure

## Maintenance

### Regular Tasks
- [ ] Review and approve pending claims
- [ ] Monitor budget utilization
- [ ] Check policy violations
- [ ] Review audit logs
- [ ] Update exchange rates

### Weekly Tasks
- [ ] Review analytics dashboard
- [ ] Check system performance
- [ ] Verify backup success
- [ ] Review error logs

### Monthly Tasks
- [ ] Generate payroll batches
- [ ] Export claim reports
- [ ] Review policy effectiveness
- [ ] Update budget allocations
- [ ] User access review

### Quarterly Tasks
- [ ] Review and update policies
- [ ] Analyze spending patterns
- [ ] Update approval workflows
- [ ] Security audit
- [ ] Performance optimization

## Troubleshooting

### Common Issues
- [ ] Database connection errors → Check Docker/PostgreSQL
- [ ] Port conflicts → Kill processes on ports 3000/3001
- [ ] Build failures → Clear cache and reinstall
- [ ] OCR not working → Verify OpenAI API key
- [ ] Email not sending → Check SMTP settings
- [ ] Login issues → Verify JWT secrets

### Debug Steps
1. [ ] Check API logs
2. [ ] Check browser console
3. [ ] Verify database connection
4. [ ] Test API endpoints directly
5. [ ] Review environment variables
6. [ ] Check Docker container status

## Documentation

### Available Docs
- [ ] README.md - Project overview
- [ ] QUICKSTART.md - Quick start guide
- [ ] FEATURES.md - Feature documentation
- [ ] API.md - API reference
- [ ] DEPLOYMENT.md - Deployment guide
- [ ] CONTRIBUTING.md - Development guide
- [ ] IMPLEMENTATION_SUMMARY.md - Complete summary

### Training Materials
- [ ] Create user training guide
- [ ] Document approval workflows
- [ ] Create policy reference
- [ ] Write FAQ document

## Support

### Before Asking for Help
- [ ] Check documentation
- [ ] Review troubleshooting section
- [ ] Check error logs
- [ ] Search existing issues
- [ ] Test in clean environment

### When Reporting Issues
- [ ] Include error messages
- [ ] Describe steps to reproduce
- [ ] Provide environment details
- [ ] Include relevant logs
- [ ] Screenshot if UI issue

---

## Status

Mark completion date for each section:

- [ ] Initial Setup - Date: ___________
- [ ] Testing Complete - Date: ___________
- [ ] Production Deployment - Date: ___________
- [ ] Team Training - Date: ___________
- [ ] Go Live - Date: ___________

**Project Manager:** ___________________  
**Technical Lead:** ___________________  
**Date:** ___________________

---

**Pro Tip:** Print this checklist and mark items as you complete them!
