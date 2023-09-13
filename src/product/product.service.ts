import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/services/prisma.service';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private async getProduct(dto: Partial<Product>) {
    return await this.prisma.product.findFirst({
      where: dto,
    });
  }

  private async getCategory(dto: Partial<Category>) {
    return await this.prisma.category.findFirst({
      where: dto,
    });
  }

  private async getMenu(dto: Partial<Category>) {
    return await this.prisma.menu.findFirst({
      where: dto,
    });
  }

  async create(createProductDto: CreateProductDto) {
    const alredyRegsitered = await this.getProduct({
      name: createProductDto.name,
    });
    if (alredyRegsitered) {
      throw new ConflictException(
        `Product '${createProductDto.name}' alredy registered`,
      );
    }

    const categoryIds = (
      await Promise.all(
        createProductDto.categories.map(async (category, index) => {
          if (typeof category === 'number') {
            const isRegistered = await this.getCategory({ id: category });
            if (!isRegistered) {
              throw new NotFoundException(
                `Category '${category}' was not found!`,
              );
            }
            return category;
          } else {
            throw new BadRequestException(
              `Category at ${index} has invalid format!`,
            );
          }
        }),
      )
    ).filter((item) => item);

    const menuIds = (
      await Promise.all(
        createProductDto.menus.map(async (menu, index) => {
          if (typeof menu === 'number') {
            const isRegistered = await this.getMenu({ id: menu });
            if (!isRegistered) {
              throw new NotFoundException(`Menu '${menu}' was not found!`);
            }
            return menu;
          } else {
            throw new BadRequestException(
              `Menu at ${index} has invalid format!`,
            );
          }
        }),
      )
    ).filter((item) => item);

    return await this.prisma.product.create({
      data: {
        ...createProductDto,
        categories: {
          connect: categoryIds.map((id) => ({
            id,
          })),
        },
        menus: {
          connect: menuIds.map((id) => ({
            id,
          })),
        },
      },
      include: {
        categories: true,
        menus: true,
      },
    });
  }

  async getAll() {
    return await this.prisma.product.findMany({
      include: {
        categories: true,
        menus: true,
      },
    });
  }
}
