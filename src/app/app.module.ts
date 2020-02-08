import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatTableModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { Database } from 'src/services/database';
import { DraggableDirective } from '../derictives/draggable.directive';
import { AddExpenseFormComponent } from './add-expense-form/add-expense-form.compoent';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryComponent } from './history/history.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { SettingsComponent } from './settings/settings.component';
import { StatsComponent } from './stats/stats.component';

@NgModule({
    declarations: [
        AppComponent,
        StatsComponent,
        MainScreenComponent,
        AddExpenseFormComponent,
        HistoryComponent,
        SettingsComponent,

        DraggableDirective
    ],
    imports: [
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFirestoreModule.enablePersistence(),
        AngularFireAuthModule,

        DragDropModule,

        MatTableModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCardModule,
        MatRadioModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,

        AppRoutingModule,
    ],
    providers: [
        MatDatepickerModule,
        Database
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
