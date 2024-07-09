import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { AddTemplePage } from './add-temple.page';
import { Temple } from 'src/app/interfaces/temple';
import { LoadingController } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';
import { TempleService } from 'src/app/services/temple.service';

const temple: Temple = {
  id: 1,
  address: "chamundi hills mysore",
  name: "sri chamundeshwari temple"
}
const templeServiceStub: Partial<TempleService> = {
  addTemple: (temple) => of(temple)
}

describe('AddTemplePage', () => {
  let component: AddTemplePage;
  let fixture: ComponentFixture<AddTemplePage>;

  let loader: LoadingController;
  let templeService: TempleService;
  let toaster: ToasterService;

  const loadingObj = jasmine.createSpyObj('LoadingObj', ['present', 'dismiss']);
  
  beforeEach(async () => {
    const loadingController = jasmine.createSpyObj('LoadingController', ['create']);
    loadingController.create.and.returnValue(loadingObj);
    
    await TestBed.configureTestingModule({
      providers: [
        { provide: TempleService, useValue: templeServiceStub },
        { provide: LoadingController, useValue: loadingController }
      ]
    });

    fixture = TestBed.createComponent(AddTemplePage);
    component = fixture.componentInstance;

    loader = fixture.debugElement.injector.get(LoadingController);
    templeService = fixture.debugElement.injector.get(TempleService);
    toaster = fixture.debugElement.injector.get(ToasterService);

    fixture.detectChanges();
  });

  it('should set title to Add Temple and canEdit to true', () => {
    expect(component).toBeTruthy();
    expect(component.title).toEqual("Add Temple");
    expect(component.canEdit).toBeTrue();
  });

  it('OnSubmit should mark form as touched if the form is invalid', () => {
    const markAllAsTouchedSpy = spyOn(component.templeForm, 'markAllAsTouched');
    component.onSubmit();

    expect(markAllAsTouchedSpy).toHaveBeenCalledTimes(1);
  });

  it('OnSubmit should present loader, call TempleService.addTemple, present success toaster, reset the form and dismiss the loader', fakeAsync(() => {
    const addTempleSpy = spyOn(templeService, 'addTemple').and.callThrough();
    const presentToastSpy = spyOn(toaster, 'presentToast');
    const resetFormSpy = spyOn(component, 'resetForm');
    
    component.templeForm.patchValue(temple);
    component.onSubmit();

    flush();

    expect(loader.create).toHaveBeenCalledWith({ message: 'Adding temple...' });
    expect(loadingObj.present).toHaveBeenCalledTimes(1);
    expect(addTempleSpy).toHaveBeenCalledOnceWith({ id: 0,name: temple.name, address: temple.address });
    expect(presentToastSpy).toHaveBeenCalledOnceWith({ message: 'Temple was added successfully!', color: 'success' });
    expect(resetFormSpy).toHaveBeenCalledTimes(1);
    expect(loadingObj.dismiss).toHaveBeenCalledTimes(1);
  }));

  it('OnReset should reset the form values', () => {
    component.templeForm.patchValue(temple);
    component.templeForm.markAllAsTouched()
    component.templeForm.markAsDirty();
    expect(component.templeForm.get("name")?.value).toEqual(temple.name);
    expect(component.templeForm.get("address")?.value).toEqual(temple.address);
    const detectChangesSpy = spyOn(component["cdr"], 'detectChanges');
    component.resetForm();
    
    expect(component.templeForm.get("name")?.value).toBeNull();
    expect(component.templeForm.get("address")?.value).toBeNull();
    expect(component.templeForm.dirty).toBeFalse();
    expect(component.templeForm.touched).toBeFalse();
    expect(detectChangesSpy).toHaveBeenCalledTimes(1);
  });
});
