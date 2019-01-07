import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyOptionsComponent } from './apply-options.component';

describe('ApplyOptionsComponent', () => {
  let component: ApplyOptionsComponent;
  let fixture: ComponentFixture<ApplyOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
