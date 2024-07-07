import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { EditTemplePage } from './edit-temple.page';
import { DataService } from 'src/app/services/data.service';
import { of, throwError } from 'rxjs';
import { Temple } from 'src/app/interfaces/temple';
import { ToasterService } from 'src/app/services/toaster.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular/standalone';

const errorMessage = "invalid temple id";
const temple: Temple = {
    id: 1,
    address: "chamundi hills mysore",
    name: "sri chamundeshwari temple"
}
const dataServiceStub: Partial<DataService> = {
    getTempleById: (templeId: number) => templeId === temple.id ? of(temple) : throwError(() => errorMessage),
    updateTemple: (temple: Temple) => of(temple)
}

describe('EditTemplePage', () => {
    let component: EditTemplePage;
    let fixture: ComponentFixture<EditTemplePage>;

    let router: Router;
    let toaster: ToasterService;
    let dataService: DataService;

    const loader = jasmine.createSpyObj('LoadingController', ['create']);
    const fakeLoadingObject = jasmine.createSpyObj('FakeLoadingObject', ['present', 'dismiss']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                { provide: DataService, useValue: dataServiceStub },
                { provide: LoadingController, useValue: loader }
            ]
        });
        fixture = TestBed.createComponent(EditTemplePage);
        component = fixture.componentInstance;

        router = fixture.debugElement.injector.get(Router);
        toaster = fixture.debugElement.injector.get(ToasterService);
        dataService = fixture.debugElement.injector.get(DataService);
    });

    it("should set title to Edit Temple and canEdit to true", () => {
        fixture.detectChanges();
        expect(component.title).toEqual("Edit Temple");
        expect(component.canEdit).toBeTrue();
    })

    describe("When temple Id is invalid", () => {
        const invalidTempleId = 201;

        it('should present error toast and navigate to tabs/temples', () => {
            component.templeId = invalidTempleId;
            const toasterSpy = spyOn<any, any>(toaster, 'presentToast');
            const routerSpy = spyOn<any, any>(router, 'navigate');
            fixture.detectChanges();

            expect(toasterSpy).toHaveBeenCalledWith({ message: errorMessage, color: "danger" });
            expect(routerSpy).toHaveBeenCalledWith(['tabs/temples']);
        });
    });

    describe("When temple Id is valid", () => {
        beforeEach(() => {
            component.templeId = temple.id;
        });

        it('should assign temple variable and patch the form with default temple values', () => {
            const getTempleByIdSpy = spyOn(dataService, 'getTempleById').and.callThrough();
            fixture.detectChanges();

            expect(getTempleByIdSpy).toHaveBeenCalledOnceWith(temple.id);
            expect(component["temple"]).toEqual(temple);
            expect(component.templeForm.get("name")?.value).toEqual(temple.name);
            expect(component.templeForm.get("address")?.value).toEqual(temple.address);
        });

        describe("OnSubmit", () => {

            beforeEach(() => {
                fixture.detectChanges();
            });

            describe("When form is not modified and valid", () => {
                it("should show a toaster with message - Nothing to update.", () => {
                    const toasterSpy = spyOn<any, any>(toaster, 'presentToast');
                    const updateTempleSpy = spyOn<any, any>(dataService, 'updateTemple');
                    component.onSubmit();

                    expect(updateTempleSpy).toHaveBeenCalledTimes(0);
                    expect(toasterSpy).toHaveBeenCalledOnceWith({ message: "Nothing to update.", color: "success" });
                });
            });

            describe("When form is modified and invalid", () => {
                it("should mark all form controls as touched.", () => {
                    component.templeForm.patchValue({ name: "" });
                    const updateTempleSpy = spyOn<any, any>(dataService, 'updateTemple');
                    const formSpy = spyOn<any, any>(component.templeForm, 'markAllAsTouched');
                    component.onSubmit();

                    expect(updateTempleSpy).toHaveBeenCalledTimes(0);
                    expect(formSpy).toHaveBeenCalledTimes(1);
                });
            });

            describe("When form is modified and valid", () => {
                it("should show loader, update the temple and reset the form with updated default values.", fakeAsync(() => {
                    const updatedTemple = { ...temple, name: "Updated chamundi temple" };
                    component.templeForm.patchValue(updatedTemple);
                    component.templeForm.markAsDirty();

                    const toasterSpy = spyOn<any, any>(toaster, 'presentToast');
                    const resetFormSpy = spyOn<any, any>(component, 'resetForm');
                    const updateTempleSpy = spyOn<any, any>(dataService, 'updateTemple').and.callThrough();

                    loader.create.and.returnValue(fakeLoadingObject);

                    component.onSubmit();
                    flush();

                    expect(loader.create).toHaveBeenCalledTimes(1);
                    expect(fakeLoadingObject.present).toHaveBeenCalledTimes(1);
                    expect(updateTempleSpy).toHaveBeenCalledOnceWith(updatedTemple);
                    expect(component["temple"]).toEqual(updatedTemple);
                    expect(toasterSpy).toHaveBeenCalledOnceWith({ message: 'Temple was updated successfully!', color: 'success' });
                    expect(resetFormSpy).toHaveBeenCalledTimes(1);
                    expect(fakeLoadingObject.dismiss).toHaveBeenCalledTimes(1);
                }));
            });
        });

        it('OnReset should reset the form values', () => {
            fixture.detectChanges();
            const name = "updated name";
            const address = "updated address";
            component.templeForm.patchValue({ name, address });
            component.templeForm.markAllAsTouched()
            component.templeForm.markAsDirty();
            expect(component.templeForm.get("name")?.value).toEqual(name);
            expect(component.templeForm.get("address")?.value).toEqual(address);
            component.resetForm();

            expect(component.templeForm.get("name")?.value).toEqual(temple.name);
            expect(component.templeForm.get("address")?.value).toEqual(temple.address);
            expect(component.templeForm.dirty).toBeFalse();
            expect(component.templeForm.touched).toBeFalse();
        });
    });
});