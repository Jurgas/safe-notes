import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {NoteRequest} from '../../models/noteRequest.model';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {FileModel} from '../../models/file.model';
import {daLocale} from 'ngx-bootstrap/chronos';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) {
  }

  fetchFiles(): Observable<FileModel[]> {
    const link = environment.API_URL + '/files';
    return this.http.get<FileModel[]>(link);
  }

  addFile(data: FormData): Observable<any> {
    const link = environment.API_URL + '/files';
    return this.http.post<any>(link, data);
  }
}
