import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class OpenApiService {

  constructor(private http: HttpClient) { }

  fetch(url): Observable<any> {    

    var options = {
      "headers": new HttpHeaders().set('accept', "application/json")
    }
    
    return this.http.get(url, options);
  }
}
