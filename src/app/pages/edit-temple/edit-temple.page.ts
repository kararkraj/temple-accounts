import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonItem, IonIcon, IonLabel, IonItemDivider, IonItemGroup, IonGrid, IonRow, IonCol, IonBackButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { AddTemplePage } from '../add-temple/add-temple.page';
import { Temple, TempleRequest } from 'src/app/interfaces/temple';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-temple',
    templateUrl: './../add-temple/add-temple.page.html',
    styleUrls: ['./../add-temple/add-temple.page.scss'],
    standalone: true,
    imports: [IonCol, IonRow, IonGrid, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonIcon, IonItem, IonItemGroup, IonItemDivider, IonLabel, IonBackButton, IonSelect, IonSelectOption]
})
export class EditTemplePage extends AddTemplePage implements OnInit {

    private temple!: Temple;
    router = inject(Router);

    override async ngOnInit() {
        this.title = "Edit Temple";
        try {
            const temple = await this.templeService.getTempleById(this.templeId);
            this.patchTempleForm(temple);
            this.temple = temple;
        } catch (err: any) {
            this.toaster.presentToast({ message: err.code, color: "danger" });
            this.router.navigate(['tabs'], { replaceUrl: true });
        }

    }

    patchTempleForm(temple: Temple) {
        let roles = [];
        for (let user in temple.roles) {
            if (temple.roles[user] != 'owner') {
                this.addUser();
                roles.push({ email: user, role: temple.roles[user] });
            }
        }
        this.templeForm.patchValue({
            name: temple.name,
            address: temple.address,
            roles: roles
        });
    }

    override async onSubmit() {
        if ((this.templeForm.valid && this.templeForm.dirty) || (Object.keys(this.temple.roles).length !== this.roles.length + 1 && this.roles.valid)) {
            const updatedTempleFields: Partial<TempleRequest> = {}
            this.templeForm.get('name')?.dirty ? updatedTempleFields.name = this.templeForm.get('name')?.value : null;
            this.templeForm.get('address')?.dirty ? updatedTempleFields.address = this.templeForm.get('address')?.value : null;

            if (Object.keys(this.temple.roles).length !== this.roles.length + 1 || this.roles.dirty) {
                updatedTempleFields.roles = {};
                this.roles.value.forEach(role => updatedTempleFields.roles = { [role.email]: role.role });
                for (let email in this.temple.roles) {
                    if (this.temple.roles[email] === 'owner') {
                        updatedTempleFields.roles[email] = 'owner';
                    }
                }
            }

            try {
                const updatedFields = await this.templeService.updateTemple(this.templeId, updatedTempleFields);
                this.temple = {
                    ...this.temple,
                    ...updatedFields
                }
                this.toaster.presentToast({ message: 'Temple was updated successfully!', color: 'success' });
            } catch (e: any) {
                this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
                console.error("Error updating document: ", e);
            } finally {
                this.resetForm();
            }
        } else if (!this.templeForm.valid) {
            this.templeForm.markAllAsTouched();
        } else {
            await this.toaster.presentToast({ message: "Nothing to update.", color: "success" });
        }
    }

    override resetForm() {
        this.roles.clear();
        this.templeForm.reset();
        this.patchTempleForm(this.temple);
    }

}
