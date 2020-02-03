import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Database } from 'src/services/database';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    constructor(
        private router: Router,
        private database: Database,
        private afAuth: AngularFireAuth
    ) { }

    info: any;

    login() {
        this.afAuth.auth
            .signInWithPopup(new auth.GoogleAuthProvider())
            .then((credential: auth.UserCredential) => {
                this.info = JSON.stringify(credential.user, null, 2);
                this.router.navigate(['']);
                this.database.createUserSettingIfNotExist(
                    credential.user.uid, credential.user.displayName, credential.user.email);
            })
            .catch(error =>
                this.info = error.message || JSON.stringify(error, null, 2));
    }
}