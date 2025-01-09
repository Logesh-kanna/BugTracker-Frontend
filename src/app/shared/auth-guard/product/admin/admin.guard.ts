import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/service/common/local-storage/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  admin: string = "";
  constructor(private storage: LocalStorageService, private router: Router) {
    const storedData = this.storage.getData('user');
    this.admin = storedData.data[0] ? storedData.data[0]['role'] : null;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.admin == "admin") {
      this.router.navigate(['/bugtracker/signin']);
      return false;
    }
    return true;
  }

}
