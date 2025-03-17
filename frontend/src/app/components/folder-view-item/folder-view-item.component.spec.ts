import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderViewItemComponent } from './folder-view-item.component';

describe('FolderViewItemComponent', () => {
  let component: FolderViewItemComponent;
  let fixture: ComponentFixture<FolderViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FolderViewItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
