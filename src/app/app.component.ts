import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'expenses';

    constructor(
        public router: Router,
        public afAuth: AngularFireAuth,
    ) {
        // this.afAuth.authState.subscribe(state => {
            // console.log(state);
            // console.log(this.router.url);
        // });
    }

    logout() {
        this.router.navigate(['login']);
        this.afAuth.auth.signOut();
    }
}
