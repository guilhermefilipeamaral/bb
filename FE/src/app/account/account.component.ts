import { ApplicationState } from 'src/app/common/app.state';
import { AuthenticationService } from './../login/services/authentication.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Account } from "./models/account.model";
import { AccountDataSource } from './data-source/account.data-source';
import { AddAccountComponent } from './add-account/add-account.component';
import { ApiService } from 'src/app/account/services/api.service';
import { MatDialog } from "@angular/material/dialog";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from './models/store.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @ViewChild('TABLE') public dataTable!: ElementRef;
  public data: Account[] = [];
  public displayedColumns: string[] = ['CreationDate',
    'TotalRevenueWithoutTax', 'TotalRevenueWithTax',
    'CreditNotesWithTax', 'DepositCash', 'DepositTotal',
    'TotalPOSWithcommission', 'TotalPOSWithoutcommission',
    'Notes',
    'Edit-delete'];
  @ViewChild('htmlData') public htmlData!: ElementRef;
  public dataSource = new AccountDataSource(this.apiService, this.appState);
  public date = new Date();
  public filters = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    store: new FormControl("1")
  });

  public store: Store[] | undefined;
  constructor(
    public dialog: MatDialog,
    public appState: ApplicationState,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar,
    ) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.filters.setValue({
      start: firstDay,
      end: lastDay,
      store: ""
    });
    this.getStores();
  }

  public ngOnInit() {
    this.dataSource.connect();
  }

  public applyFilter(): void {
    this.dataSource.loadAccount(
      this.filters.value.start,
      this.filters.value.end,
      this.filters.value.store
    );
  }

  public addRow(): void {
    const dialogRef = this.dialog.open(AddAccountComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.loadAccount();
      }
    });
  }

  public onEdit(row: Account): void {
    const dialogRef = this.dialog.open(AddAccountComponent, { data: row });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.loadAccount();
      }
    });
  }

  public onDelete(row: Account): void {
    this.apiService
      .delete(row)
      .subscribe(result => {
        this.dataSource.loadAccount();
        this.snackBar.open('Elemento foi eliminado com sucesso.', '', {
          horizontalPosition: "end",
          verticalPosition: "top",
          duration: 3000,
          panelClass: ['success-notification']
        });
    });
  }

  public onBtnExport(): void {
    html2canvas(this.htmlData.nativeElement).then(canvas => {

        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;

        const FILEURI = canvas.toDataURL('image/png')
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

        PDF.save('angular-demo.pdf');
    });
  }

  public onBtnExportExcel(): void {
    const newData = this.dataSource.accountSubject.value;
    newData.map(row=>{
      delete row.Id
      return row
    })
    const workSheet=XLSX.utils.json_to_sheet(newData);
    const workBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook,workSheet,"account");
    //Buffer
    let buf=XLSX.write(workBook,{bookType:"xlsx",type:"buffer"});
    //Binary string
    XLSX.write(workBook,{bookType:"xlsx",type:"binary"});
    //Download
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    XLSX.writeFile(workBook,"contabilidade de "+ monthNames[new Date().getMonth()] +".xlsx");
  }

  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

  private getStores(): void {
    this.apiService.getStores().subscribe(result => {
      this.store = result.data;
    })
  }
}
