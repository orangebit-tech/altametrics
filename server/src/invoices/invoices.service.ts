import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class InvoicesService {
  async findAll(
    userId: string,
    page = 1,
    limit = 10,
    sortBy: 'vendor_name' | 'amount' | 'due_date' | 'paid' = 'due_date',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await prisma.$transaction([
      prisma.invoice.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      prisma.invoice.count({ where: { userId } }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    return prisma.invoice.findFirst({
      where: { id, userId },
    });
  }
}
