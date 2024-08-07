import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonItem, IonIcon, IonLabel, IonItemDivider, IonItemGroup, IonGrid, IonRow, IonCol, IonBackButton } from '@ionic/angular/standalone';
import { AddTemplePage } from '../add-temple/add-temple.page';
import { Router } from '@angular/router';

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

    router = inject(Router);

    override async ngOnInit() {
        this.title = "View Temple";
        this.canEdit = false;
        try {
            const temple = await this.templeService.getTempleById(this.templeId)
            this.templeForm.patchValue(temple);
            this.templeForm.disable();
        } catch (err: any) {
            this.toaster.presentToast({ message: err.code, color: "danger" });
            this.router.navigate(['tabs/temples']);
        }
    }
}
