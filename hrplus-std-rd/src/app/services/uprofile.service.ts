import { Injectable } from '@angular/core';
import { AuthState } from '@myhr/auth/src';
import { selectUser } from '@myhr/auth/src/lib/+state/auth.selectors';
import { User } from '@myhr/data-models';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { EmployeeService } from './employee.service';
import { MyUProfile, UProfile } from '../models/globals/uprofile.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private uprofile: Observable<UProfile>;
  private empProfile: Observable<UProfile>;

  constructor(private store: Store<AuthState>,
    private employeeService: EmployeeService) {
      // console.log("UserProfileService");
      this.uprofile = this.store.select(selectUser).pipe(
         switchMap((user: User) =>
           this.employeeService.getWorkInformation()
             .pipe(
               //  tap(d=>console.log("load user" , d)),
                filter(workings => workings.employeeId == user.employeeid),
             )
         ),
         map(working=> new MyUProfile(working))
       );

  }

  getEmpProfile(empid): Observable<UProfile>{
    let empData = this.employeeService.getWorkInformation().pipe(
          filter(workings => workings.employeeId == empid),
          map(xx => new MyUProfile(xx))
        );

        empData.subscribe(x => console.log(x))

    return empData;
  }

  getUProfile(): Observable<UProfile>{
    return this.uprofile;
  }
}
