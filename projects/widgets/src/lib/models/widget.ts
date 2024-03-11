import { Widget as ApiWidget } from "squacapi";
import { WidgetType } from "../constants";

/** Widget model */
export class Widget extends ApiWidget {
  /** widget type */
  override type: WidgetType;
}
