import { ApplicationState } from 'src/app/common/app.state';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, catchError, finalize, of } from "rxjs";

import { Account } from "../models/account.model";
import { ApiService } from "../services/api.service";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

export class AccountDataSource implements DataSource<Account> {

  public accountSubject = new BehaviorSubject<Account[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public data = this.accountSubject.asObservable();
  private startDate: Date | undefined;
  private endDate: Date | undefined;
  private storeId = 1;
  constructor(
    private apiService: ApiService,
    private appState: ApplicationState
  ) {
    this.loadAccount();
  }

  public connect(): Observable<Account[]> {
    return this.accountSubject.asObservable();
  }

  public disconnect(): void {
    this.accountSubject.complete();
    this.loadingSubject.complete();
  }

  public loadAccount(start?: Date, end?: Date, storeId?: number) {
    this.loadingSubject.next(true);
    if (start && end) {
      this.startDate = start;
      this.endDate = end;
    } else {
      this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      this.endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    }

    if (storeId) {
      this.storeId = storeId;
    } else {
      this.storeId = Number(this.appState.storeId);
    }
    this.apiService.getList(this.startDate, this.endDate, this.storeId).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
    .subscribe(result =>  {
      this.accountSubject.next(result.data)
    });
  }
}
