import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    emailFormControl = new FormControl('', [Validators.required,]);

    val = { test: 'a@a.a' };

    ngOnInit(): void {

        this.emailFormControl.patchValue(this.val.test);

    }


    onButtonClick() {

        console.log(this.val);

    }
}