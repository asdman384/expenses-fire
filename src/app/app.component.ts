import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { ExceptionDialog } from 'src/dialogs/exception.dialog';
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
        private dialog: MatDialog
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
            }).catch(error =>
                this.dialog.open(ExceptionDialog, { data: error }));
    }

    reload() {
        this.router.navigate([''])
            .then(_ => document.location.reload());
    }

    login() {
        this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
    }

    logout() {
        this.router.navigate([''])
            .then(_ => this.afAuth.auth.signOut());
    }
}
