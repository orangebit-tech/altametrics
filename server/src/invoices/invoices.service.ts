import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class InvoicesService {
  async findAll(userId: string) {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: { due_date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    return prisma.invoice.findFirst({
      where: { id, userId },
    });
  }
}
