import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploader {
  async uploadFile(file: File, path: string) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('path', path);

    const response = await fetch(`${environment.API_URL}/supabase/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const {data} = await response.json();
    return {
      path: data.path,
      url: data.url
    };
  }
}
