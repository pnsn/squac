import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { User } from "@user/models/user";
import { Subscription } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrganizationService } from "@user/services/organization.service";
import { MessageService } from "@core/services/message.service";
import { InviteService } from "@user/services/invite.service";

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
    private orgService: OrganizationService,
    private messageService: MessageService,
    private inviteService: InviteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.user = this.data.user;
    this.orgId = this.data.orgId;

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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // setup form
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

  // set user status to deactivate
  deactivate(): void {
    this.userIsActive = false;
  }

  // save new user
  save(): void {
    const values = this.userForm.value;
    const user = new User(
      this.user ? this.user.id : null,
      values.email ? values.email : this.user.email,
      values.firstName,
      values.lastName,
      this.orgId,
      values.isAdmin,
      values.groups
    );
    user.isActive = this.userIsActive;
    this.orgService
      .updateUser(
        new User(
          this.user ? this.user.id : null,
          values.email ? values.email : this.user.email,
          values.firstName,
          values.lastName,
          this.orgId,
          values.isAdmin,
          values.groups
        )
      )
      .subscribe({
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

  // send invite to user
  sendInvite(id, email): void {
    this.inviteService.sendInviteToUser(id).subscribe({
      next: () => {
        this.messageService.message(`Invitation email sent to ${email}.`);
      },
      error: (error) => {
        this.messageService.error(error);
      },
    });
  }
  // Cancel and don't save changes
  cancel(userId?): void {
    this.dialogRef.close(userId);
    // route out of edit
  }
}
