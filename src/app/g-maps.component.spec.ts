import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GMapsComponent } from './g-maps.component';

describe('GMapsComponent', () => {
  let component: GMapsComponent;
  let fixture: ComponentFixture<GMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GMapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
