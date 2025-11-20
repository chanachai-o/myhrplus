import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit,ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbDateParserFormatter, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatepickerNgbService } from 'src/app/services/datepicker-ngb.service';
import { MoliPriceService } from 'src/app/services/moliprice.service';
export interface Oliprice {
    companyId?: string
    dateId: string
    price: number
  }
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, TranslateModule],
  selector: 'app-oil-price',
  templateUrl: './oil-price.component.html',
  styleUrls: ['./oil-price.component.scss']
})
export class OilPriceComponent implements OnInit {
@ViewChild('confirmModal') confirmModal: undefined;
@ViewChild('alertModal') alertModal: undefined
  currentDate = new Date()
  editDate = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
  date = new NgbDate(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate())
  price = ""
  editPrice = ""
  pageSize = 30
  page = 1
  collectionSize = 0
  olipriceModal:Oliprice[]=[]
  pagedOliprice: Oliprice[] = []; // New property for paginated data
  selectOliprice?:Oliprice
  msg=''
  isLoading = false; // Added isLoading property
  constructor(private ngbDateParserFormatter: NgbDateParserFormatter,
    private ngbModal: NgbModal,
    private molipriceService: MoliPriceService,
    public translateService: TranslateService,
    public datepickerService: DatepickerNgbService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.isLoading = true; // Set loading to true on init
    this.molipriceService.getOliPriceList().then(response => {
        this.olipriceModal = response
        this.olipriceModal.sort((a, b) => (a.dateId > b.dateId) ? 1 : -1);
        if(this.olipriceModal.length > 0 ){
        let value =  this.olipriceModal[this.olipriceModal.length-1]
        this.editDate = new NgbDate(parseInt(value.dateId.split('-')[0]),parseInt(value.dateId.split('-')[1]),parseInt(value.dateId.split('-')[2]))
        this.editPrice = value.price.toString()
        }
        this.updatePagedData(); // Call after data is loaded
        this.isLoading = false; // Set loading to false on success
    }).catch(error => {
        this.isLoading = false; // Set loading to false on error
        // Handle error, maybe show an alert
        this.msg = error.message || 'Error loading data';
        this.ngbModal.open(this.alertModal, { centered: true, backdrop: 'static' });
    })
  }

  updatePagedData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    this.pagedOliprice = this.olipriceModal.slice(startIndex, startIndex + this.pageSize);
    this.collectionSize = this.olipriceModal.length;
  }

  onPageChange(page: number): void {
    this.page = page;
    this.updatePagedData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.page = 1; // Reset to first page
    this.updatePagedData();
  }

  checkDateFormat(date: NgbDate): boolean {
    let parseDate = this.ngbDateParserFormatter.format(date)
    let dateCheck = parseDate !== '00/00/0' ? parseDate.split('/') : []
    if (dateCheck.length == 3 && dateCheck[0].length > 0 && dateCheck[0].length <= 2 && dateCheck[1].length > 0 && dateCheck[1].length <= 2 && dateCheck[2].length > 0) {
      return true
    }
    return false
  }
  coverDate(date :string){
    return date.split('-')[2]+'-'+date.split('-')[1]+'-'+date.split('-')[0]
  }
  selectDate(data : Oliprice){
    let value =  data
    this.date = new NgbDate(parseInt(value.dateId.split('-')[0]),parseInt(value.dateId.split('-')[1]),parseInt(value.dateId.split('-')[2]))
    this.price = value.price.toString()
  }
  openOilModal(modalName: any) {
    const modalRef = this.ngbModal.open(modalName, {
      centered: true,
      size: 'lg'
    })
    modalRef.result.then(result => {

    }, reason => {
    })
  }
  openConfirmModal(){

  }
  onSubmit(){
    this.isLoading = true; // Set loading to true on submit
    let newDate = this.date.year+'-'+('0'+this.date.month).slice(-2)+'-'+('0'+this.date.day).slice(-2)
    let body: Oliprice ={
        companyId: undefined,
        dateId:newDate.toString(),
        price:parseFloat(this.price),
    }
    this.selectOliprice = body
    this.msg = this.translateService.currentLang == 'th' ? 'ต้องการบันทึกข้อมูลหรือไม่ ?' : 'Do you want to save data or not?'
    this.ngbModal.open(this.confirmModal, {
        centered: true,
        backdrop: 'static'
    }).result.then(() => {
        this.saveOliPrice()
        },(reason) => {},
    );
  }

  deleteOilPrice(item :Oliprice){
    this.isLoading = true; // Set loading to true on delete
    this.msg = this.translateService.currentLang == 'th' ? 'ต้องการลบข้อมูลหรือไม่ ?' : 'Do you want to Delete data or not?'
    this.ngbModal.open(this.confirmModal, {
        centered: true,
        backdrop: 'static'
    }).result.then(() => {
        this.molipriceService.deleteOliprice(item).subscribe(result => {
            this.msg = this.translateService.currentLang == 'th' ? 'ลบข้อมูลเรียบร้อย' : 'Delete data successfully.'
            this.ngbModal.open(this.alertModal,{
                centered: true,
                backdrop: 'static'
            }).result.then(
                (result) => {},
                (reason) => {
                    if(reason == 'Close'){
                        setTimeout(() => {
                            this.ngOnInit();
                          }, 500)
                    }
                },
            );
            this.isLoading = false; // Set loading to false on success
          }, error => {
            this.msg = error.error.error
            this.ngbModal.open(this.alertModal, {
                centered: true,
                backdrop: 'static'
            })
            this.isLoading = false; // Set loading to false on error
          })
        },(reason) => {},
    );
  }
  saveOliPrice(){
  this.molipriceService.postOliprice(this.selectOliprice).then(result => {
      this.msg = this.translateService.instant(result.message);
      this.ngbModal.open(this.alertModal,{
          centered: true,
          backdrop: 'static'
      }).result.finally(() => {
          this.ngOnInit();
          this.cdr.detectChanges();
      });
      this.isLoading = false;
  }).catch(error => {
      this.msg = error.error.error;
      this.ngbModal.open(this.alertModal, {
          centered: true,
          backdrop: 'static'
      });
      this.isLoading = false;
  });
}

  refreshData(): void {
    // Reload all data
    this.ngOnInit();
  }
}
