import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Account } from '../models/account.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent {
  @Output() callback = new EventEmitter<Account>();
  public accountFormControl = new FormControl("");
  constructor() { }

  public submit(): void {
    this.callback.emit(new Account());
  }
}
