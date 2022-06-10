import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Subscription } from "rxjs";
import { User } from "../../models/user";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "@core/services/message.service";

@Component({
  selector: "user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.scss"],
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  user: User;
  userForm: FormGroup;
  subscription: Subscription = new Subscription();
  editMode: boolean;
  hide = true;
  id;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.user = this.route.snapshot.data.user;
    this.initForm(this.user);
  }

  initForm(user) {
    this.userForm = new FormGroup({
      firstName: new FormControl(user.firstName, Validators.required),
      lastName: new FormControl(user.lastName, Validators.required),
    });
  }

  editForm() {
    this.editMode = true;
  }

  save() {
    this.userService.updateUser(this.userForm.value).subscribe(
      () => {
        this.userService.fetchUser();
        this.editMode = false;
        this.messageService.message("User information updated.");
      },
      (error) => {
        this.messageService.error("Could not save user information.");
        console.log("error in change user: ", error);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
