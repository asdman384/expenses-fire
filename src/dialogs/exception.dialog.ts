import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'exception-dialog',
    templateUrl: 'exception-dialog.html',
    styleUrls: ['exception.dialog.css']
})
export class ExceptionDialog {

    @ViewChild('errortext', { static: true }) errortext: ElementRef<HTMLTextAreaElement>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string
    ) { }

    onCopyClick(): void {
        this.errortext.nativeElement.select();
        this.errortext.nativeElement.setSelectionRange(0, 999999);
        document.execCommand('copy');
    }
}
