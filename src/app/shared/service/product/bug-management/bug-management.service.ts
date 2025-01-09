import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../common/local-storage/local-storage-service.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BugManagementService {

  private baseUrl = environment.productApiBaseUrl + "/bug";
  storedData: any = {};

  getToken(): any {
    const parsedData = this.storedData;
    return parsedData.data[0] ? parsedData.data[0]['bearer_token'] : null;
  }

  constructor(private http: HttpClient, private storage: LocalStorageService) {
    this.storedData = this.storage.getData("user");
  }

  createBug(data: any): Observable<any> {
    const url = `${this.baseUrl}/create`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(url, data, { headers });
  }

  projectUsers(data: any): Observable<any> {
    const url = `${this.baseUrl}/project_user`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getToken()
    });
    return this.http.post(url, data, { headers });
  }

  showProjectBugs(data: any): Observable<any> {
    const url = `${this.baseUrl}/show_project_bugs`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getToken()
    });
    return this.http.post(url, data, { headers });
  }

  showUserBugs(data: any): Observable<any> {
    const url = `${this.baseUrl}/show_user_bugs`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getToken()
    });
    console.log(`Bearer ` + this.getToken());
    return this.http.post(url, data, { headers });
  }

  showBugInfo(data: any): Observable<any> {
    const url = `${this.baseUrl}/info`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getToken()
    });
    return this.http.post(url, data, { headers });
  }

  changeBugStatus(data: any): Observable<any> {
    const url = `${this.baseUrl}/change_status`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getToken()
    });
    return this.http.post(url, data, { headers });
  }

  changeBugAssignee(data: any): Observable<any> {
    const url = `${this.baseUrl}/change_assignee`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getToken()
    });
    return this.http.post(url, data, { headers });
  }

}
