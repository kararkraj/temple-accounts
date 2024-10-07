import { Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";
import { canActivateTabs } from "src/app/guard/auth.guard";

export const TABS_ROUTES: Routes = [
    {
        path: '',
        component: TabsPage,
        canActivateChild: [canActivateTabs],
        children: [
            {
                path: '',
                redirectTo: 'add-entry',
                pathMatch: 'full'
            },


            // Entries routes -----------------------------------------------------------------------------
            {
                path: 'entries',
                loadComponent: () => import('./../entries/entries.page').then(m => m.EntriesPage),
            },
            {
                path: 'edit-entry/:entryId',
                loadComponent: () => import('./../edit-entry/edit-entry.page').then(m => m.EditEntryPage)
            },
            {
                path: 'add-entry',
                loadComponent: () => import('./../add-entry/add-entry.page').then(m => m.AddEntryPage)
            },


            // Temples routes -----------------------------------------------------------------------------
            {
                path: 'temples',
                loadComponent: () => import('./../temples/temples.page').then(m => m.TemplesPage),
            },
            {
                path: 'temples/add',
                loadComponent: () => import('./../add-temple/add-temple.page').then(m => m.AddTemplePage)
            },{
                path: 'temples/edit/:templeId',
                loadComponent: () => import('../edit-temple/edit-temple.page').then(m => m.EditTemplePage)
            },
            {
                path: 'temples/view/:templeId',
                loadComponent: () => import('../view-temple/view-temple.page').then(m => m.ViewTemplePage)
            },


            // Services routes ----------------------------------------------------------------------------
            {
                path: 'services',
                loadComponent: () => import('./../charity-types/charity-types.page').then(m => m.CharityTypesPage),
            },
            {
                path: 'services/add',
                loadComponent: () => import('./../add-charity-type/add-charity-type.page').then(m => m.AddCharityTypePage)
            },
            {
                path: 'services/edit/:charityTypeId',
                loadComponent: () => import('./../edit-charity-type/edit-charity-type.page').then(m => m.EditCharityTypePage)
            },



            {
                path: '**',
                pathMatch: "full",
                redirectTo: 'add-entry'
            }
        ]
    }
]