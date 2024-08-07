import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonItem, IonIcon, IonLabel, IonItemDivider, IonItemGroup, IonGrid, IonRow, IonCol, IonBackButton } from '@ionic/angular/standalone';
import { AddTemplePage } from '../add-temple/add-temple.page';
import { Temple } from 'src/app/interfaces/temple';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-temple',
    templateUrl: './../add-temple/add-temple.page.html',
    styleUrls: ['./../add-temple/add-temple.page.scss'],
    standalone: true,
    imports: [IonCol, IonRow, IonGrid,
        CommonModule,
        ReactiveFormsModule,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButton,
        IonTextarea,
        IonInput,
        IonButtons,
        IonMenuButton,
        IonIcon,
        IonItem,
        IonItemGroup,
        IonItemDivider,
        IonLabel,
        IonBackButton
    ]
})
export class EditTemplePage extends AddTemplePage implements OnInit {

    private temple!: Temple;
    router = inject(Router);

    override async ngOnInit() {
        this.title = "Edit Temple";
        try {
            const temple = await this.templeService.getTempleById(this.templeId)
            this.templeForm.patchValue(temple)
            this.temple = temple;
        } catch (err: any) {
            this.toaster.presentToast({ message: err.code, color: "danger" });
            this.router.navigate(['tabs'], { replaceUrl: true });
        }

    }

    override async onSubmit() {
        if (this.templeForm.valid && this.templeForm.dirty) {
            const loader = await this.loader.create({ message: 'Updating temple...' });
            await loader.present();

            const updatedTempleFields: Partial<Temple> = {}
            this.templeForm.get('name')?.dirty ? updatedTempleFields.name = this.templeForm.get('name')?.value : null;
            this.templeForm.get('address')?.dirty ? updatedTempleFields.address = this.templeForm.get('address')?.value : null;

            try {
                const temple = await this.templeService.updateTemple(this.templeId, updatedTempleFields);
                this.temple = { ...this.temple, ...temple };
                this.toaster.presentToast({ message: 'Temple was updated successfully!', color: 'success' });
            } catch (e: any) {
                this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
                console.error("Error updating document: ", e);
              } finally {
                this.resetForm();
                loader.dismiss();
              }


        } else if (!this.templeForm.valid) {
            this.templeForm.markAllAsTouched();
        } else {
            await this.toaster.presentToast({ message: "Nothing to update.", color: "success" });
        }
    }

    override resetForm() {
        this.templeForm.reset(this.temple);
    }

}
