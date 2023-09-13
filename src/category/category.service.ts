import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getAll() {
    return await this.prisma.category.findMany({});
  }
  async update(id: string, updateCategoryuDto: UpdateCategoryDto) {
    const isRegistered = await this.getCategory({ id: parseInt(id) });
    if (!isRegistered) {
      throw new NotFoundException(`Category '${id}' was not found!`);
    }

    return await this.prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: updateCategoryuDto,
    });
  }
}
