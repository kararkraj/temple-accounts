import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonItem, IonIcon, IonLabel, IonItemDivider, IonItemGroup, IonGrid, IonRow, IonCol, IonBackButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { AddTemplePage } from '../add-temple/add-temple.page';
import { Router } from '@angular/router';
import { Temple } from 'src/app/interfaces/temple';

@Component({
    selector: 'app-view-temple',
    templateUrl: './../add-temple/add-temple.page.html',
    styleUrls: ['./../add-temple/add-temple.page.scss'],
    styles: [`
        .input-disabled, .textarea-disabled {
            opacity: 0.8;
        }
    `],
    standalone: true,
    imports: [IonCol, IonRow, IonGrid, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonIcon, IonItem, IonItemGroup, IonItemDivider, IonLabel, IonBackButton, IonSelect, IonSelectOption]
})
export class ViewTemplePage extends AddTemplePage implements OnInit {

    router = inject(Router);

    override async ngOnInit() {
        this.title = "View Temple";
        this.canEdit = false;
        try {
            const temple = await this.templeService.getTempleById(this.templeId)
            this.patchTempleForm(temple);
            this.templeForm.disable();
        } catch (err: any) {
            this.toaster.presentToast({ message: err.code, color: "danger" });
            this.router.navigate(['tabs/temples']);
        }
    }

    patchTempleForm(temple: Temple) {
        let roles = [];
        for (let user in temple.roles) {
            if (temple.roles[user] != 'owner') {
                roles.push({ email: user });
            }
        }
        this.templeForm.patchValue({
            name: temple.name,
            address: temple.address,
            roles: roles
        })
    }
}
