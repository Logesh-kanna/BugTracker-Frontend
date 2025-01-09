import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../common/local-storage/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private baseUrl = environment.adminApiBaseUrl;
  storedData: any = {};

  getBeareToken(): any {
    const parsedData = this.storedData;
    return parsedData.data[0] ? parsedData.data[0]['bearer token'] : null;
  }

  constructor(private http: HttpClient, private storage: LocalStorageService) {
    this.storedData = this.storage.getData("admin");
  }

  showUserData(page: number, size: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    let params = new HttpParams().set("page", page.toString()).set("size", page.toString());
    const data = {
      page: page,
      size: size,
    }
    const url = `${this.baseUrl}user/info`;
    return this.http.post(url, data, { headers });
  }

  showAdminData(page: number, size: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const data = {
      page: page,
      size: size,
    }
    const url = `${this.baseUrl}admin/info`;
    return this.http.post(url, data, { headers });
  }

  // adminChangeStatus(data: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ` + this.getBeareToken(),
  //   });
  //   const url = `${this.baseUrl}admin/change_status`;
  //   return this.http.post(url, data);
  // }

  userChangeStatus(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}user/change_status`;
    return this.http.post(url, data, { headers });
  }

}
