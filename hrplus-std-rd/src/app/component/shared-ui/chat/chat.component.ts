import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, AfterViewChecked, OnDestroy, AfterViewInit } from '@angular/core';
import { Chat } from './chat';
import { ContactList } from './contactList';
import { ChatMessages } from './chatMessages';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { interval, of, Subscription } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeProfileModel } from 'src/app/models/employeeprofilemodel.model';
import { catchError, retry, switchMap, takeWhile, timeout } from 'rxjs/operators';
import { ChangeEventArgs, ErrorEventArgs, SpeechToTextComponent, SpeechToTextModule, StopListeningEventArgs, TextAreaComponent, TextAreaModule, TranscriptChangedEventArgs } from '@syncfusion/ej2-angular-inputs';
import { DropDownListComponent, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchComponent, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { setCulture } from '@syncfusion/ej2-base';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
setCulture('th-TH');
// Placeholder for Syncfusion Speech-to-Text import
// import { SpeechToTextService } from '@syncfusion/ej2-angular-speech-to-text'; // Example import
export interface MsgModel {
    data: Data;
}

export interface Data {
    status: string;
    message: string;
}

export interface ChatMessage {
    chatClass: 'odd' | 'even';
    message: string;
    timestamp: Date;
}

export interface OutputResponse {
    response: {
        output: {
            response: string;
        };
        tool_use: string;
    };
    user_id: string;
    session_id: string;
    query: string;
}

@Component({
    standalone: true,
    imports: [CommonModule, TranslateModule, FormsModule, NgbModule, NgbPaginationModule, SpeechToTextModule, TextAreaModule, DropDownListModule, SwitchModule],
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('scrollMe') private scroller!: ElementRef;
    currentUser = JSON.parse(sessionStorage.getItem('currentUser')!);

    
    contactList: ContactList[] = [];
    chatMessages: ChatMessage[] = [];
    savedMessages: ChatMessage[] = [];
    activeChatUserId = 1;
    activeChatUser!: string;
    activeChatUserImg = '';
    activeChatUserStatus = 'Online';
    empProfile?: EmployeeProfileModel;

    loadingMsg = false;
    draft = '';

    /** polling */
    intervalSub?: Subscription;
    pollingSub?: Subscription;
    companyId = 'eb2f4f30-edaf-11ee-a69a-c7680edc0e47'
    aiUrl = 'https://aibot.myhr.co.th/myai/';
    agents: {
        id: string;
        label: string;
        img: string;       // avatar path
        icon: string;      // font-awesome class
        welcome: string;
        url: string;
    }[] = [
            {
                id: 'Helpdesk',
                label: 'Helpdesk Bot',
                img: 'assets/images/agents/helpdesk.png',
                icon: 'fa-headphones',
                welcome: 'สวัสดีค่ะ! ฉันคือ Helpdesk Bot พร้อมช่วยเหลือเรื่องงาน HR ค่ะ 😊',
                url: 'https://aibot.myhr.co.th/myai/helpdesk-chat/eb2f4f30-edaf-11ee-a69a-c7680edc0e47'
            },
            {
                id: 'Analytics',
                label: 'Analytics Bot',
                img: 'assets/images/agents/analytic.png',
                icon: 'fa-chart-line',
                welcome: 'สวัสดีครับ! Analytics Bot รายงานข้อมูลเชิงลึกให้ได้เสมอครับ 📊',
                url: 'https://aibot.myhr.co.th/myai/analytics-chat/eb2f4f30-edaf-11ee-a69a-c7680edc0e47'
            },
            {
                id: 'knowledge',
                label: 'Knowledge Bot',
                img: 'assets/images/agents/km.png',
                icon: 'fa-book',
                welcome: 'สวัสดีค่ะ! Knowledge Bot พร้อมให้ข้อมูลเกี่ยวกับการเรียนรู้นโยบายบริษัท',
                url: 'https://aibot.myhr.co.th/myai/rag-chat/eb2f4f30-edaf-11ee-a69a-c7680edc0e47'
            }
        ];

    selectedAgent: {
        id: string;
        label: string;
        img: string;       // avatar path
        icon: string;      // font-awesome class
        welcome: string;
        url: string;
    } = this.agents[0];


    @ViewChild('speechToText') public speechToText!: SpeechToTextComponent;
    @ViewChild('outputTextarea') public outputTextarea!: TextAreaComponent;
    @ViewChild('sttStylingDdl') sttStylingDdl!: DropDownListComponent;
    @ViewChild('sttLangDdl') sttLangDdl!: DropDownListComponent;
    @ViewChild('interimSwitch') interimSwitch!: SwitchComponent;
    @ViewChild('tooltipSwitch') tooltipSwitch!: SwitchComponent;
    @ViewChild('iconWithTextSwitch') iconWithTextSwitch!: SwitchComponent;

    private isSupportedBrowser: boolean = true;
    public colorsData: Object[] = [
        { text: 'Normal', value: '' },
        { text: 'Primary', value: 'e-primary' },
        { text: 'Success', value: 'e-success' },
        { text: 'Warning', value: 'e-warning' },
        { text: 'Danger', value: 'e-danger' },
        { text: 'Flat', value: 'e-flat' },
        { text: 'Info', value: 'e-info' }
    ];

    public languageData: Object[] = [
        { text: 'English, US', value: 'en-US' },
        { text: 'German, DE', value: 'de-DE' },
        { text: 'Chinese, CN', value: 'zh-CN' },
        { text: 'French, FR', value: 'fr-FR' },
        { text: 'Arabic, SA', value: 'ar-SA' },
        { text: 'Thailand, TH', value: 'th-TH' },
        { text: 'Japanese, JP', value: 'ja-JP' }
    ];
    public fields: Object = { text: 'text', value: 'value' };

    constructor(private http: HttpClient, private empService: EmployeeService) {
    }

    ngOnInit(): void {


        this.contactList = this.getMockContacts();
        this.pickContact(this.contactList[0]);

        this.empService.getEmployeeProfile(this.currentUser.employeeid)
            .subscribe({ next: r => this.empProfile = r, error: (_: HttpErrorResponse) => { } });

        this.chatMessages.push({
            chatClass: 'even',
            message: this.selectedAgent.welcome,
            timestamp: new Date()
        });
    }

    trackByIdx = (_: number, msg: ChatMessage) => msg.timestamp;

    // ngAfterViewChecked(): void {
    //     this.scroller?.nativeElement.scrollTo({
    //         top: this.scroller.nativeElement.scrollHeight,
    //         behavior: 'smooth'
    //     });
    // }

    pickContact(c: ContactList): void {
        this.activeChatUserId = c.id;
        this.activeChatUser = c.name;
        this.activeChatUserImg = c.imagePath;
        this.savedMessages = c.chats;
        this.chatMessages = [...c.chats];
    }

    sentMsg(text: string): void {
        const msg = text.trim();
        if (!msg) return;

        if (this.speechToText) {
            this.speechToText.stopListening();
        }

        this.pushBubble(msg, 'odd');

        this.loadingMsg = true;

        // const body = {
        //   query: msg,
        //   user_id: this.currentUser.employeeid,
        //   qdrant_collection: 'my_pdf_collection',
        //   temperature: 0.7,
        //   max_tokens: 2048,
        //   workspace: 'eb2f4f30-edaf-11ee-a69a-c7680edc0e47',
        //   agent_name: 'myhrplusstd'
        // };
        const body = {
            "message": msg
        }

        this.http.post<{
            status: string;
            message: string;
        }>(this.selectedAgent.url, body).subscribe({
            next: res => {
                const answer = res?.message || 'ขออภัย ไม่พบข้อมูลที่ต้องการ กรุณาถามใหม่อีกครั้ง!';
                this.pushBubble(answer, 'even');
                this.loadingMsg = false;
            },
            error: () => {
                this.pushBubble('ขออภัย ไม่พบข้อมูลที่ต้องการ กรุณาถามใหม่อีกครั้ง!', 'even');
                this.loadingMsg = false;
            }
        });
    }

    private pushBubble(message: string, sender: 'odd' | 'even') {
        if (message.includes("Rate limit reached")) {
            message = "ข้อมูลตอบกลับมีขนาดใหญ่"
        }
        const newChat: ChatMessage = {
            chatClass: sender,
            message: message.replace("<a href", "<a target='_blank' href"),
            timestamp: new Date()
        };
        this.chatMessages.push(newChat);
        this.scrollTop()
        this.clearTranscript()
        console.log("this", this.chatMessages)
    }

    private getMockContacts(): ContactList[] {
        const chats: ChatMessage[] = [];
        return [
            { id: 1, imagePath: 'assets/images/users/1.jpg', name: 'Steve Rogers', signature: 'Hey Banner, where are you?', time: '9:30', chats },
            { id: 2, imagePath: 'assets/images/users/2.jpg', name: 'Natasha', signature: 'Meet at HQ', time: '10:12', chats }
        ];
    }

    ngOnDestroy(): void {
        this.intervalSub?.unsubscribe();
        this.pollingSub?.unsubscribe();
    }

    scrollTop() {
        this.scroller?.nativeElement.scrollTo({
            top: this.scroller.nativeElement.scrollHeight,
            behavior: 'smooth'
        });
    }
    onAgentChange() {
        console.log(this.selectedAgent)
        this.chatMessages = [];

        // const found = this.agents.find(a => a.id === agentId);
        // if (!found) { return; }
        // this.selectedAgent = found;

        /* เปลี่ยน endpoint ตาม Agent ถ้าจำเป็น */
        this.aiUrl = this.selectedAgent.url
        /* ส่งข้อความทักทายของ Agent */
        this.chatMessages.push({
            chatClass: 'even',
            message: this.selectedAgent.welcome,
            timestamp: new Date()
        });

        /* เลื่อน scroll ทันที (optional) */
        this.scrollTop()
    }


    ngAfterViewInit(): void {
        this.speechToText.allowInterimResults = true;
        this.speechToText.lang = 'th-TH'
    }

    onTranscriptChange(args: TranscriptChangedEventArgs): void {
        if (!args.isInterimResult) {
            args.transcript += ' ';
        }
        this.outputTextarea.value = args.transcript;
        this.draft = this.outputTextarea.value;
        this.toggleCopyButtonState();
    }

    onMicColorChange(args: any): void {
        this.speechToText.cssClass = args.value.toString();
    }

    onLanguageChange(args: any): void {
        this.speechToText.lang = args.value.toString();
    }

    toggleInterimResults(args: any): void {
        this.speechToText.allowInterimResults = args.checked;
    }

    toggleTooltip(args: any): void {
        this.speechToText.showTooltip = args.checked;
    }

    toggleIconWithText(args: any): void {
        this.speechToText.buttonSettings = {
            content: args.checked ? 'Start Listening' : '',
            stopContent: args.checked ? 'Stop Listening' : ''
        };
    }
    onListeningStart(): void {
        if (this.isSupportedBrowser) {
            console.log(this.outputTextarea)
            if (this.outputTextarea.value) {
                this.speechToText.transcript = this.outputTextarea.value + '\n';
            }
        }
        this.updateStatus(this.isSupportedBrowser ? 'Listening... Speak now...' : 'For unsupported browsers, use event callbacks to handle Speech-to-Text actions.');
        this.sttLangDdl.enabled = true;
        this.interimSwitch.disabled = false;
    }

    onListeningStop(args: StopListeningEventArgs): void {
        if (this.isSupportedBrowser) {
            if (args.isInteracted)
                this.updateStatus('Click the mic button to start speaking...');
        }
        else {
            this.updateStatus('For unsupported browsers, use event callbacks to handle Speech-to-Text actions.');
        }
        this.sttLangDdl.enabled = true;
        this.interimSwitch.disabled = false;
    }
    onErrorHandler(args: ErrorEventArgs): void {
        this.updateStatus(args.errorMessage);
        if (args.error === 'unsupported-browser')
            this.isSupportedBrowser = false;
    }

    updateStatus(status: string): void {
        document.querySelector('.speech-recognition-status')!.textContent = status;
    }

    copyTranscript(): void {
        const copyText = this.outputTextarea.value;
        const copyBtnElem = document.getElementById('transcript-copy-button');

        if (copyText && navigator.clipboard) {
            navigator.clipboard.writeText(copyText).then(() => {
                if (copyBtnElem) {
                    copyBtnElem.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtnElem.textContent = 'Copy';
                    }, 1000);
                }
            }).catch(err => {
                console.error('Clipboard write failed', err);
            });
        }
    }

    clearTranscript(): void {
        this.draft = this.outputTextarea.value = this.speechToText.transcript = '';
    }

    toggleCopyButtonState(): void {
        var hasText = this.outputTextarea.element.value.trim() !== '';
        const copyBtnElem = document.getElementById('transcript-copy-button');
        if (hasText) {
            copyBtnElem.removeAttribute('disabled');
        }
        else {
            copyBtnElem.setAttribute('disabled', 'true');
        }
    }
}