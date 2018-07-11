import { environment } from '../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ArggService } from '../services/argg.service';
import { BcdcService } from '../services/bcdc.service';
import { OpenApiService } from '../services/openapi.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, mergeMap, tap, catchError, filter, reduce } from 'rxjs/operators';
import { of, from, combineLatest } from 'rxjs';

@Component({
  selector: 'register-api',
  templateUrl: './register-api.component.html',
  styleUrls: ['./register-api.component.css']
})
export class RegisterApiComponent implements OnInit {

  DEFAULT_ERROR_MSG: String = "Unable to register the API.";

  form1: FormGroup;
  form2: FormGroup;
  loadingOpenApiSpecUrl: boolean;
  openApiSpecData: any;
  openApiSpecErr: string;
  autocompleteFromOpenApiSpec: boolean;
  submitSuccess: boolean;
  submitLoading: boolean;
  submitError: any;
  topLevelOrganizations: any[];
  ownerSubOrganizations: any[];
  submitterSubOrganizations: any[];
  contactRoles: any[];
  licenses: any[];
  securityClassifications: any[];
  viewAudiences: any[];
  env = environment;


  constructor(private fb: FormBuilder,
    private arggService: ArggService,
    public bcdcService: BcdcService,
    private openApiService: OpenApiService) { 

    this.form1 = this.fb.group({
      //OpenApi
      hasOpenApiSpec: [null, Validators.required],
      openApiSpecUrl: [null]      
    });
    this.form2 = this.fb.group({
      //General
      title: [null, Validators.required],
      description: [null, Validators.required],
      baseUrl: [null, Validators.required],
      supportsHttps: [null],
      supportsCors: [null],
      //owner
      ownerOrg: [null, Validators.required],
      ownerSubOrg: [null, Validators.required],
      principalContactName: [null, Validators.required],
      principalContactEmail: [null, Validators.required],
      principalContactPhone: [null, Validators.required],
      isPrincipalContact: [null, Validators.required],
      //submitter
      submitterContactName: [null],
      submitterContactEmail: [null],
      submitterContactPhone: [null],
      submitterRole: [null],
      submitterOrg: [null],
      submitterSubOrg: [null],
      //metadata
      hasMetadataRecord: [null, Validators.required],
      metadataRecordUrl: [null],
      //gateway
      useGateway: [null, Validators.required],
      useGatewayThrottling: [null],
      useGatewayApiKeys: [null],
      applicationShortName: [null],
      //Access
      viewAudience: [null, Validators.required],
      downloadAudience: [null],
      securityClass: [null, Validators.required],
      license: [null, Validators.required],
    });
    this.form2.disable();

    bcdcService.topLevelOrganizations
    .subscribe(
      orgs => {
        this.topLevelOrganizations = orgs;
      })

    bcdcService.contactRoles.subscribe(
      (contactRoles) => this.contactRoles = contactRoles
      )

    bcdcService.licenses.subscribe(
      (licenses) => this.licenses = licenses
      )

    bcdcService.securityClassifications.subscribe(
      (securityClassifications) => this.securityClassifications = securityClassifications
      )

    bcdcService.viewAudiences.subscribe(
      (viewAudiences) => this.viewAudiences = viewAudiences
      )


    //conditions for autopopulating form data from OpenAPI spec
    this.form1.get("openApiSpecUrl").valueChanges
      .pipe(
        tap(val => this.loadingOpenApiSpecUrl = true),
        debounceTime(500),
        mergeMap(url => this.openApiService.fetch(url).pipe(catchError(() => of(null) ))),
        tap(val => this.loadingOpenApiSpecUrl = false)
        )      
      .subscribe(
        this.setOpenApiSpecData,
        (err) => {console.log(err)}
        ) 

    //conditions for enabling Step 2
    this.form1.valueChanges
      .pipe(
          filter((formData) => formData.hasOpenApiSpec == "no" || formData.openApiSpecUrl)
        )
      .subscribe(() => {this.form2.enable();});

    //conditions for disabling Step 2
    this.form1.valueChanges
      .pipe(
          filter((formData) => !this.form2.touched && formData.hasOpenApiSpec == "yes" && !formData.openApiSpecUrl)
        )
      .subscribe(() => {this.form2.disable();});

    //conditions for updating/displaying the list of owner sub-organizations 
    //when an organization is chosen
    this.form2.get("ownerOrg").valueChanges
      .subscribe(this.enableOwnerSubOrgs);

    this.form2.get("isPrincipalContact").valueChanges
      .subscribe(isPrincipalContact => {
        this.toggleSubmitterFields(this.yesNoToBool(isPrincipalContact))
      });

    //conditions for updating/displaying the list of submitter sub-organizations 
    //when an organization is chosen
    this.form2.get("submitterOrg").valueChanges
      .subscribe(this.enableSubmitterSubOrgs);

    this.form2.get("hasMetadataRecord").valueChanges
      .subscribe(hasMetadataRecord => {
        this.toggleMetadataUrl(this.yesNoToBool(hasMetadataRecord))
      });

  }

