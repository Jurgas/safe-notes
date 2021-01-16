import {Component, OnInit} from '@angular/core';
import {Note} from '../../models/note.model';
import {FileModel} from '../../models/file.model';
import {AddNoteDialogComponent} from '../add-note-dialog/add-note-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {sha256} from 'js-sha256';
import {NoteRequest} from '../../models/noteRequest.model';
import {NotesService} from '../services/notes.service';
import * as FileSaver from 'file-saver';
import {FilesService} from '../services/files.service';

declare var require: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  NOTES: Note[];
  PUBLIC_NOTES: Note[];
  FILES: FileModel[];
  password: string;


  constructor(private dialog: MatDialog,
              private notesService: NotesService,
              private filesService: FilesService) {
  }

  ngOnInit(): void {
    this.loadNotes();
    this.loadFiles();
  }

  loadNotes(): void {
    this.notesService.fetchNotes().subscribe(res => {
      this.NOTES = res.map(datum => ({
        title: datum.title,
        text: datum.text,
        type: datum.type,
        modified: null,
      }));
      this.PUBLIC_NOTES = this.NOTES.filter(note => note.type === 'PUBLIC');
    });
  }

  loadFiles(): void {
    this.filesService.fetchFiles().subscribe(res => {
      this.FILES = res;
    });
  }

  decrypt(note: Note, password: string): void {
    if (password.length === 0) {
      note.modified = note.text;
      return;
    }
    const aesjs = require('aes-js');
    const key = sha256.update(password).digest();
    const encryptedBytes = aesjs.utils.hex.toBytes(note.text);
    const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    note.modified = aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  addPrivateNote(): void {
    const dialogRef = this.dialog.open(AddNoteDialogComponent, {
      data: {isPrivate: true}
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.password) {
          const aesjs = require('aes-js');
          const key = sha256.update(data.password).digest();
          const textBytes = aesjs.utils.utf8.toBytes(data.text);
          const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
          const encryptedBytes = aesCtr.encrypt(textBytes);
          data.text = aesjs.utils.hex.fromBytes(encryptedBytes);
        }
        const body: NoteRequest = {
          title: data.title,
          text: data.text,
          type: data.password ? 'ENCRYPTED' : 'PRIVATE'
        };
        this.notesService.addNote(body).subscribe(() => {
          this.loadNotes();
        });
      }
    });
  }

  addFile(event): void {
    if (event.target.files.length > 0) {
      const selectedFile: File = event.target.files[0];
      const formData = new FormData();
      formData.append('name', selectedFile.name);
      formData.append('fileExtension', selectedFile.type);
      formData.append('content', new Blob([selectedFile], {type: selectedFile.type}));
      this.filesService.addFile(formData).subscribe(res => {
        this.loadFiles();
      });
    }
  }

  downloadFile(file: FileModel): void {
    const data = new Blob([file.content], {type: 'application/octet-stream'});
    FileSaver.saveAs(data, file.name);
  }

  addPublicNote(): void {
    const dialogRef = this.dialog.open(AddNoteDialogComponent, {
      data: {isPrivate: false}
    });
    dialogRef.afterClosed().subscribe(data => {
        if (data) {
          const body: NoteRequest = {
            title: data.title,
            text: data.text,
            type: 'PUBLIC'
          };
          this.notesService.addNote(body).subscribe(() => {
            this.loadNotes();
          });
        }
      }
    );
  }
}
