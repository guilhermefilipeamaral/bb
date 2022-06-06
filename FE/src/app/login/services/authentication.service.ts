import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApplicationState } from 'src/app/common/app.state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient,
    public appState: ApplicationState
  ) { }

  public login(email: string, password: string): Observable<any> {
    const params = {
      email,
      password
    }
    return this.http.post(`${environment.api.endpoint}/login`, params).pipe(
      map((authenticationData: any) => {
        this.appState.expiresAt = new Date(authenticationData.data.cookie.expires).toLocaleString();
        this.appState.firstName = authenticationData.firstName;
        this.appState.lastName = authenticationData.lastName;
        this.appState.storeId = authenticationData.storeId;
        this.appState.accessToken = authenticationData.token;
      })
    );
  }

  public logout(): Observable<any> {
    this.appState.expiresAt = null;
    this.clearLocalStorage();
    return this.http.get(`${environment.api.endpoint}/logout`);
  }

  public isUserAuthenticated(): boolean {
    const expiresAt = this.appState.expiresAt;
    const accessToken = this.appState.accessToken;
    const now = new Date();
    if (!accessToken || !expiresAt || expiresAt < now.toLocaleString()) {
      this.clearLocalStorage();
      return false;
    }
    return true;
  }

  public clearLocalStorage(): void {
    this.appState.accessToken = null;
    this.appState.expiresAt = null;
    this.appState.firstName = null;
    this.appState.storeId = null;
  }
}