  ngOnInit() {

  }

  setOpenApiSpecData = (openApiSpecData: any) => {
    this.openApiSpecData = openApiSpecData;
    try {
      this.populateFormFromOpenApiSpec(openApiSpecData);
      this.openApiSpecErr = null;
    }
    catch (e) {
      console.log(e)
      this.openApiSpecErr = e;
    }    
  }

  enableOwnerSubOrgs = (org) => {
    this.bcdcService.fetchSubOrgs(org).subscribe(
      subOrgs => {
        this.ownerSubOrganizations = subOrgs;
        if (subOrgs && subOrgs.length) {
          this.form2.get("ownerSubOrg").setValidators(Validators.required)
        }
        else {
         this.form2.get("ownerSubOrg").setValidators(null); 
        }
        this.form2.get("ownerSubOrg").updateValueAndValidity();
      })        
  }

  enableSubmitterSubOrgs = (org) => {
    this.bcdcService.fetchSubOrgs(org).subscribe(
      subOrgs => {
        this.submitterSubOrganizations = subOrgs;
        if (subOrgs && subOrgs.length) {
          this.form2.get("submitterSubOrg").setValidators(Validators.required)
        }
        else {
         this.form2.get("submitterSubOrg").setValidators(null); 
        }
        this.form2.get("submitterSubOrg").updateValueAndValidity();
      })        
  }

  toggleSubmitterFields = (isPrincipalContact) => {
    const v = isPrincipalContact ? null : [Validators.required];

    this.form2.get("submitterContactName").setValidators(v);
    this.form2.get("submitterContactName").updateValueAndValidity();

    this.form2.get("submitterContactEmail").setValidators(v);
    this.form2.get("submitterContactEmail").updateValueAndValidity();

    this.form2.get("submitterContactPhone").setValidators(v);
    this.form2.get("submitterContactPhone").updateValueAndValidity();

    this.form2.get("submitterRole").setValidators(v);
    this.form2.get("submitterRole").updateValueAndValidity();

    this.form2.get("submitterOrg").setValidators(v);
    this.form2.get("submitterOrg").updateValueAndValidity();

  }

  toggleMetadataUrl = (hasMetadataRecord) => {
    const v = hasMetadataRecord ? [Validators.required] : null;

    this.form2.get("metadataRecordUrl").setValidators(v);
    this.form2.get("metadataRecordUrl").updateValueAndValidity();

  }  

  /*
  Auto-populates some form fields from the openApiSpecData object.
  Supports OpenAPI 3
  */
  private populateFormFromOpenApiSpec(openApiSpecData: any) {
    console.log(openApiSpecData);
    var autocompletedAtLeastOneField = false;
    if (!openApiSpecData)
      throw "Unable to download OpenAPI specification";
    if (!openApiSpecData.hasOwnProperty("openapi")) {
      throw "Unable to parse OpenAPI specification";
    }
    if (openApiSpecData.hasOwnProperty("info")) {
      if (openApiSpecData.info.hasOwnProperty("title")) {
        if (!this.form2.get("title").touched) {
          this.form2.get("title").setValue(openApiSpecData.info.title)
          autocompletedAtLeastOneField = true;  
        }
      }
      if (openApiSpecData.info.hasOwnProperty("description")) {
        if (!this.form2.get("description").touched) {
          this.form2.get("description").setValue(openApiSpecData.info.description)
          autocompletedAtLeastOneField = true;
        }
      }  
      if (openApiSpecData.info.hasOwnProperty("contact")) {
        if (openApiSpecData.info.contact.hasOwnProperty("name")) {
          //assume "contact.name" is an organization's name not a person's name
          console.log("todo: set organization: "+openApiSpecData.info.contact.name)
        }
      }
      if (openApiSpecData.info.hasOwnProperty("license")) {
        if (openApiSpecData.info.license.hasOwnProperty("name")) {          
          console.log("todo: set license name: "+openApiSpecData.info.license.name)
        }
        if (openApiSpecData.info.license.hasOwnProperty("url")) {          
          console.log("todo: set license url: "+openApiSpecData.info.license.url)
        }
      }
    }
    if (openApiSpecData.hasOwnProperty("servers")) {
      if (openApiSpecData.servers.length >= 0 && openApiSpecData.servers[0].hasOwnProperty("url")){
        if (!this.form2.get("baseUrl").touched) {
          this.form2.get("baseUrl").setValue(openApiSpecData.servers[0].url)  
          autocompletedAtLeastOneField = true;
        }
      }      
    }    
    this.autocompleteFromOpenApiSpec = autocompletedAtLeastOneField;
  }

