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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  getAll() {
    return this.productService.getAll();
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateProductDto) {
    return this.productService.update(id, updateMenuDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
