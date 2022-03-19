import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, catchError, finalize, of } from "rxjs";

import { Account } from "../models/account.model";
import { ApiService } from "../services/api.service";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

export class AccountDataSource implements DataSource<Account> {

  private accountSubject = new BehaviorSubject<Account[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadAccount();
  }

  public connect(): Observable<Account[]> {
    return this.accountSubject.asObservable();
  }

  public disconnect(): void {
    this.accountSubject.complete();
    this.loadingSubject.complete();
  }

  public loadAccount() {
    this.loadingSubject.next(true);
    this.apiService.getList().pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
    .subscribe(result =>  {
      this.accountSubject.next(result.data)
    });
  }
}
