import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { User } from "squacapi";
import { Subscription } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageService } from "@core/services/message.service";
import { InviteService } from "squacapi";
import { OrganizationUserService } from "squacapi";

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
  userForm: UntypedFormGroup;

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
    private formBuilder: UntypedFormBuilder,
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
      email: [
        { value: "", disabled: this.editMode },
        this.editMode ? [] : [Validators.required, Validators.email],
      ],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      isAdmin: [false, Validators.required],
      groups: ["", Validators.required],
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
        firstName: this.user.firstName,
        lastName: this.user.lastName,
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
    const userData = {
      id: this.user ? this.user.id : null,
      email: values.email ?? this.user.email,
      firstName: values.firstName,
      lastName: values.lastName,
      organization: this.orgId,
      orgAdmin: values.isAdmin,
      groups: values.groups,
      isActive: this.userIsActive,
    };
    const user = new User();
    Object.apply(user, userData);

    this.orgUserService.updateOrCreate(user).subscribe({
      next: (user) => {
        if (!user.isActive) {
          this.sendInvite(user.id, user.email);
        }

        this.messageService.message(`Updated user ${user.email}.`);
        this.cancel(user.id);
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
