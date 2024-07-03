import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEntryPage } from './add-entry.page';

describe('AddEntryPage', () => {
  let component: AddEntryPage;
  let fixture: ComponentFixture<AddEntryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
