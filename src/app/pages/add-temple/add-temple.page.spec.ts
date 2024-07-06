import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { AddTemplePage } from './add-temple.page';
import { Temple } from 'src/app/interfaces/temple';
import { DataService } from 'src/app/services/data.service';
import { LoadingController } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';

const temple: Temple = {
  id: 1,
  address: "chamundi hills mysore",
  name: "sri chamundeshwari temple"
}
const dataServiceStub: Partial<DataService> = {
  addTemple: (temple) => of(temple)
}

describe('AddTemplePage', () => {
  let component: AddTemplePage;
  let fixture: ComponentFixture<AddTemplePage>;

  let loader: LoadingController;
  let dataService: DataService;
  let toaster: ToasterService;

  const loadingObj = jasmine.createSpyObj('LoadingObj', ['present', 'dismiss']);
  
  beforeEach(async () => {
    const loadingController = jasmine.createSpyObj('LoadingController', ['create']);
    loadingController.create.and.returnValue(loadingObj);
    
    await TestBed.configureTestingModule({
      providers: [
        { provide: DataService, useValue: dataServiceStub },
        { provide: LoadingController, useValue: loadingController }
      ]
    });

    fixture = TestBed.createComponent(AddTemplePage);
    component = fixture.componentInstance;

    loader = fixture.debugElement.injector.get(LoadingController);
    dataService = fixture.debugElement.injector.get(DataService);
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

  it('OnSubmit should present loader, call DataService.addTemple, present success toaster, reset the form and dismiss the loader', fakeAsync(() => {
    const addTempleSpy = spyOn(dataService, 'addTemple').and.callThrough();
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
});
