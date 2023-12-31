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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('current')
  currentMenu() {
    return this.menuService.currentMenu();
  }

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  getAll() {
    return this.menuService.getAll();
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.menuService.delete(id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(parseInt(id));
  }
}
