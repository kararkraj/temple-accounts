import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonItem, IonIcon, IonLabel, IonItemDivider, IonItemGroup, IonGrid, IonRow, IonCol, IonBackButton } from '@ionic/angular/standalone';
import { AddTemplePage } from './add-temple.page';
import { Temple } from 'src/app/interfaces/temple';
import { Router } from '@angular/router';

@Component({
    selector: 'app-view-temple',
    templateUrl: './add-temple.page.html',
    styleUrls: ['./add-temple.page.scss'],
    styles: [`
        .input-disabled, .textarea-disabled {
            opacity: 0.8;
        }
    `],
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
export class ViewTemplePage extends AddTemplePage implements OnInit {

    private temple!: Temple;
    router = inject(Router);

    override ngOnInit(): void {
        this.title = "View Temple";
        this.canEdit = false;
        this.dataService.getTempleById(this.templeId).subscribe({
            next: temple => {
                for (let i = 1; i < temple.services.length; i++) {
                    this.addNewService();
                }
                this.temple = temple;
                this.templeForm.patchValue(temple);
                this.templeForm.disable();
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
                    this.toaster.presentToast({ message: 'Temple was updated successfully!', color: 'success' });
                    this.resetForm(temple);
                    loader.dismiss();
                }
            })
        } else {
            this.templeForm.markAllAsTouched();
        }
    }

    override resetForm(temple?: Temple) {
        for (let i = this.services.length; i < this.temple.services.length; i++) {
            this.addNewService();
        }
        this.templeForm.reset(temple ? temple : this.temple);
    }

}
