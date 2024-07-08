import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharityTypesPage } from './charity-types.page';

describe('CharityTypesPage', () => {
  let component: CharityTypesPage;
  let fixture: ComponentFixture<CharityTypesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
