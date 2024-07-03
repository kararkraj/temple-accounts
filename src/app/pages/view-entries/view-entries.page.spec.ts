import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewEntriesPage } from './view-entries.page';

describe('ViewEntriesPage', () => {
  let component: ViewEntriesPage;
  let fixture: ComponentFixture<ViewEntriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEntriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
