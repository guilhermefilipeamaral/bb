import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then(mod => mod.LoginModule)
  },
  {
    path: "account",
    pathMatch: "full",
/*     canActivate: [AuthGuard], */
    loadChildren: () => import("./account/account.module").then(mod => mod.AccountModule)
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "account"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
