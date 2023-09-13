import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  getAll() {
    return this.categoryService.getAll();
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateMenuDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
