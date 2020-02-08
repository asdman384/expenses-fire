import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Helper } from 'src/helpers/helper';
import { CategoryInfo } from 'src/models/category-info';
import { Database } from 'src/services/database';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    categories: Observable<CategoryInfo[]>;
    listDisabled: boolean = false;

    constructor(
        public afAuth: AngularFireAuth,
        public database: Database,
        private db: AngularFirestore
    ) { }

    ngOnInit() {
        this.afAuth.authState.subscribe((user: firebase.User) => {
            if (!user)
                return;

            this.categories = this.database.getAllCategories()
                .pipe(map(categories => categories.sort(Helper.sortBy('priority', 'asc'))));
        })
    }

    drop(event: CdkDragDrop<CategoryInfo[]>) {
        if (event.currentIndex === event.previousIndex) // nothing was changed
            return;

        let droppedItem: CategoryInfo = event.item.data;
        let toChange: CategoryInfo[];
        let onTop: boolean = event.currentIndex < event.previousIndex;

        if (onTop) { //dropped item moved top
            toChange = event.container.data.filter(
                c => c.priority > event.currentIndex && c.priority < droppedItem.priority);
        } else { //dropped item moved down
            toChange = event.container.data.filter(
                c => c.priority <= event.currentIndex + 1 && c.priority > droppedItem.priority);
        }

        var batch = this.db.firestore.batch();
        var doc = this.db.collection("categories").doc(droppedItem.id)
        batch.update(doc.ref, { priority: event.currentIndex + 1 });
        toChange.forEach(category => {
            doc = this.db.collection("categories").doc(category.id)
            batch.update(doc.ref, { priority: category.priority + (onTop ? 1 : -1) });
        })

        this.listDisabled = true;
        batch.commit()
            .then(() => this.listDisabled = false);
    }
}
