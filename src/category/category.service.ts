import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private async getCategory(dto: Partial<Category>) {
    return await this.prisma.category.findFirst({
      where: dto,
    });
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const alredyRegsitered = await this.getCategory({
      name: createCategoryDto.name,
    });
    if (alredyRegsitered) {
      throw new ConflictException('Category alredy registered!');
    }

    return await this.prisma.category.create({
      data: createCategoryDto,
    });
  }
}
