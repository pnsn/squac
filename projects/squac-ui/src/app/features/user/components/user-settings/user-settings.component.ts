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

  ngOnInit(): void {
    this.user = this.route.snapshot.data.user;
    this.initForm(this.user);
  }

  // set up form
  initForm(user): void {
    this.userForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(user.firstName, Validators.required),
      lastName: new UntypedFormControl(user.lastName, Validators.required),
    });
  }

  // enable edit
  editForm(): void {
    this.editMode = true;
  }

  // save changed user
  save(): void {
    this.userService.update(this.userForm.value).subscribe({
      next: () => {
        this.editMode = false;
        this.messageService.message("User information updated.");
      },
      error: (error) => {
        this.messageService.error("Could not save user information.");
        console.error("error in change user: ", error);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
