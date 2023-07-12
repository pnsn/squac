import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Subscription } from "rxjs";
import { OrganizationPipe, User } from "squacapi";
import {
  Validators,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MessageService } from "@core/services/message.service";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";
import { DetailPageComponent } from "@shared/components/detail-page/detail-page.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgIf } from "@angular/common";

/** User edit form fields */
interface UserForm {
  /** user first name */
  firstname: FormControl<string>;
  /** user last name */
  lastname: FormControl<string>;
}

/**
 * User Settings Component
 */
@Component({
  selector: "user-settings",
  templateUrl: "./user-settings.component.html",
  standalone: true,
  imports: [
    DetailPageComponent,
    RouterLink,
    OrganizationPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
  ],
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  user: User;
  id: number;
  editMode: boolean;
  userForm: FormGroup<UserForm>;
  hide = true;
  /** Config for detail page */
  pageOptions: PageOptions = {
    path: "user",
    titleButtons: {
      addButton: true,
    },
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  /** Init */
  ngOnInit(): void {
    this.user = this.route.snapshot.data["user"];
    this.initForm(this.user);
  }

  /**
   * Set up form
   *
   * @param user current user
   */
  initForm(user: User): void {
    this.userForm = new FormGroup({
      firstname: new FormControl(user.firstname, Validators.required),
      lastname: new FormControl(user.lastname, Validators.required),
    });
  }

  /**
   * Enable form editing
   */
  editForm(): void {
    this.editMode = true;
  }

  /**
   * Save changes
   */
  save(): void {
    this.userService.update(this.userForm.value).subscribe({
      next: () => {
        this.editMode = false;
        this.messageService.message("User information updated.");
      },
      error: () => {
        this.messageService.error("Could not save user information.");
      },
    });
  }

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
