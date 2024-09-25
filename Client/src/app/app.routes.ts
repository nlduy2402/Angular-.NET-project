import { Routes } from '@angular/router';

import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import HomeComponent from './home/home.component';
import { PlayComponent } from './play/play.component';
import { authorizationGuard } from './shared/guards/authorization.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'play',
    component: PlayComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [authorizationGuard],
  },
  // implements lazy loading
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];
