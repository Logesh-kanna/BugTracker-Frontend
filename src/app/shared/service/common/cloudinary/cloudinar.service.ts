import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinarService {

  constructor(private http: HttpClient) { }

  cloudName: string = environment.cloudName;
  uploadPreset: string = environment.uploadPreset;

  uploadFile(file: File, path: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('cloud_name', this.cloudName);
    formData.append('folder', path);
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
    return this.http.post(url, formData);
  }

}
