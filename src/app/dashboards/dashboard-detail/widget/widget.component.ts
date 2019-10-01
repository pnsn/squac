import { Component, OnInit, Input } from '@angular/core';
import { Widget } from '../../widget';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  @Input() widget: Widget;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

  }


  editWidget() {
    this.router.navigate(['widget', this.widget.id, 'edit'], {relativeTo: this.route});
  }
}
