import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { User } from "squacapi";
import { Subscription } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageService } from "@core/services/message.service";
import { InviteService } from "squacapi";
import { OrganizationUserService } from "squacapi";

/** Form for adding user to organization */
interface UserForm {
  /** user's email */
  email: FormControl<string>;
  /** user's first name */
  firstname: FormControl<string>;
  /** user's last name */
  lastname: FormControl<string>;
  /** is user an admin for organization */
  isAdmin: FormControl<boolean>;
  /** user permission groups */
  groups: FormControl<Array<string>>;
}
/**
 * Edit or add users to organizations
 */
@Component({
  selector: "user-organization-edit",
  templateUrl: "./organization-edit.component.html",
  styleUrls: ["./organization-edit.component.scss"],
})
export class OrganizationEditComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  user: User;
  editMode: boolean;
  orgId: number;
  userForm: FormGroup<UserForm>;

  userIsActive = true;
  groupTypes = [
    {
      id: 1,
      role: "viewer",
      description: "can see all resources.",
    },
    {
      id: 2,
      role: "reporter",
      description: "can create dashboards, channel groups, and monitors.",
    },
    {
      id: 3,
      role: "contributor",
      description: "can add metrics and measurements.",
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OrganizationEditComponent>,
    private orgUserService: OrganizationUserService,
    private messageService: MessageService,
    private inviteService: InviteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * init data
   */
  ngOnInit(): void {
    this.user = this.data["user"];
    this.orgId = this.data["orgId"];

    this.editMode = !!this.user;
    this.userForm = this.formBuilder.group({
      email: new FormControl(
        { value: "", disabled: this.editMode },
        this.editMode ? [] : [Validators.required, Validators.email]
      ),
      firstname: new FormControl("", Validators.required),
      lastname: new FormControl("", Validators.required),
      isAdmin: new FormControl(false),
      groups: new FormControl(null, Validators.required),
    });

    this.initForm();
  }

  /** unsubscribe */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** Set up form values */
  private initForm(): void {
    if (this.editMode) {
      this.userForm.patchValue({
        email: this.user.email,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        isAdmin: this.user.isAdmin,
        groups: this.user.groups,
      });
      this.userIsActive = this.user.isActive;
    }
  }

  /** deactivates user */
  deactivate(): void {
    this.userIsActive = false;
  }

  /** saves new user */
  save(): void {
    const values = this.userForm.value;
    const user = new User({
      id: this.user ? this.user.id : null,
      email: values.email ?? this.user.email,
      firstname: values.firstname,
      lastname: values.lastname,
      organization: this.orgId,
      isOrgAdmin: values.isAdmin,
      groups: values.groups,
      isActive: this.userIsActive,
    });

    this.orgUserService.updateOrCreate(user).subscribe({
      next: (userId: number) => {
        if (!user.isActive) {
          this.sendInvite(userId, user.email);
        }

        this.messageService.message(`Updated user ${user.email}.`);
        this.cancel(userId);
      },
      error: () => {
        this.messageService.error(`Could not add user.`);
      },
    });
  }

  /**
   * sends invite to new user
   *
   * @param id user id
   * @param email user email
   */
  sendInvite(id: number, email: string): void {
    this.inviteService.sendInviteToUser(id).subscribe({
      next: () => {
        this.messageService.message(`Invitation email sent to ${email}.`);
      },
      error: (error) => {
        this.messageService.error(error);
      },
    });
  }

  /**
   * cancels without saving changes
   *
   * @param userId number
   */
  cancel(userId?): void {
    this.dialogRef.close(userId);
    // route out of edit
  }
}
