import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplesPage } from './temples.page';

describe('TemplesPage', () => {
  let component: TemplesPage;
  let fixture: ComponentFixture<TemplesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
