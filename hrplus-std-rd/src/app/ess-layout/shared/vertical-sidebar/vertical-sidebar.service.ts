import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { RouteInfo } from "./vertical-sidebar.metadata";
import { ROUTES } from "./vertical-menu-items";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

export interface ConfigModel {
  code: string;
  tName: string;
  eName: string;
}
@Injectable({
  providedIn: "root",
})
export class VerticalSidebarService {
  public screenWidth: any;
  public collapseSidebar: boolean = false;
  public fullScreen: boolean = false;

  MENUITEMS: RouteInfo[] = ROUTES;
  configMenuList: ConfigModel[] | undefined;

  items = new BehaviorSubject<RouteInfo[]>(this.MENUITEMS);

  constructor(private http: HttpClient) {
    this.http
      .get<ConfigModel[]>(environment.jbossUrl + "/capi/config/menu/emv_menu")
      .subscribe((result) => {
        this.configMenuList = result;
        this.configMenuList?.forEach((items) => {
          console.log("config", items);
          for (let i = 0; i < this.MENUITEMS.length; i++) {
            console.log("link", this.MENUITEMS[i]);

            if (items.code == this.MENUITEMS[i].code) {
              this.MENUITEMS[i].show = true;
            }

            for (let j = 0; j < this.MENUITEMS[i].submenu.length; j++) {
              if (items.code == this.MENUITEMS[i].submenu[j].code) {
                this.MENUITEMS[i].submenu[j].show = true;
              }
            }
          }
        });
        console.log("menuitems", this.MENUITEMS);
      });
  }
}
