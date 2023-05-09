import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GMapsHeatlayerComponent } from './g-maps-heatlayer.component';

describe('GMapsHeatlayerComponent', () => {
  let component: GMapsHeatlayerComponent;
  let fixture: ComponentFixture<GMapsHeatlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GMapsHeatlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GMapsHeatlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
