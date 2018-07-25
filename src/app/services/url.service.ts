import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }

  /**
  Checks if the given url is "valid".  
  Implementation Note: It is actually quite difficult to find a regular expression that 
  can correctly identify valid URLs and reject invalid URLs.  Most have limitations in 
  which they reject certain valid URLs (such as IP addresses, "localhost", and others).  
  We really don't want to reject valid URLs, so the implementation here is more basic.  
  It only disallows a small set of invalid URLs, but at least it doesn't disallow valid 
  ones.
  */
  isValidUrl(url) {
    //regex explanation:
    // - url must start with http(s)://
    // - next character must be a number or letter
    // - any additional characters may follow
    var query = /^https?\:\/\/[\w]{1,}[^\s]*/
    var regex = new RegExp(query);
    var result = regex.test(url);
    return result;
  }
}
