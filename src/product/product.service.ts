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

  async create(createProductDto: CreateProductDto) {
    const alredyRegsitered = await this.getProduct({
      name: createProductDto.name,
    });
    if (alredyRegsitered) {
      throw new ConflictException(
        `Product '${createProductDto.name}' alredy registered`,
      );
    }

    const toConnectIds = (
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

    return await this.prisma.product.create({
      data: {
        ...createProductDto,
        categories: {
          connect: toConnectIds.map((id) => ({
            id,
          })),
        },
      },
      include: {
        categories: true,
      },
    });
  }
}
