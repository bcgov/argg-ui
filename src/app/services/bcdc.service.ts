import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { from } from 'rxjs';
import { debounceTime, mergeMap, tap, catchError, filter, reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BcdcService {

  loadingOrganizations: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  loadingContactRoles: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  allOrganizations: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  topLevelOrganizations: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  licenses: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  securityClassifications: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  viewAudiences: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  contactRoles: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { 

    this.fetchOrganizations().subscribe(
      (resp) => this.allOrganizations.next(resp.result),
      (err) => console.error("Unable to fetch a list of 'organizations'"),
      () => {this.loadingOrganizations.next(false);}
      )

    this.allOrganizations
      .pipe(
        filter(orgs => orgs != null)
      ).subscribe(
        this.buildTopLevelOrgs
      )    

    this.fetchLicenses().subscribe(
      (licenses) => this.licenses.next(licenses),
      (err) => console.error("Unable to fetch a list of 'licenses'")
      )

    this.fetchSecurityClassifications().subscribe(
      (resp) => this.securityClassifications.next(resp.result.tags),
      (err) => console.error("Unable to fetch a list of 'security classifications'")
      )    

    this.fetchViewAudiences().subscribe(
      (resp) => this.viewAudiences.next(resp.result.tags),
      (err) => console.error("Unable to fetch a list of 'view audiences'")
      )  

    this.fetchContactRoles().subscribe(
      (resp) => this.contactRoles.next(resp.result.tags),
      (err) => console.error("Unable to fetch a list of 'contact roles'"),
      () => {this.loadingContactRoles.next(false);}
      )  

  }

  private buildTopLevelOrgs = (allOrgs) => {
    from(allOrgs)
    .pipe(
      filter( org => org["child_of"].length == 0),
      reduce((acc, value) => {
        acc.push(value);
        return acc;
        }, [])
      ).subscribe(
        topLevelOrgs => {
          this.topLevelOrganizations.next(topLevelOrgs);
          console.log("set top level orgs: "+topLevelOrgs.length);
        })    
  }

  /**
   Returns a stream of sub organizations under the given parent organization (specified by the parent's title)
  */
  public fetchSubOrgs(orgToFind): Observable<any> {
    if (!this.allOrganizations || !orgToFind || !orgToFind.hasOwnProperty("title")) {
      return from([]); //an observable with an empty list
    }
    const stream = from(this.allOrganizations.value)
    .pipe(
      filter( org => {
        return org["child_of"].map(item => item.title).indexOf(orgToFind.title) >= 0;
      }),
      reduce((acc, value) => {
        acc.push(value);
        return acc;
        }, [])
      );
    return stream;
  }

  public fetchOrganizations(): Observable<any> { 
    
    this.loadingOrganizations.next(true);
    var url = `${environment.bcdc_base_url}${environment.bcdc_api_path}/organization_list_related?all_fields=true`;

    var options = {
      "headers": new HttpHeaders().set('accept', "application/json")
    }
    
    return this.http.get(url, options);
  }

  public fetchLicenses(): Observable<any> {
    var url = environment.license_list_url;    
    return this.http.get(url, {});
  }

  public fetchSecurityClassifications(): Observable<any> {
    this.loadingContactRoles.next(true);
    var url = `${environment.bcdc_base_url}${environment.bcdc_api_path}/vocabulary_show?id=security_class`;

    var options = {
      "headers": new HttpHeaders().set('accept', "application/json")
    }
    
    return this.http.get(url, options);
  }

  public fetchViewAudiences(): Observable<any> {
    this.loadingContactRoles.next(true);
    var url = `${environment.bcdc_base_url}${environment.bcdc_api_path}/vocabulary_show?id=viewable`;

    var options = {
      "headers": new HttpHeaders().set('accept', "application/json")
    }
    
    return this.http.get(url, options);
  }

  public fetchContactRoles(): Observable<any> { 
    
    this.loadingContactRoles.next(true);
    var url = `${environment.bcdc_base_url}${environment.bcdc_api_path}/vocabulary_show?id=contact_roles`;

    var options = {
      "headers": new HttpHeaders().set('accept', "application/json")
    }
    
    return this.http.get(url, options);
  }  

}
