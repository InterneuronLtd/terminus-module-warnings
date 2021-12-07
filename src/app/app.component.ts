//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2021  Interneuron CIC

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Medication, Prescription } from './models/EPMA';
import { WarningService } from './services/warning.service';
import { environment } from 'src/environments/environment';
import { ApirequestService } from './services/apirequest.service';
import { AppService } from './services/app.service';
import { SubjectsService } from './services/subjects.service';
import { Subscription } from 'rxjs';
import { DisplayWarningType, PatientInfo, Warnings, WarningType } from './models/warning.model';
import { filter, filterparam, filterParams, filters, orderbystatement, selectstatement } from './models/filter.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'terminus-module-warnings';
  @Input() personId: string;
  @Input() encouterId: string;
  @Input() refreshonload: boolean = true;
  @Output() onloadcomplete = new EventEmitter<any>();
  subscriptions = new Subscription();
  showExistingWarnings: boolean = true;
  showNewWarnings: boolean = false;
  showAllwarning: boolean = false;
  enableOverride: boolean = true;

  @Input() set warningContext(value: IContext) {
    this.personId = value.personId;
    this.encouterId = value.encouterId;
    this.warningService.personId = value.personId;
    this.warningService.encouterId = value.encouterId;
    this.appService.apiService = value.apiService;
    this.refreshonload = value.refreshonload;
    this.initConfigAndGetMeta(this.appService.apiService);
    this.showExistingWarnings = value.existingwarnings;
    this.showNewWarnings = value.newwarnings;
    this.enableOverride = value.enableOverride;
  }
  // overrideExistingWarning: Warnings[] = [];
  // otherExistingWarning: Warnings[] = [];
  // overrideNewWarning: Warnings[] = [];
  // otherNewWarning: Warnings[] = [];

  dummyData: any;
  constructor(private subjects: SubjectsService, public appService: AppService, private apiRequest: ApirequestService, public warningService: WarningService, public cd: ChangeDetectorRef) {
    if (!environment.production)
      this.initDevMode();


    this.subscriptions.add(this.subjects.refreshWarning.subscribe
      ((event) => {
        cd.detectChanges();
      }));

  }
  initDevMode() {
    //commment out to push to framework - 3lines
    this.appService.personId = "96ebefbe-a2e0-4e76-8802-e577e28fcc23"//"774c605e-c2c6-478d-90e6-0c1230b3b223";//"4d05aff8-123f-4ca9-be06-f9734905c02f"//"d91ef1fa-e9c0-45ba-9e92-1e1c4fd468a2"// "027c3400-24cd-45c1-9e3d-0f4475336394" ;//  "6b187a8b-1835-42c2-9cd5-91aa0e39f0f7";//"6b187a8b-1835-42c2-9cd5-91aa0e39f0f7"//"774c605e-c2c6-478d-90e6-0c1230b3b223";//"0422d1d0-a9d2-426a-b0b2-d21441e2f045";//"6b187a8b-1835-42c2-9cd5-91aa0e39f0f7"; //"17775da9-8e71-4a3f-9042-4cdcbf97efec";// "429904ca-19c1-4a3a-b453-617c7db513a3";//"027c3400-24cd-45c1-9e3d-0f4475336394";//"429904ca-19c1-4a3a-b453-617c7db513a3";
    this.encouterId = "970c458b-181c-4263-a145-e296d45a4894";
    this.warningService.encouterId = "970c458b-181c-4263-a145-e296d45a4894";
    this.warningService.personId = "96ebefbe-a2e0-4e76-8802-e577e28fcc23";
    let value: any = {};
    value.authService = {};
    value.authService.user = {};
    let auth = this.apiRequest.authService;
    auth.getToken().then((token) => {
      value.authService.user.access_token = token;
      this.initConfigAndGetMetaDevMode(value);
    });
  }
  ToggleShowLowPriorityWarnings() {
    this.showAllwarning = !this.showAllwarning;
    this.cd.detectChanges();
  }
  initConfigAndGetMetaDevMode(value: any) {
    //this.warningService.showNewWarnings = true;
    this.warningService.showExistingWarnings = false;
    this.appService.apiService = value;
    this.subscriptions.add(this.apiRequest.getRequest("./assets/config/WarningConfig.json?V" + Math.random()).subscribe(
      (response) => {
        this.appService.appConfig = response;
        this.appService.baseURI = this.appService.appConfig.uris.baseuri;
        this.appService.fdbURI = this.appService.appConfig.uris.fdburi;
        this.appService.enableLogging = this.appService.appConfig.enablelogging;
        this.appService.warningSeverity = this.appService.appConfig.warningSeverity;
        this.appService.warningTypes = this.appService.appConfig.warningTypes;

        this.subscriptions.add(this.apiRequest.getRequest(`${this.appService.baseURI}/GetObject?synapsenamespace=core&synapseentityname=person&id=${this.appService.personId}`).subscribe(
          (person) => {
            person = JSON.parse(person);
            if (person && person.dateofbirth) {
              this.appService.personDOB = person.dateofbirth as Date;
            }
            //emit events after getting initial config. //this happens on first load only.
            this.appService.logToConsole("Service reference is being published from init config");
            this.subjects.apiServiceReferenceChange.next();
            this.appService.logToConsole("personid is being published from init config");
            this.subjects.personIdChange.next();
            this.getAllPrescription(() => {
              let pi = new PatientInfo();
              pi.age = 40;
              pi.gender = 2;
              pi.weight = 70;
              pi.bsa = 0;
              pi.allergens = [];
              let p = []// this.appService.Prescription.slice(1, 2);
              let c = this.appService.Prescription;

              this.warningService.GetExistingWarnings(this.refreshonload, (data) => {
                this.warningService.RefreshCurrentMedicationWarnings(c, pi, (data) => {
                  this.warningService.showExistingWarnings = true;
                });
              });


              // this.warningService.GetNewWarnings(p, c, pi, (data) => {
              //   this.warningService.showNewWarnings = true;
              // });




            });

          }));

      }));
  }

  initConfigAndGetMeta(value: any) {
    this.appService.apiService = value;
    this.warningService.subscriptions = new Subscription();
    this.subscriptions.add(this.apiRequest.getRequest("./assets/config/WarningConfig.json?V" + Math.random()).subscribe(
      (response) => {
        this.appService.appConfig = response;
        this.appService.baseURI = this.appService.appConfig.uris.baseuri;
        this.appService.fdbURI = this.appService.appConfig.uris.fdburi;
        this.appService.enableLogging = this.appService.appConfig.enablelogging;
        this.appService.warningSeverity = this.appService.appConfig.warningSeverity;
        this.appService.warningTypes = this.appService.appConfig.warningTypes;

        this.warningService.GetExistingWarnings(this.refreshonload, (data) => {
          this.onloadcomplete.emit(this.warningService);
        });


      }));
  }


  getAllPrescription(cb: () => any) {
    this.subscriptions.add(
      this.apiRequest.postRequest(this.appService.baseURI + "GetBaseViewListByPost/epma_prescriptiondetail", this.createPrescriptionFilter())
        .subscribe((response) => {
          this.appService.Prescription = [];
          // this.appService.Medication = [];
          for (let prescription of response) {
            if (prescription.correlationid) {
              prescription.__posology = JSON.parse(prescription.__posology);
              prescription.__routes = JSON.parse(prescription.__routes);
              prescription.__medications = JSON.parse(prescription.__medications);
              this.appService.Prescription.push(<Prescription>prescription);
            }
          }
          cb();
        })
    )
  }
  GetWarningDisplay(item) {
    let wt = DisplayWarningType[(<Warnings>item).warningtype];
    if ((<Warnings>item).msgtype && wt == DisplayWarningType.mandatoryinstruction) {
      return wt + " (" + (<Warnings>item).msgtype + ") ";
    }
    else
      if ((<Warnings>item).fdbseverity != null && (wt == DisplayWarningType.contraindication || wt == DisplayWarningType.precaution || wt == DisplayWarningType.druginteraction)) {
        return wt + " - " + (<Warnings>item).fdbseverity;
      }
      else
        return wt;
  }

  DisplayPrimaryMedicationName(w: Warnings) {
    switch (w.warningtype) {
      case WarningType.contraindication:
      case WarningType.precaution:
      case WarningType.drugwarnings:
      case WarningType.mandatoryinstruction:
      case WarningType.safetymessage:
      case WarningType.custom:
        {
          return w.primarymedicationname + " - "
        }
    }
    return "";
  }
  ngOnInit() {

  }
  // showWarnings() {
  //   this.overrideExistingWarning = this.warningService.existingWarnigns.filter(x => x.overriderequired).sort((a, b) => a.warningtype.localeCompare(b.warningtype));
  //   this.otherExistingWarning = this.warningService.existingWarnigns.filter(x => !x.overriderequired).sort((a, b) => a.warningtype.localeCompare(b.warningtype));

  //   this.overrideNewWarning = this.warningService.newWarnings.filter(x => x.overriderequired).sort((a, b) => a.warningtype.localeCompare(b.warningtype));
  //   this.otherNewWarning = this.warningService.newWarnings.filter(x => !x.overriderequired).sort((a, b) => a.warningtype.localeCompare(b.warningtype));

  //   this.onloadcomplete.emit(this.warningService);
  // }
  saveComments(comment) {
    if (this.appService.AuthoriseAction('epma_override_warning')) {
      this.warningService.UpdateOverrideMsg(comment, (data) => {
      });
    }
  }
  updateCommentStatus(comment) {
    if (this.appService.AuthoriseAction('epma_override_warning')) {
      this.warningService.SetNewWarningStatus();
      this.cd.detectChanges();
    }
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.warningService = null;
    this.appService = null;
  }
  private createPrescriptionFilter() {
    let condition = "person_id = @person_id and encounter_id = @encounter_id";
    let f = new filters()
    f.filters.push(new filter(condition));

    let pm = new filterParams();
    pm.filterparams.push(new filterparam("person_id", this.appService.personId));
    pm.filterparams.push(new filterparam("encounter_id", this.encouterId));

    let select = new selectstatement("SELECT *");

    let orderby = new orderbystatement("ORDER BY prescription_id desc");

    let body = [];
    body.push(f);
    body.push(pm);
    body.push(select);
    body.push(orderby);

    return JSON.stringify(body);
  }
}

export class IContext {
  encouterId?: string
  personId?: string
  refreshonload: boolean
  apiService: any;
  existingwarnings: boolean;
  newwarnings: boolean;
  enableOverride: boolean;
}

