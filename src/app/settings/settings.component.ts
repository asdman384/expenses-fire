import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Helper } from 'src/helpers/helper';
import { CategoryInfo } from 'src/models/category-info';
import { Database } from 'src/services/database';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    categoryName: string;
    categories: CategoryInfo[];
    listDisabled: boolean = false;
    private readonly distanceTodelete = 150;
    dragPlaceholderText: string;

    constructor(
        public afAuth: AngularFireAuth,
        public database: Database,
        private db: AngularFirestore
    ) { }

    ngOnInit() {
        this.afAuth.authState.subscribe((user: firebase.User) => {
            if (!user)
                return;

            this.database.getAllCategories()
                .subscribe(categories =>
                    this.categories = categories.sort(Helper.sortBy('priority', 'asc')));
        })
    }

    onButtonAddClick() {
        let last = this.categories[this.categories.length - 1];
        this.database.addCategory({
            id: (+last.id + 1) + '',
            priority: +last.priority + 1,
            name: this.categoryName
        }).then(() => this.categoryName = undefined);
    }

    cdkDragMoved(event: CdkDragMove) {
        this.dragPlaceholderText = event.distance.x > this.distanceTodelete ? 'delete?' : '';
    }

    onDrop(event: CdkDragDrop<CategoryInfo[]>) {
        const from = event.previousIndex;
        const to = event.currentIndex;
        if (from === to) {
            if (event.distance.x > this.distanceTodelete)
                this.database.delteCategory(event.item.data.id);
            return;
        }

        const delta = to > from ? -1 : 1;
        // TODO: move batch update to database
        const batch = this.db.firestore.batch();
        let category = this.categories[event.previousIndex];
        let doc = this.db.collection("categories").doc(category.id);
        batch.update(doc.ref, { priority: event.currentIndex });
        for (let i = to; i !== from; i += delta) {
            category = this.categories[i];
            doc = this.db.collection("categories").doc(category.id);
            batch.update(doc.ref, { priority: category.priority + delta });
        }

        moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
        this.listDisabled = true;
        batch.commit()
            .then(() => this.listDisabled = false);
    }
}
