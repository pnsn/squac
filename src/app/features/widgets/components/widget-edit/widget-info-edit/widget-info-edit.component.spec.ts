import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetInfoEditComponent } from './widget-info-edit.component';

describe('WidgetInfoEditComponent', () => {
  let component: WidgetInfoEditComponent;
  let fixture: ComponentFixture<WidgetInfoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetInfoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
