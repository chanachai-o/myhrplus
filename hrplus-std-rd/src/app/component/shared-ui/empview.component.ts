import { OnInit, Component, HostListener } from "@angular/core";
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routeAnimations } from "src/app/ess-layout/shared/animations/route.animations";
import { IdleTimeoutService } from "src/app/services/idleTimeout.service";
import { AuthService } from "src/app/auth.service";

@Component({
    selector: "app-empview-component",
    templateUrl: "./empview.component.html",
    animations: [routeAnimations],
    standalone: true,
    imports: [RouterModule, CommonModule]

})
export class EmpviewComponent implements OnInit {
    constructor(
        private idleTimeoutSvc: IdleTimeoutService,
        private auth: AuthService
    ) {
        this.idleTimeoutSvc.timeoutExpired.subscribe((res) => {
            this.auth.logout();
        });
        this.idleTimeoutSvc.startTimer();
    }
    ngOnInit() { }

    @HostListener("document:mousemove", ["$event"])
    onMouseMove(e: any) {
        this.idleTimeoutSvc.resetTimer();
    }

    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}
