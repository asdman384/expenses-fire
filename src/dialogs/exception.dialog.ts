import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'exception-dialog',
    templateUrl: 'exception-dialog.html',
    styleUrls: ['exception.dialog.css']
})
export class ExceptionDialog {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: string
    ) { }

    onShareClick() {
        const shareData = {
            title: 'Share error stack',
            text: this.data,
        };

        navigator.share(shareData);
    }
}
