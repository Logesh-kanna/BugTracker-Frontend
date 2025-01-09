import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../common/local-storage/local-storage-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {
  storedData: any = {};

  private baseUrl = environment.productApiBaseUrl + "/project";

  getBeareToken(): any {
    const parsedData = this.storedData;
    return parsedData.data[0] ? parsedData.data[0]['bearer_token'] : null;
  }

  constructor(private http: HttpClient, private storage: LocalStorageService) {
    this.storedData = this.storage.getData("user");
  }

  showUsers(): Observable<any> {
    const data = {};
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/show/user`;
    return this.http.post(url, data, { headers });
  }

  showManagers(): Observable<any> {
    const data = {};
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/show/manager`;
    return this.http.post(url, data, { headers });
  }

  showUserProject(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/show`;
    return this.http.post(url, data, { headers });
  }

  createProject(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/create`;
    return this.http.post(url, data, { headers });
  }

  deleteProject(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/delete`;
    return this.http.post(url, data, { headers });
  }

  deleteUserProject(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/user/delete`;
    return this.http.post(url, data, { headers });
  }

  addMember(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/add/member`;
    return this.http.post(url, data, { headers });
  }

}
