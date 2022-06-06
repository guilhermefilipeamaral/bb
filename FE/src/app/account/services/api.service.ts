import { Account, BaseAccount } from '../models/account.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from '../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly httpOptions = {
    headers: new HttpHeaders({
     "Content-Type": "application/json",
    })
  };
  constructor(private http: HttpClient) { }

  public getList(start: Date, end: Date, storeId: number): Observable<any> {
    return this.http.get(`${environment.api.endpoint}/account?start=${start.toISOString()}&end=${end.toISOString()}&storeId=${storeId}`);
  }

  public create(data: any): Observable<any> {
    return this.http.post<any>(`${environment.api.endpoint}/account`, data, this.httpOptions);
  }

  public edit(data: any): Observable<any> {
    return this.http.put<any>(`${environment.api.endpoint}/account/${data.Id}`, data, this.httpOptions);
  }

  public delete(data: any): Observable<any> {
    return this.http.delete(`${environment.api.endpoint}/account/${data.Id}`);
  }

  public getStores(): Observable<any> {
    return this.http.get<any>(`${environment.api.endpoint}/stores`);
  }
}
