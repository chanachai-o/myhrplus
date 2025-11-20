import {
    ComponentFactory,
    ComponentFactoryResolver,
    Directive,
    ElementRef,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import { fromEvent, race, timer, zip } from "rxjs";
import { first, map, tap } from "rxjs/operators";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@Directive({
    selector: "[appShowLoading]",
    standalone: true,
})
export class ShowLoadingDirective {
    get imageElement() {
        return this.el.nativeElement;
    }

    constructor(
        private el: ElementRef<HTMLImageElement>,
        private vc: ViewContainerRef,
        private resolver: ComponentFactoryResolver
    ) {
        // const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(LoadingSpinnerComponent);
        // const componentRef = this.vc.createComponent(factory);

        const div = document.createElement("div");
        div.className = "lds-dual-ring";

        div.style.width = this.imageElement.width.toString() + "px";
        div.style.height = this.imageElement.width.toString() + "px";
        // console.log("imageElement", this.imageElement);
        this.imageElement.parentElement?.appendChild(div);

        this.imageElement.hidden = true;
        const load$ = fromEvent(this.imageElement, "load").pipe(
            map(() => true)
        );
        const error$ = fromEvent(this.imageElement, "error").pipe(
            map(() => false)
        );

        const loaded$ = race(load$, error$);
        const delay$ = timer(500);
        zip(loaded$, delay$)
            .pipe(
                first(),
                tap(([isSuccess]) => {
                    if (isSuccess) {
                        this.imageElement.hidden = false;
                        div.remove();
                        //   componentRef.destroy();
                    } else {
                        this.imageElement.hidden = false;
                        if (this.imageElement.alt == 'news' || this.imageElement.alt == 'img') {
                            this.imageElement.src = "../assets/images/noimg.png";
                        } else {
                            this.imageElement.src = "../assets/images/users/defaultperson.jpg";
                        }
                        //   this.imageElement.style.filter = 'brightness(0)';
                        div.remove();
                        //   componentRef.destroy();
                    }
                })
            )
            .subscribe();
    }
}
