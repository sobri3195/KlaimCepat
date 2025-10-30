import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const finance = await prisma.department.create({
    data: {
      name: 'Finance',
      code: 'FIN',
      description: 'Finance Department',
    },
  });

  const engineering = await prisma.department.create({
    data: {
      name: 'Engineering',
      code: 'ENG',
      description: 'Engineering Department',
    },
  });

  const sales = await prisma.department.create({
    data: {
      name: 'Sales',
      code: 'SALES',
      description: 'Sales Department',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@company.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      employeeId: 'EMP001',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      departmentId: finance.id,
      position: 'System Administrator',
    },
  });

  const cfo = await prisma.user.create({
    data: {
      email: 'cfo@company.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Smith',
      employeeId: 'EMP002',
      role: UserRole.CFO,
      status: UserStatus.ACTIVE,
      departmentId: finance.id,
      position: 'Chief Financial Officer',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@company.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      employeeId: 'EMP003',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      departmentId: engineering.id,
      position: 'Engineering Manager',
    },
  });

  const employee = await prisma.user.create({
    data: {
      email: 'employee@company.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Johnson',
      employeeId: 'EMP004',
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      departmentId: engineering.id,
      managerId: manager.id,
      position: 'Software Engineer',
    },
  });

  await prisma.companyPolicy.createMany({
    data: [
      {
        name: 'Daily Meal Allowance',
        category: 'MEAL',
        description: 'Maximum daily meal allowance for employees',
        rules: {
          maxAmount: 100000,
          currency: 'IDR',
          perDay: true,
        },
        isActive: true,
      },
      {
        name: 'Accommodation Policy',
        category: 'ACCOMMODATION',
        description: 'Hotel accommodation limits based on destination',
        rules: {
          domestic: {
            maxAmount: 1000000,
            currency: 'IDR',
          },
          international: {
            maxAmount: 2000000,
            currency: 'IDR',
          },
        },
        isActive: true,
      },
      {
        name: 'Transportation Policy',
        category: 'TRANSPORTATION',
        description: 'Transportation expense limits',
        rules: {
          taxi: {
            maxAmount: 200000,
            currency: 'IDR',
            perTrip: true,
          },
          flight: {
            requiresApproval: true,
            class: 'Economy',
          },
        },
        isActive: true,
      },
    ],
  });

  await prisma.approvalPolicy.create({
    data: {
      name: 'Standard Approval Flow',
      description: 'Standard approval workflow for all claims',
      departmentId: null,
      claimTypes: [],
      minAmount: 0,
      maxAmount: 1000000,
      approvalLevels: [
        {
          level: 1,
          approverRole: 'MANAGER',
          requiredCount: 1,
        },
      ],
      isActive: true,
      priority: 1,
    },
  });

  await prisma.approvalPolicy.create({
    data: {
      name: 'High Value Approval Flow',
      description: 'Approval workflow for high-value claims',
      departmentId: null,
      claimTypes: [],
      minAmount: 1000000,
      maxAmount: null,
      approvalLevels: [
        {
          level: 1,
          approverRole: 'MANAGER',
          requiredCount: 1,
        },
        {
          level: 2,
          approverRole: 'FINANCE',
          requiredCount: 1,
        },
        {
          level: 3,
          approverRole: 'CFO',
          requiredCount: 1,
        },
      ],
      isActive: true,
      priority: 2,
    },
  });

  const project = await prisma.project.create({
    data: {
      code: 'PROJ001',
      name: 'Digital Transformation Initiative',
      description: 'Company-wide digital transformation project',
      startDate: new Date('2024-01-01'),
      status: 'ACTIVE',
    },
  });

  await prisma.budget.create({
    data: {
      name: 'Q1 2024 Engineering Budget',
      description: 'Engineering department budget for Q1 2024',
      departmentId: engineering.id,
      fiscalYear: 2024,
      fiscalPeriod: 'Q1',
      totalAmount: 50000000,
      allocatedAmount: 30000000,
      spentAmount: 10000000,
      remainingAmount: 40000000,
      alertThreshold: 80,
      isActive: true,
    },
  });

  await prisma.exchangeRate.createMany({
    data: [
      {
        fromCurrency: 'USD',
        toCurrency: 'IDR',
        rate: 15750.50,
        effectiveDate: new Date(),
        source: 'BI',
      },
      {
        fromCurrency: 'SGD',
        toCurrency: 'IDR',
        rate: 11650.25,
        effectiveDate: new Date(),
        source: 'BI',
      },
      {
        fromCurrency: 'EUR',
        toCurrency: 'IDR',
        rate: 17250.75,
        effectiveDate: new Date(),
        source: 'BI',
      },
    ],
  });

  await prisma.vendorIntegration.createMany({
    data: [
      {
        name: 'Grab',
        type: 'RIDE_HAILING',
        isActive: true,
      },
      {
        name: 'Traveloka',
        type: 'TRAVEL',
        isActive: true,
      },
      {
        name: 'Tokopedia',
        type: 'ECOMMERCE',
        isActive: true,
      },
    ],
  });

  console.log('✅ Seed completed successfully');
  console.log('\nTest credentials:');
  console.log('Admin: admin@company.com / Admin123!');
  console.log('CFO: cfo@company.com / Admin123!');
  console.log('Manager: manager@company.com / Admin123!');
  console.log('Employee: employee@company.com / Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
