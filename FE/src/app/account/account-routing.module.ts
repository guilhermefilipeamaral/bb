import { Route, RouterModule } from "@angular/router";

import { AccountComponent } from "./account.component";
import { NgModule } from "@angular/core";

const routes: Route[] = [
  {
    path: "",
    component: AccountComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AccountRoutingModule {}
