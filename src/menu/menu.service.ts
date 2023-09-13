import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/services/prisma.service';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const menu = await this.prisma.menu.findFirst({
      where: { id },
    });
    if (!menu) {
      throw new NotFoundException(`Menu '${id}' was not found!`);
    }

    return menu;
  }

  private async getMenu(dto: Partial<Menu>) {
    return await this.prisma.menu.findFirst({
      where: dto,
    });
  }

  async create(createMenuDto: CreateMenuDto) {
    const alredyRegsitered = await this.getMenu({ name: createMenuDto.name });
    if (alredyRegsitered) {
      throw new ConflictException('Menu alredy registered!');
    }

    return await this.prisma.menu.create({
      data: createMenuDto,
    });
  }

  async getAll() {
    return await this.prisma.menu.findMany({
      include: {
        products: true,
      },
    });
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const isRegistered = await this.getMenu({ id: parseInt(id) });
    if (!isRegistered) {
      throw new NotFoundException(`Menu '${id}' was not found!`);
    }

    return await this.prisma.menu.update({
      where: {
        id: parseInt(id),
      },
      data: updateMenuDto,
    });
  }

  async delete(id: string) {
    const isRegistered = await this.getMenu({ id: parseInt(id) });
    if (!isRegistered) {
      throw new NotFoundException(`Menu '${id}' was not found!`);
    }

    return await this.prisma.menu.delete({
      where: {
        id: parseInt(id),
      },
    });
  }

  async currentMenu() {
    const currentTime = new Date().getHours() - 3;
    const isDayTime = currentTime >= 6 && currentTime < 18;

    return await this.prisma.menu.findFirst({
      include: {
        products: true,
      },
      where: {
        name: isDayTime ? 'Diurno' : 'Noturno',
      },
    });
  }
}
