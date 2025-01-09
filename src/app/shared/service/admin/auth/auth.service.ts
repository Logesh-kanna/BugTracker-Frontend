import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../common/local-storage/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn(): Boolean {
    const parsedData = this.storage.getData("admin");
    if (!parsedData) return false;
    const loginTime = parsedData.loginTime;
    const currentTime = new Date().getTime();
    if (currentTime - loginTime > 86400000) {
      localStorage.removeItem('admin');
      return false;
    }
    return true;
  }

  private baseUrl = environment.adminApiBaseUrl + "auth";
  storedData: any = {};

  constructor(private http: HttpClient, private storage: LocalStorageService) {
    this.storedData = this.storage.getData("admin");
  }

  getBeareToken(): any {
    const parsedData = this.storedData;
    return parsedData.data[0] ? parsedData.data[0]['bearer token'] : null;
  }

  // Admin Api
  adminSignUp(data: any): Observable<any> {
    const url = `${this.baseUrl}/admin/signup`;
    return this.http.post(url, data);
  }

  adminSignIn(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url = `${this.baseUrl}/admin/signin`;
    return this.http.post(url, data, { headers });
  }

  deleteUser(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/user/delete`;
    return this.http.post(url, data, { headers });
  }

  deleteAdmin(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/user/delete`;
    return this.http.post(url, data, { headers });
  }

  // User Api
  userSignUp(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/user/signup`;
    return this.http.post(url, data, { headers });
  }

  userSignIn(data: any): Observable<any> {
    const url = `${this.baseUrl}/user/signin`;
    return this.http.post(url, data);
  }

  getDashboardData(): Observable<any> {
    const data = {};
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/dashboard`;
    return this.http.post(url, data, { headers });
  }

  logout(): Observable<any> {
    const data = {};
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/logout`;
    this.storage.removeData("admin");
    return this.http.post(url, data, { headers });
  }

}
