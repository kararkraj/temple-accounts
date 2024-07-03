import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTemplesPage } from './view-temples.page';

describe('ViewTemplesPage', () => {
  let component: ViewTemplesPage;
  let fixture: ComponentFixture<ViewTemplesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTemplesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
