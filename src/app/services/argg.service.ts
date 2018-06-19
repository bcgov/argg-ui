import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArggService {

  constructor(private http: HttpClient) { 

  }

  /*
  data: a json object as specified in the OpenAPI spec for ARGG
  */
  registerApi(data: any): Observable<any> {
    var url = `${environment.argg_api_base_url}/register_api`;

    var options = {
      "headers": new HttpHeaders().set('accept', "application/json")
    }
    
    return this.http.post(url, data, options);
  }

}
