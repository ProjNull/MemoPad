import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteViewItemComponent } from './note-view-item.component';

describe('NoteViewItemComponent', () => {
  let component: NoteViewItemComponent;
  let fixture: ComponentFixture<NoteViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoteViewItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
