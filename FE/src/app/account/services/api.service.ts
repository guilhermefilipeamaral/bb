import { Account } from '../models/account.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  public getList(): Observable<any> {
    return this.http.get(`${environment.api.endpoint}`);
  }

  public create(data: any): Observable<any> {
    return this.http.post(`${environment.api.endpoint}`, data);
  }

  public edit(data: any): Observable<any> {
    return this.http.put(`${environment.api.endpoint}/${data.id}`, data);
  }

  public delete(data: any): Observable<any> {
    return this.http.delete(`${environment.api.endpoint}/${data.Id}`);
  }
}
