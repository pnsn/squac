import { Injectable } from '@angular/core';
import { View } from './shared/view';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewsService {
  private views: View[] = [
    new View(12398724, "view A"),
    new View(2232437, "view B"),
    new View(3131242, "view C"), 
  ];
  viewsChanged = new Subject<View[]>();

  constructor() { }

  private getIndexFromId(id: number) : number{
    for (let i=0; i < this.views.length; i++) {
      if (this.views[i].id === id) {
          return i;
      }
    }
  }

  getViews() : View[]{
    console.log(this.views)
    return this.views.slice();
  }

  getView(id: number) : View{
    let index = this.getIndexFromId(id);
    return this.views[index];
  }

  addView(view: View) : number{ //can't know id yet
    this.views.push(new View(this.views.length, view.name));
    this.viewsChange();
    console.log(this.views)
    return this.views.length - 1;
  };

  updateView(id: number, view: View) : number {
    if (id) {
      let index = this.getIndexFromId(id);
      this.views[index] = new View(id, view.name);
      this.viewsChange();
    } else {
      return this.addView(view);
    }
  }

  private viewsChange(){
    this.viewsChanged.next(this.views.slice());
  }
}
