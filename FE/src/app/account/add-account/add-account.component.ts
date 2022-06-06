import { ApplicationState } from 'src/app/common/app.state';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';

import { Account, BaseAccount } from '../models/account.model';
import { FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {
  public accountFormControl = new FormGroup({
    TotalRevenueWithoutTax: new FormControl(),
    CreditNotesWithTax: new FormControl(),
    DepositCheck: new FormControl(),
    DepositCash: new FormControl(),
    DepositTotal: new FormControl(),
    TotalPOSWithcommission: new FormControl(),
    TotalPOSWithoutcommission: new FormControl(),
    Notes: new FormControl(this.appState.firstName + " " + this.appState.lastName),
  });
  public model = new Account();
  private editMode = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private appState: ApplicationState,
    @Inject(MAT_DIALOG_DATA) public data: Account
  ) { }

  public ngOnInit() {
    if (this.data) {
      this.editMode = true;
      this.model = this.data;
      this.accountFormControl.setValue({
        TotalRevenueWithoutTax: this.data.TotalRevenueWithoutTax,
        CreditNotesWithTax: this.data.CreditNotesWithTax,
        DepositCheck: this.data.DepositCheck,
        DepositCash: this.data.DepositCash,
        DepositTotal: this.data.DepositTotal,
        TotalPOSWithcommission: this.data.TotalPOSWithcommission,
        TotalPOSWithoutcommission: this.data.TotalPOSWithoutcommission,
        Notes: this.data.Notes,
      });
    }
  }

  public submit(): void {
    if (this.accountFormControl.valid) {
      this.model = { ...this.model, ...this.accountFormControl.value };
      if (this.model.TotalRevenueWithoutTax > 0) {
        this.model.TotalRevenueWithTax = Number(this.model.TotalRevenueWithoutTax) + Number(this.model.TotalRevenueWithoutTax) * (environment.iva/100) ;
      }
      this.model.StoreId = this.appState.storeId;
      if (this.editMode) {
        this.apiService.edit(this.model).subscribe(() => {
          this.snackBar.open('Elemento actualizado com sucesso.', '', {
            horizontalPosition: "end",
            verticalPosition: "top",
            duration: 3000,
            panelClass: ['success-notification']
          });
        });
      } else {
        this.apiService.create(this.model).subscribe(() => {
          this.snackBar.open('Elemento adicionado com sucesso.', '', {
            horizontalPosition: "end",
            verticalPosition: "top",
            duration: 3000,
            panelClass: ['success-notification']
          });
        });
      }
    }
  }
}
