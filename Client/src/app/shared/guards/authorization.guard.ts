import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { inject } from '@angular/core';

export const authorizationGuard: CanActivateFn = (route, state) => {
  //renderer = rendererFactory.createRenderer(null, null);
  const router = inject(Router);

  const localData = localStorage.getItem(environment.userKey);
  if (localData) {
    return true;
  } else {
    //sharedService.showNotification(false, 'You are unauthorized', 'Please login !');
    //notify.openModal(false, 'You are unauthorized', 'Please login !');
    router.navigateByUrl('/account/login');
    return false;
  }
};
