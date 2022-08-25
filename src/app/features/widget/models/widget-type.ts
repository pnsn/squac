export class WidgetType {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly type: string,
    readonly description: string,
    readonly displayInfo: string,
    readonly zoomControls: boolean,
    readonly useAggregate: boolean,
    readonly toggleKey: boolean,
    readonly minMetrics: number,
    readonly displayOptions?: WidgetDisplayOption[]
  ) {}

  public getOption(displayType: string): WidgetDisplayOption {
    const option =
      this.displayOptions?.find((opt) => {
        return opt.displayType === displayType;
      }) || this.displayOptions[0];

    return option;
  }
}

export class WidgetDisplayOption {
  displayType: string;
  dimensions: string[];
  description: string;
}
