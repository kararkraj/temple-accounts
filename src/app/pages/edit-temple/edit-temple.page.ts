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

    override ngOnInit(): void {
        this.title = "Edit Temple";
        this.dataService.getTempleById(this.templeId).subscribe({
            next: temple => {
                this.temple = temple;
                this.templeForm.patchValue(temple)
            },
            error: err => {
                this.toaster.presentToast({ message: err, color: "danger" });
                this.router.navigate(['tabs/temples']);
            }
        });
    }

    override async onSubmit() {
        if (this.templeForm.valid && this.templeForm.dirty) {
            const loader = await this.loader.create({ message: 'Updating temple...' });
            await loader.present();

            this.dataService.updateTemple({ id: this.templeId, ...this.templeForm.getRawValue() }).subscribe({
                next: (temple) => {
                    this.temple = temple;
                    this.toaster.presentToast({ message: 'Temple was updated successfully!', color: 'success' });
                    this.resetForm();
                    loader.dismiss();
                }
            })
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