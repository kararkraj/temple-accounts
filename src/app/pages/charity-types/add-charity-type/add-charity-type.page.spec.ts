import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCharityTypePage } from './add-charity-type.page';

describe('AddCharityTypePage', () => {
  let component: AddCharityTypePage;
  let fixture: ComponentFixture<AddCharityTypePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCharityTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
