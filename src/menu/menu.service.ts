import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    const alredyRegsitered = await this.prisma.menu.findFirst({
      where: {
        name: createMenuDto.name,
      },
    });
    if (alredyRegsitered) {
      throw new ConflictException('Menu alredy registered!');
    }

    return await this.prisma.menu.create({
      data: createMenuDto,
    });
  }
}
