import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "../../services/message.service";
import { User } from "squacapi";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // get user for header
    if (this.route.snapshot.data["user"]) {
      this.user = this.route.snapshot.data["user"];
    } else {
      this.messageService.error("Could not load user information.");
    }
  }
}