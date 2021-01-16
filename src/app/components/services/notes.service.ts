import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthRequest} from '../../models/auth-request.model';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {NoteRequest} from '../../models/noteRequest.model';
import {Note} from '../../models/note.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) {
  }

  fetchNotes(): Observable<NoteRequest[]> {
    const link = environment.API_URL + '/notes';
    return this.http.get<NoteRequest[]>(link);
  }

  addNote(request: NoteRequest): Observable<any> {
    const link = environment.API_URL + '/notes';
    const data: NoteRequest = {
      title: request.title,
      type: request.type,
      text: request.text,
    };
    return this.http.post<any>(link, data);
  }

}
