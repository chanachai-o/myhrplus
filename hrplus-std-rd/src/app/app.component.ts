import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterModule } from '@angular/router';
import { SpinnerComponent } from './ess-layout/shared/spinner.component';
import { L10n } from '@syncfusion/ej2-base';
L10n.load({
  'en-US': {
    'pager': {
      'currentPageInfo': '',
      'totalItemInfo': '{0} Item',
      'pagerDropDown': 'Items',
      'totalItemsInfo': '{0} Items',
    }
  },
  'th-TH': {
    // 'pivotview': {
    //   'grandTotal': 'รวมทั้งหมดของ',
    //   "subTotal": "รวมย่อยของ",
    //   'sum': 'ผลรวมของ',
    //   'count': 'นับของ',
    //   'average': 'ค่าเฉลี่ยของ',
    // },
    'grid': {
      'EmptyRecord': 'ไม่มีข้อมูลที่จะแสดง',
      'Item': '1 รายการ',
      'Items': '{0} รายการ'
    },
    'pager': {
      'All': 'ทั้งหมด',
      'pagerAllDropDown': 'รายการ',
      'currentPageInfo': '',
      'totalItemsInfo': '{0} รายการ',
      'totalItemInfo': '{0} รายการ',
      'totalRecordsInfo': '{0} รายการ',
      'firstPageTooltip': 'หน้าแรก',
      'lastPageTooltip': 'หน้าสุดท้าย',
      'nextPageTooltip': 'ถัดไป',
      'previousPageTooltip': 'ก่อนหน้า',
      'nextPagerTooltip': 'ถัดไป',
      'previousPagerTooltip': 'ก่อนหน้า',
      'pageInput': '{0}',
      'page': 'หน้า',
      'pagerDropDown': 'รายการ',
      'pagerAll': 'ทั้งหมด',
      'pageSize': 'รายการต่อหน้า',
      'pageSizeAll': 'ทั้งหมด',
      'pageCount': 'จำนวนหน้า',
      'pageCountAll': 'ทั้งหมด'
    }
  }
});
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, SpinnerComponent]
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Router Event: NavigationStart', event.url);
      } else if (event instanceof NavigationEnd) {
        console.log('Router Event: NavigationEnd', event.url);
      } else if (event instanceof NavigationCancel) {
        console.log('Router Event: NavigationCancel', event.url, event.reason);
      } else if (event instanceof NavigationError) {
        console.error('Router Event: NavigationError', event.url, event.error);
      }
    });
  }
}
