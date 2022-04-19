import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "@core/services/message.service";
import { User } from "@features/user/models/user";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.data.user) {
      this.user = this.route.snapshot.data.user;
    } else {
      this.messageService.error("Could not load user information.");
    }
  }
}
