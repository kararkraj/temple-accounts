import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTemplePage } from './add-temple.page';

describe('AddTemplePage', () => {
  let component: AddTemplePage;
  let fixture: ComponentFixture<AddTemplePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTemplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
