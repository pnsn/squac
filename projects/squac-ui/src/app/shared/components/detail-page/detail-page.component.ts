import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { SquacObject } from "squacapi";
import { ButtonEvent, PageOptions } from "./detail-page.interface";
/**
 * Reusable table view component
 */
@Component({
  selector: "shared-detail-page",
  templateUrl: "./detail-page.component.html",
  styleUrls: ["./detail-page.component.scss"],
})
export class DetailPageComponent {
  /** type of squac model being shown */
  @Input() type?: string;
  /** page title */
  @Input() title?: string; //page title
  /** page subtext */
  @Input() subtext?: string; //small text by title
  /** page configuration */
  @Input() options: PageOptions = {};
  /** resource to show */
  @Input() resource?: SquacObject;
  /** emits clicked button value */
  @Output() controlClicked? = new EventEmitter<ButtonEvent>();
  /** emits save resource event */
  @Output() saveResource = new EventEmitter<string>();
  /** emits deleteResource event */
  @Output() deleteResource = new EventEmitter<string>();
  /** emits cancel editing event */
  @Output() cancelEdit = new EventEmitter<string>();

  /**
   * constructor
   *
   * @param confirmDialog opens dialog for user confirmation
   * @param router angular router
   * @param route angular activated routea
   */
  constructor(
    private confirmDialog: ConfirmDialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Respond to menu option
   *
   * @param action menu action
   */
  buttonAction(action: ButtonEvent): void {
    const path = this.options.path;
    if (action === "edit") {
      this.controlClicked.emit(action);
      const id = `${this.resource?.id}`;
      this.routeTo(id, "edit", path);
    } else if (action === "add") {
      this.controlClicked.emit(action);
      this.routeTo(null, "new", path);
    } else if (action === "delete" || action === "cancel") {
      this.cancel(action);
    } else if (action === "save") {
      this.saveResource.emit(action);
      this.controlClicked.emit(action);
    }
  }

  /**
   * Delete selected resource
   *
   * @param action text for button
   */
  cancel(action: "delete" | "cancel"): void {
    const name =
      this.resource && "name" in this.resource
        ? this.resource.name
        : "resource";
    let title = "";
    let message = "";
    let cancelText = "";
    let confirmText = "";

    if (action === "delete") {
      title = `Delete ${name}`;
      message = "Are you sure? This action is permanent.";
      cancelText = "Cancel";
      confirmText = "Delete";
    } else {
      title = `Cancel editing ${name}`;
      message = "Are you sure? All changes will be lost.";
      cancelText = "No, Stay";
      confirmText = "Yes, Cancel";
    }

    this.confirmDialog.open({
      title,
      message,
      cancelText,
      confirmText,
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        if (action === "delete") {
          this.deleteResource.emit("delete");
        } else {
          this.cancelEdit.emit("cancel");
        }
        this.controlClicked.emit(action);
      }
    });
  }

  /**
   * Handles routing to a resource
   *
   * @param resource resource to route to
   * @param action route action
   * @param path additional path config
   */
  routeTo(resource: string, action?: string, path?: string): void {
    const route = [];
    if (path) {
      route.push(path);
    }
    if (resource) {
      route.push(resource);
    }
    if (action) {
      route.push(action);
    }
    this.router.navigate(route, {
      relativeTo: this.route,
    });
  }
}
