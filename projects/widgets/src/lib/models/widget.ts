import { Widget as ApiWidget } from "squacapi";
import { WidgetType } from "../enums";

/** Widget model */
export class Widget extends ApiWidget {
  /** widget type */
  override type: WidgetType;
}
