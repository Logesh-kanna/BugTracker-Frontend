import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../common/local-storage/local-storage-service.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn(): Boolean {
    const data = this.storage.getData('user');
    if (!data) return false;
    const loginTime = data.loginTime;
    const currentTime = new Date().getTime();

    if (currentTime - loginTime > 86400000) {
      localStorage.removeItem('user');
      return false;
    }
    return true;
  }

  private baseUrl = environment.productApiBaseUrl + "/auth";
  storedData: any = {};

  getBeareToken(): any {
    const parsedData = this.storedData;
    return parsedData.data[0] ? parsedData.data[0]['bearer_token'] : null;
  }

  constructor(private http: HttpClient, private storage: LocalStorageService) {
    this.storedData = this.storage.getData("user");
  }
  // Admin
  adminSignin(data: any): Observable<any> {
    const url = `${this.baseUrl}/admin/signin`;
    return this.http.post(url, data);
  }

  adminData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/admin/show`;
    return this.http.post(url, data, { headers });
  }

  // Manager
  managerSignup(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    console.log(`Bearer ` + this.getBeareToken());
    const url = `${this.baseUrl}/manager/signup`;
    return this.http.post(url, data, { headers });
  }

  managerSignin(data: any): Observable<any> {
    const url = `${this.baseUrl}/manager/signin`;
    return this.http.post(url, data);
  }

  managerData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/manager/show`;
    return this.http.post(url, data, { headers });
  }

  deleteManager(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/manager/delete`;
    return this.http.post(url, data, { headers });
  }

  getDashboardData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/dashboard`;
    return this.http.post(url, data, { headers });
  }

  // User
  userSignup(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/user/signup`;
    return this.http.post(url, data, { headers });
  }

  userSignin(data: any): Observable<any> {
    const url = `${this.baseUrl}/user/signin`;
    return this.http.post(url, data);
  }

  userData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/user/show`;
    return this.http.post(url, data, { headers });
  }

  deleteUser(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken()
    });
    const url = `${this.baseUrl}/user/delete`;
    return this.http.post(url, data, { headers });
  }

  logout(): Observable<any> {
    const data = {};
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/logout`;
    this.storage.removeData("user");
    this.storage.removeData("projectToken");
    this.storage.removeData("bugToken");
    return this.http.post(url, data, { headers });
  }
}
