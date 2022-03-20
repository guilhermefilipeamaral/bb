import { Route, RouterModule } from "@angular/router";

import { LoginComponent } from "./components/login.component";
import { NgModule } from "@angular/core";

const routes: Route[] = [
  {
    path: "",
    component: LoginComponent
  },
  { path: "login",
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class LoginRoutingModule {}
