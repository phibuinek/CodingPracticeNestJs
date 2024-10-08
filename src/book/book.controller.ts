import { BookService } from "./book.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Book } from "./schemas/book.schema";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";

import { Query as ExpressQuery } from "express-serve-static-core";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/role.enum";
import { RolesGuard } from "src/auth/guards/role.guard";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller("book")
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @Roles(Role.Moderator, Role.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.bookService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createBook(
    @Body()
    book: CreateBookDto,
    @Req() req,
  ): Promise<Book> {
    return this.bookService.create(book, req.user);
  }

  @Get(":id")
  async getBook(
    @Param("id")
    id: string,
  ): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Put(":id")
  async updateBook(
    @Param("id")
    id: string,
    @Body()
    book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateById(id, book);
  }

  @Delete(":id")
  async deleteBook(
    @Param("id")
    id: string,
  ): Promise<Book> {
    return this.bookService.deleteById(id);
  }

  @Put("upload/:id")
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor("files"))
  async uploadImages(
    @Param("id") id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(files);
  }
}
