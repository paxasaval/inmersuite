import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLabComponent } from './register-lab.component';

describe('RegisterLabComponent', () => {
  let component: RegisterLabComponent;
  let fixture: ComponentFixture<RegisterLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterLabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
