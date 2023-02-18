import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents!: Observable<string[]>;
  currentDoc!: string;
  private _docSub!: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.documents = this.documentService.documents;
    this._docSub = this.documentService.currentDocument.subscribe(doc => this.currentDoc = doc.id);
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  loadDoc(id: string) {
    const data = this.documentService.getDocument(id);
    console.log(data);
    // this.currentDoc = data.doc;
  }

  newDoc() {
    this.documentService.newDocument();
  }

}
