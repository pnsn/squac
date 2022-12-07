import { Widget as ApiWidget } from "squacapi";
import { WidgetType } from "../enums";

/**
 *
 */
export class Widget extends ApiWidget {
  override type: WidgetType;
}
