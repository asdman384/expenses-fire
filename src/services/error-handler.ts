import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExceptionDialog } from 'src/dialogs/exception.dialog';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error) {
        console.error(error);
        const dialog = this.injector.get(MatDialog);
        dialog.open(ExceptionDialog, { data: error.stack });

        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        // throw error;
    }

}