import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { Database } from 'src/services/database';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'expenses';
    loading = true;

    constructor(
        public router: Router,
        public afAuth: AngularFireAuth,
        private database: Database,
    ) { }

    ngOnInit(): void {
        this.afAuth.auth
            .getRedirectResult()
            .then(result => {
                this.loading = false;
                if (result.operationType === "signIn" && result.user) {
                    this.database.createUserSettingIfNotExist(
                        result.user.uid, result.user.displayName, result.user.email);
                }
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log(error);
            });
    }

    login() {
        this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
    }

    logout() {
        this.router.navigate([''])
            .then(_ => this.afAuth.auth.signOut());
    }
}
