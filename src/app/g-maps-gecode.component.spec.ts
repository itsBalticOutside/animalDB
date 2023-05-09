import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GMapsGecodeComponent } from './g-maps-gecode.component';

describe('GMapsGecodeComponent', () => {
  let component: GMapsGecodeComponent;
  let fixture: ComponentFixture<GMapsGecodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GMapsGecodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GMapsGecodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
