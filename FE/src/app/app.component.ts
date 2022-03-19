import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { Component, ElementRef, ViewChild } from '@angular/core';

import { Account } from './models/account.model';
import { AccountDataSource } from './data-source/account.data-source';
import { AddAccountComponent } from "./add-account/add-account.component";
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from "@angular/material/dialog";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // public data = new BehaviorSubject<Array<Account>>([]);
  public data: Account[] = [];
  public displayedColumns: string[] = ['Id', 'CreditNotesWithTax', 'DepositCash', 'DepositCheck', 'DepositTotal',
    'TotalPOSWithcommission', 'TotalPOSWithoutcommission', 'TotalRevenueWithTax', 'TotalRevenueWithoutTax', 'Notes', 'Edit-delete'];
  @ViewChild('htmlData') public htmlData!: ElementRef;
  public dataSource = new AccountDataSource(this.apiService);
  public date = new Date();
  constructor(
    private apiService: ApiService,
    public dialog: MatDialog
    ) {
  }

  public ngOnInit() {
    this.dataSource.connect();
  }

  public addRow(): void {
    const dialogRef = this.dialog.open(AddAccountComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.apiService.create(result);
    });
  }

  public onEdit(): void {
    const dialogRef = this.dialog.open(AddAccountComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.apiService.edit(result);
    });
  }

  public onDelete(row: Account): void {
    this.apiService
      .delete(row)
      .subscribe(result => {
        this.dataSource.loadAccount();
    });
  }

  public onBtnExport() {
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
}
