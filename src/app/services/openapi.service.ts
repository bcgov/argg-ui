import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; 
import { UrlService } from './url.service'

@Injectable({
  providedIn: 'root'
})
export class OpenApiService {

  constructor(private http: HttpClient, private urlService: UrlService) { }

  fetch(url): Observable<any> {    

    if (!this.urlService.isValidUrl(url)) {
      console.log("reject url");
      return throwError("Invalid URL");
    }

    var options = {
      "headers": new HttpHeaders().set('accept', "application/json")
    }
    
    return this.http.get(url, options);
  }
}
