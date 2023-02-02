import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Subscription } from "rxjs";
import { User } from "squacapi";
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "@core/services/message.service";

/**
 * User Settings Component
 */
@Component({
  selector: "user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.scss"],
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  user: User;
  id: number;
  editMode: boolean;
  userForm: UntypedFormGroup;
  hide = true;

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
    this.userForm = new UntypedFormGroup({
      firstname: new UntypedFormControl(user.firstname, Validators.required),
      lastname: new UntypedFormControl(user.lastname, Validators.required),
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
