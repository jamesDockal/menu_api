import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    await this.menu.upsert({
      where: { name: 'Diurno' },
      update: {},
      create: {
        name: 'Diurno',
      },
    });
    await this.menu.upsert({
      where: { name: 'Noturno' },
      update: {},
      create: {
        name: 'Noturno',
      },
    });
  }
}
