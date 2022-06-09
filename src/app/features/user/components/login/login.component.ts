import { Component, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "@core/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "user-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})

// This component handles the login page
export class LoginComponent implements OnDestroy {
  error: string = null; // Has there been an error?
  message: string = null;
  hide = true;
  subscription = new Subscription();
  loginForm: FormGroup = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  constructor(
    private loginService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  // Form submit
  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // Send data and log user in
    const loginSub = this.loginService.login(email, password).subscribe(
      () => {
        this.error = "";
        this.message = "Login successful.";
      },
      () => {
        this.message = "";
        this.error = "Failed to log in - please try again";
      }
    );

    this.subscription.add(loginSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
