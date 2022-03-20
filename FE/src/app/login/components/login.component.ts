import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { Router } from "@angular/router";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public loginFormGroup: FormGroup;
  public hidePassword = true;
  public isLoading = true;

  get emailFormControl() {
    return this.loginFormGroup.get("email") as FormControl;
  }

  get passwordFormControl() {
    return this.loginFormGroup.get("password") as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.redirectIfLoggedIn();
    this.initLoginForm();

  }

  public onClickLogin(): void {
    if (this.loginFormGroup.valid) {
      // this.authenticationService.login(this.emailFormControl.value, this.passwordFormControl.value);
    } else {
      this.loginFormGroup.markAllAsTouched();
    }
  }

  public onClickResetPassword(): void {
    this.router.navigate(["authentication", "reset"]);
  }

  private initLoginForm(): void {
    this.loginFormGroup = this.fb.group({
      email: this.fb.control("", [Validators.required, Validators.pattern("[A-Za-z0-9._%-+]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")]),
      password: this.fb.control("", [Validators.required])
    });
  }

  /**
   * Bypass this page if token is still valid
   */
  private redirectIfLoggedIn(): void {
   /*  if (TokenHelper.isTokenValid() && !this.isResetPassword) {
      this.router.navigate(["/mandators"]);
    } */
  }
}
