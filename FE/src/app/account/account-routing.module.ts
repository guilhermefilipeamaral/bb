import { Route, RouterModule } from "@angular/router";

import { AccountComponent } from "./account.component";
import { NgModule } from "@angular/core";
import { AuthGuard } from "../guards/auth.guard";

const routes: Route[] = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: AccountComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AccountRoutingModule {}
