import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../common/local-storage/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClientManagementService {

  private baseUrl = environment.adminApiBaseUrl + "client";
  storedData: any = {};

  getBeareToken(): any {
    const parsedData = this.storedData;
    return parsedData.data[0] ? parsedData.data[0]['bearer token'] : null;
  }

  constructor(private http: HttpClient, private storage: LocalStorageService) {
    this.storedData = this.storage.getData("admin");
  }
  createClient(data: any): Observable<any> {
    const url = `${this.baseUrl}/create`;
    return this.http.post(url, data);
  }

  deleteClient(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/delete`;
    return this.http.post(url, data, { headers });
  }

  changeStatus(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/change_status`;
    return this.http.post(url, data, { headers });
  }

  showClientRequest(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/show/requested`;
    return this.http.post(url, data, { headers });
  }

  acceptRequest(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/accept_request`;
    return this.http.post(url, data, { headers });
  }

  showAcceptedOrDisabledClients(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/show/accepted_disabled`;
    return this.http.post(url, data, { headers });
  }

  showRejectedClients(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/show/rejected  `;
    return this.http.post(url, data, { headers });
  }

  showRequestedClients(data: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ` + this.getBeareToken(),
    });
    const url = `${this.baseUrl}/show/requested  `;
    return this.http.post(url, data, { headers });
  }

}
