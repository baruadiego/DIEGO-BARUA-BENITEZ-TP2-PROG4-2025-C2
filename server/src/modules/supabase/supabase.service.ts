import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto';

const BUCKET_NAME = 'images'
@Injectable()
export class SupabaseService {
  private readonly supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!);

  async uploadFile(file: Express.Multer.File, path: string, update = false) {
    if (!path){
      throw new BadRequestException('Path is required');
      
    }

    if (!update){
      path = path + '/' + randomBytes(16).toString('hex')
    }

    const {data, error} = await this.supabase.storage.from(BUCKET_NAME).upload(path, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: true,
    })

    if (error){
      console.log(error)
      throw new InternalServerErrorException('Error uploading file');
    }

    const imageUrl = await this.generatePublicUrl(data.path)

    return {
      data:{
        path: data.path,
        url: imageUrl
      }
    }
  }

  async generatePublicUrl(path: string) {
    const {data} = await this.supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
    
    return data.publicUrl
  }

  async deleteFile(path: string) {
    if (!path){
      throw new BadRequestException('Path is required');
    }
    const {data, error} = await this.supabase.storage.from(BUCKET_NAME).remove([path])
    if (error){
      throw new InternalServerErrorException('Error deleting file');
    }

    return {message: 'File deleted'}
  }

}
