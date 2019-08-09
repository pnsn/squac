import { Injectable } from '@angular/core';
import { Widget } from './widget';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WidgetsService {
  private widgets: Widget[] = [
    new Widget(12398724, "widget A"),
    new Widget(2232437, "widget B"),
    new Widget(3131242, "widget C"), 
  ];
  widgetsChanged = new Subject<Widget[]>();

  constructor() { }

  private getIndexFromId(id: number) : number{
    for (let i=0; i < this.widgets.length; i++) {
      if (this.widgets[i].id === id) {
          return i;
      }
    }
  }

  getWidgets() : Widget[]{
    console.log(this.widgets)
    return this.widgets.slice();
  }

  getWidget(id: number) : Widget{
    let index = this.getIndexFromId(id);
    return this.widgets[index];
  }

  addWidget(widget: Widget) : number{ //can't know id yet
    this.widgets.push(new Widget(this.widgets.length, widget.name));
    this.widgetsChange();
    console.log(this.widgets)
    return this.widgets.length - 1;
  };

  updateWidget(id: number, widget: Widget) : number {
    if (id) {
      let index = this.getIndexFromId(id);
      this.widgets[index] = new Widget(id, widget.name);
      this.widgetsChange();
    } else {
      return this.addWidget(widget);
    }
  }

  private widgetsChange(){
    this.widgetsChanged.next(this.widgets.slice());
  }
}
