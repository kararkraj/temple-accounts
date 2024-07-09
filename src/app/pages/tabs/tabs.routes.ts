import { Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

export const TABS_ROUTES: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: '',
                redirectTo: 'add-entry',
                pathMatch: 'full'
            },
            {
                path: 'add-entry',
                loadComponent: () => import('./../add-entry/add-entry.page').then(m => m.AddEntryPage)
            },
            {
                path: 'temples',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./../temples/temples.page').then(m => m.TemplesPage),
                    },
                    {
                        path: 'add',
                        loadComponent: () => import('./../add-temple/add-temple.page').then(m => m.AddTemplePage)
                    },
                    {
                        path: 'edit/:templeId',
                        loadComponent: () => import('../edit-temple/edit-temple.page').then(m => m.EditTemplePage)
                    },
                    {
                        path: 'view/:templeId',
                        loadComponent: () => import('../view-temple/view-temple.page').then(m => m.ViewTemplePage)
                    }
                ]
            },
            {
              path: 'services',
              children: [
                {
                    path: '',
                    loadComponent: () => import('./../charity-types/charity-types.page').then( m => m.CharityTypesPage)
                },
                {
                    path: 'add',
                    loadComponent: () => import('./../add-charity-type/add-charity-type.page').then(m => m.AddCharityTypePage)
                },
                {
                    path: 'edit/:charityTypeId',
                    loadComponent: () => import('./../edit-charity-type/edit-charity-type.page').then(m => m.EditCharityTypePage)
                }
              ]
            },
            {
                path: 'entries',
                loadComponent: () => import('./../entries/entries.page').then(m => m.EntriesPage)
            },
            {
                path: '**',
                pathMatch: "full",
                redirectTo: 'add-entrys'
            }
        ]
    }
]