import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountActionsPage } from './account-actions.page';

describe('AccountActionsPage', () => {
  let component: AccountActionsPage;
  let fixture: ComponentFixture<AccountActionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
