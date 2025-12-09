import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLoader } from './main-loader';

describe('MainLoader', () => {
  let component: MainLoader;
  let fixture: ComponentFixture<MainLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLoader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
