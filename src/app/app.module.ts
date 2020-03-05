import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ErrorHandler, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExceptionDialog } from 'src/dialogs/exception.dialog';
import { environment } from 'src/environments/environment';
import { Database } from 'src/services/database';
import { GlobalErrorHandler } from 'src/services/error-handler';
import { DraggableDirective } from '../derictives/draggable.directive';
import { AddExpenseFormComponent } from './add-expense-form/add-expense-form.compoent';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryComponent } from './history/history.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { SettingsComponent } from './settings/settings.component';
import { StatsComponent } from './stats/stats.component';
import { CalculatorComponent } from 'src/dialogs/calculator/calculator.component';

@NgModule({
    declarations: [
        AppComponent,
        StatsComponent,
        MainScreenComponent,
        AddExpenseFormComponent,
        HistoryComponent,
        SettingsComponent,
        ExceptionDialog,

        DraggableDirective,

        CalculatorComponent
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
        ClipboardModule,

        MatTooltipModule,
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
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,

        AppRoutingModule,
    ],
    entryComponents: [ExceptionDialog],
    providers: [
        MatDatepickerModule,
        Database,
        { provide: ErrorHandler, useClass: GlobalErrorHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
