import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupsComponent } from './edit-groups.component';

describe('EditGroupsComponent', () => {
  let component: EditGroupsComponent;
  let fixture: ComponentFixture<EditGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
