import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCharityTypePage } from './edit-charity-type.page';

describe('EditCharityTypePage', () => {
  let component: EditCharityTypePage;
  let fixture: ComponentFixture<EditCharityTypePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCharityTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
