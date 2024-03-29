import { NgIf } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { Subscription } from "rxjs";

/** login form fields */
interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}
/**
 * View for logging into squacapi
 */
@Component({
  selector: "user-login",
  templateUrl: "./login.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
})
export class LoginComponent implements OnDestroy {
  subscription = new Subscription();
  error: string = null; // Has there been an error?
  message: string = null;
  hide = true;

  loginForm: FormGroup<LoginForm> = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  });

  constructor(
    private loginService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  /**
   * Submits form info
   */
  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.value.email.toLowerCase();
    const password = this.loginForm.value.password;

    // Send data and log user in
    const loginSub = this.loginService.login(email, password).subscribe({
      next: () => {
        this.error = "";
        this.message = "Login successful.";
      },
      error: () => {
        this.message = "";
        this.error = "Failed to log in - please try again";
      },
    });

    this.subscription.add(loginSub);
  }

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