  submit(): void {
    
    //prepare values that will be injected into the data object but 
    //which need non-trivial computation
    var openApiSpecUrl = this.form1.get("openApiSpecUrl").value;
    var existingMetadataUrl = this.form2.get('metadataRecordUrl').value;
    var supportsHttps = this.yesNoToBool(this.form2.get("supportsHttps").value);
    var supportsCors = this.yesNoToBool(this.form2.get("supportsCors").value);
    var useGateway = this.yesNoToBool(this.form2.get("useGateway").value);
    var useThrottling = this.yesNoToBool(this.form2.get("useGatewayThrottling").value);
    var useApiKeys = this.yesNoToBool(this.form2.get("useGatewayApiKeys").value);
    var principalContact = {
      "name": this.form2.get("principalContactName").value,
      "org_id": this.form2.get("ownerOrg").value.id,
      "sub_org_id": this.form2.get("ownerSubOrg").value.id,
      "business_email": this.form2.get("principalContactEmail").value,
      "business_phone": this.form2.get("principalContactPhone").value,
      "role": "pointOfContact", 
      "private": "Display"      
    }
    var submitterContact = this.form2.get("isPrincipalContact").value == "yes" ?
      principalContact :
      {
        "name": this.form2.get("submitterContactName").value,
        "org_id": this.form2.get("submitterOrg").value.id,
        "sub_org_id": this.form2.get("submitterSubOrg").value.id,
        "business_email": this.form2.get("submitterContactEmail").value,
        "business_phone": this.form2.get("submitterContactPhone").value,
        "role": this.form2.get("submitterRole").value   
      }
    var downloadAudience = this.form2.get("viewAudience").value;

    var data = {
      "submitted_by_person": submitterContact,
      "existing_metadata_url": existingMetadataUrl,
      "metadata_details": {
        "title": this.form2.get('title').value,
        "owner": {
          "org_id": this.form2.get("ownerOrg").value.id,
          "sub_org_id": this.form2.get("ownerSubOrg").value.id,
          "contact_person": principalContact
        },    
        "description": this.form2.get('description').value,
        "status": "completed", //default value
        "security": {
          "view_audience": this.form2.get("viewAudience").value, 
          "download_audience": downloadAudience, 
          "metadata_visibility": "Public", //default value
          "security_class": this.form2.get("securityClass").value 
        },
        "license": {
          "license_title": this.form2.get("license").value.title,
          "license_url": this.form2.get("license").value.url,
          "license_id": this.form2.get("license").value.id
        }
      },
      "existing_api": {
        "supports": {
          "https": supportsHttps,
          "cors": supportsCors
        },
        "base_url": this.form2.get("baseUrl").value,
        "openapi_spec_url": openApiSpecUrl
      },
      "gateway": {
        "use_gateway": useGateway,
        "use_throttling": useThrottling,
        "restrict_access": useApiKeys,
        "api_shortname": this.form2.get("applicationShortName").value    
      }
    }

    this.submitLoading = true;
    this.arggService.registerApi(data).subscribe(
      this.onSubmitSuccess,
      this.onSubmitError,
      this.onSubmitComplete,
      )
  }

  yesNoToBool(val: string, default_val?: any) {
    if (val == "yes")
      return true;
    if (val == "no") {
      return false;
    }
    return default_val;
  }

  onSubmitSuccess = (resp) => {
    console.log("success");
    this.submitSuccess = true;
    this.submitError = null;
  }

  onSubmitError = (resp) => {
    var errorMsg = this.DEFAULT_ERROR_MSG;
    if (resp.hasOwnProperty("error") && resp.error.hasOwnProperty("msg")) {
      errorMsg = resp.error.msg;
    }

    this.submitLoading = false;
    this.submitError = errorMsg;
  }

  onSubmitComplete = () => {
    this.submitLoading = false;
  }

}
