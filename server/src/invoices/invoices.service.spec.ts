const mockInvoiceData = [
  { id: '1', vendor_name: 'AWS', amount: 123.45, due_date: new Date(), paid: false, userId: 'user-1' },
];

const mockPrisma = {
  invoice: {
    findMany: jest.fn().mockResolvedValue([
      { id: '1', vendor_name: 'AWS', amount: 123.45, due_date: new Date(), paid: false, userId: 'user-1' },
    ]),
    count: jest.fn().mockResolvedValue(1),
    findFirst: jest.fn().mockResolvedValue({
      id: '1',
      vendor_name: 'AWS',
      amount: 123.45,
      due_date: new Date(),
      paid: false,
      userId: 'user-1',
    }),
  },
  $transaction: jest.fn(async () => {
    const data = await mockPrisma.invoice.findMany();
    const count = await mockPrisma.invoice.count();
    return [data, count];
  }),
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesService],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated invoices for a user', async () => {
    const result = await service.findAll('user-1', 1, 10);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].vendor_name).toBe('AWS');
    expect(result.page).toBe(1);
    expect(result.total).toBe(1);
  });

  it('should return a single invoice by ID for a user', async () => {
    const result = await service.findOne('1', 'user-1');
    expect(result).toBeDefined();
    expect(result?.vendor_name).toBe('AWS');
  });

  it('should call findMany with correct pagination', async () => {
    await service.findAll('user-1', 2, 5);
    expect(mockPrisma.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
        skip: 5,
        take: 5,
        orderBy: { due_date: 'desc' },
      }),
    );
  });
});
