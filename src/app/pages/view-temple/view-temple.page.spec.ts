import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Temple } from 'src/app/interfaces/temple';
import { ToasterService } from 'src/app/services/toaster.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular/standalone';
import { ViewTemplePage } from './view-temple.page';
import { TempleService } from 'src/app/services/temple.service';

const errorMessage = "invalid temple id";
const temple: Temple = {
    id: 1,
    address: "chamundi hills mysore",
    name: "sri chamundeshwari temple"
}
const templeServiceStub: Partial<TempleService> = {
    getTempleById: (templeId: number) => templeId === temple.id ? of(temple) : throwError(() => errorMessage),
    updateTemple: (temple: Temple) => of(temple)
}

describe('ViewTemplePage', () => {
    let component: ViewTemplePage;
    let fixture: ComponentFixture<ViewTemplePage>;

    let router: Router;
    let toaster: ToasterService;
    let templeService: TempleService;

    const loader = jasmine.createSpyObj('LoadingController', ['create']);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                { provide: TempleService, useValue: templeServiceStub },
                { provide: LoadingController, useValue: loader }
            ]
        });
        fixture = TestBed.createComponent(ViewTemplePage);
        component = fixture.componentInstance;

        router = fixture.debugElement.injector.get(Router);
        toaster = fixture.debugElement.injector.get(ToasterService);
        templeService = fixture.debugElement.injector.get(TempleService);
    });

    it("should set title to View Temple and canEdit to false", () => {
        fixture.detectChanges();
        expect(component.title).toEqual("View Temple");
        expect(component.canEdit).toBeFalse();
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
            const getTempleByIdSpy = spyOn<any, any>(templeService, 'getTempleById').and.callThrough();
            fixture.detectChanges();

            expect(getTempleByIdSpy).toHaveBeenCalledOnceWith(temple.id);
            expect(component.templeForm.get("name")?.value).toEqual(temple.name);
            expect(component.templeForm.get("address")?.value).toEqual(temple.address);
        });
    });
});