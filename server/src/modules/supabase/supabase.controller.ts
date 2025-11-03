import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileInterceptor } from 'src/common/interceptors/file-interceptor/file-interceptor.interceptor';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('upload')
  @HttpCode(201)
  @UseInterceptors(imageFileInterceptor)
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('path') path: string
  ) {
    return this.supabaseService.uploadFile(file, path);
  }

  @Post('update')
  @HttpCode(201)
  @UseInterceptors(imageFileInterceptor)
  updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('path') path: string
  ) {
    return this.supabaseService.uploadFile(file, path, true);
  }

  @Post('delete')
  @HttpCode(201)
  deleteFile(
    @Body('path') path: string
  ) {
    return this.supabaseService.deleteFile(path);
  }

}
