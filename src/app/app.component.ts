//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2024  Interneuron Limited

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
import { WarningContexts, WarningService } from './services/warning.service';
import { environment } from 'src/environments/environment';
import { ApirequestService } from './services/apirequest.service';
import { AppService } from './services/app.service';
import { SubjectsService } from './services/subjects.service';
import { Subscription } from 'rxjs';
import { DisplayWarningType, PatientInfo, WarningContext, Warnings, WarningType } from './models/warning.model';
import { filter, filterparam, filterParams, filters, orderbystatement, selectstatement } from './models/filter.model';
import { DataRequest } from './services/datarequest';
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
  @Input() initialcontext: WarningContext | string = WarningContext.ip;
  @Output() onloadcomplete = new EventEmitter<any>();
  subscriptions = new Subscription();
  showExistingWarnings: boolean = true;
  showNewWarnings: boolean = false;
  showAllwarning: boolean = false;
  enableOverride: boolean = true;
  ws: WarningService;
  viewOnly:boolean =false;
  filterDisplayByPresId = "";
  filterDisplayByMedCode = ""; 


  @Input() set moduleContext(value: IContext) {
    this.appService.personId = value.personId;
    //this.appService.encounterId = value.encouterId;
    this.appService.apiService = value.apiService;
    this.initialcontext = value.warningContext ?? WarningContext.ip
    this.refreshonload = value.refreshonload;
    this.viewOnly = value.viewOnly;
    this.filterDisplayByPresId = value.filterDisplayByPresId;
    this.filterDisplayByMedCode = value.filterDisplayByMedCode;
    this.initConfigAndGetMeta(this.appService.apiService,value);
    this.showExistingWarnings = value.existingwarnings;
    this.showNewWarnings = value.newwarnings;
    this.enableOverride = value.enableOverride;
    this.warningServices.encounterId = value.encouterId;
    this.warningServices.personId = value.personId
   
  }
  // overrideExistingWarning: Warnings[] = [];
  // otherExistingWarning: Warnings[] = [];
  // overrideNewWarning: Warnings[] = [];
  // otherNewWarning: Warnings[] = [];

  dummyData: any;
  constructor(private subjects: SubjectsService, public appService: AppService,
    private apiRequest: ApirequestService,
    public warningServices: WarningContexts, public cd: ChangeDetectorRef, public dr: DataRequest) {



    this.subscriptions.add(this.subjects.refreshWarning.subscribe
      ((event) => {
        cd.detectChanges();
      }));

  }
  initDevMode() {
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
    let ws = this.warningServices.GetWarningsInstanceWithCreate(WarningContext.ip);
    //this.showExistingWarnings = true;
    this.ws = ws;
    this.ws.personId = "b0d70586-3206-4bd2-93f8-86a9947a8659"//"774c605e-c2c6-478d-90e6-0c1230b3b223";//"4d05aff8-123f-4ca9-be06-f9734905c02f"//"d91ef1fa-e9c0-45ba-9e92-1e1c4fd468a2"// "027c3400-24cd-45c1-9e3d-0f4475336394" ;//  "6b187a8b-1835-42c2-9cd5-91aa0e39f0f7";//"6b187a8b-1835-42c2-9cd5-91aa0e39f0f7"//"774c605e-c2c6-478d-90e6-0c1230b3b223";//"0422d1d0-a9d2-426a-b0b2-d21441e2f045";//"6b187a8b-1835-42c2-9cd5-91aa0e39f0f7"; //"17775da9-8e71-4a3f-9042-4cdcbf97efec";// "429904ca-19c1-4a3a-b453-617c7db513a3";//"027c3400-24cd-45c1-9e3d-0f4475336394";//"429904ca-19c1-4a3a-b453-617c7db513a3";
    this.ws.encounterId = "3bc0d957-df84-43e2-8eda-0298754d5726";
    this.appService.apiService = value;
    this.subscriptions.add(this.apiRequest.getRequest("./assets/config/WarningConfig.json?V" + Math.random()).subscribe(
      (response) => {
        this.appService.appConfig = response;
        this.appService.baseURI = this.appService.appConfig.uris.baseuri;
        this.appService.fdbURI = this.appService.appConfig.uris.fdburi;
        this.appService.enableLogging = this.appService.appConfig.enablelogging;
        this.appService.warningSeverity = this.appService.appConfig.warningSeverity;
        this.appService.warningTypes = this.appService.appConfig.warningTypes;

        this.subscriptions.add(this.apiRequest.getRequest(`${this.appService.baseURI}/GetObject?synapsenamespace=core&synapseentityname=person&id=${this.ws.personId}`).subscribe(
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
            this
            this.getAllPrescription(() => {
              let pi = new PatientInfo();
              pi.age = 40;
              pi.gender = 2;
              pi.weight = 70;
              pi.bsa = 0;
              pi.allergens = [{
                "uname": "Amoxicillin",
                "code": "372687004",
                "type": 1
              }];
              let p = []// this.appService.Prescription.slice(1, 2);
              this.getAllPrescriptionMeta(() => {
                let c = this.appService.Prescription.filter(
                  p =>
                    (p.prescriptionstatus_id == this.appService.MetaPrescriptionstatus.find(mp => mp.status === "active").prescriptionstatus_id
                      ||
                      p.prescriptionstatus_id == this.appService.MetaPrescriptionstatus.find(mp => mp.status === "modified").prescriptionstatus_id
                      ||
                      p.prescriptionstatus_id == this.appService.MetaPrescriptionstatus.find(mp => mp.status === "restarted").prescriptionstatus_id

                    )
                    &&
                    p.prescriptioncontext_id == this.appService.MetaPrescriptioncontext.find(pc => pc.context === "Inpatient").prescriptioncontext_id
                )

                ws.GetExistingWarnings(this.refreshonload, (data) => {
                  ws.RefreshCurrentMedicationWarnings(c, pi, (data) => {
                    this.showExistingWarnings = true;
                  });
                });

                
              });

             
            });
          }));
      }));
  }

  // get all metadata
  getAllPrescriptionMeta(cb: () => any) {
    this.subscriptions.add(
        this.apiRequest.getRequest(this.appService.baseURI + "/GetBaseViewList/epma_prescriptionmeta")
            .subscribe((response) => {
                this.appService.oxygenDevices = [];
                this.appService.oxygenprescriptionadditionalinfo = [];
                this.appService.obsScales = [];
                this.appService.MetaReviewstatus = [];
                this.appService.MetaPrescriptionstatus = [];
                this.appService.MetaPrescriptionDuration = [];
                this.appService.MetaPrescriptionadditionalcondition = [];
                this.appService.MetaPrescriptionSource = [];
                this.appService.MetaPrescriptioncontext = [];

                for (let meta of JSON.parse(response)) {
                    switch (meta.field) {
                        case "oxygendevices": this.appService.oxygenDevices = JSON.parse(meta.data);
                            break;
                        case "oxygenprescriptionadditionalinfo": this.appService.oxygenprescriptionadditionalinfo = JSON.parse(meta.data);
                            break;
                        case "observationscaletype": this.appService.obsScales = JSON.parse(meta.data);
                            break;
                        case "reviewstatus": this.appService.MetaReviewstatus = JSON.parse(meta.data);
                            break;
                        case "prescriptionstatus": this.appService.MetaPrescriptionstatus = JSON.parse(meta.data);
                            break;
                        case "prescriptionduration": this.appService.MetaPrescriptionDuration = JSON.parse(meta.data);
                            break;
                        case "prescriptionadditionalconditions": this.appService.MetaPrescriptionadditionalcondition = JSON.parse(meta.data);
                            break;
                        case "prescriptionsource": this.appService.MetaPrescriptionSource = JSON.parse(meta.data);
                            break;
                        case "prescriptioncontext": this.appService.MetaPrescriptioncontext = JSON.parse(meta.data);

                    }
                }
                cb();
            })
    )
}

  initConfigAndGetMeta(apiService: any, value:IContext) {
    this.appService.apiService = apiService;

    let ws = this.warningServices.GetWarningsInstanceWithCreate(this.initialcontext);
    ws.encounterId = value.encouterId;
    ws.personId = value.personId;
    this.ws = ws;

    ws.subscriptions = new Subscription();
    this.subscriptions.add(this.apiRequest.getRequest("./assets/config/WarningConfig.json?V" + Math.random()).subscribe(
      (response) => {
        this.appService.appConfig = response;
        this.appService.baseURI = this.appService.appConfig.uris.baseuri;
        this.appService.fdbURI = this.appService.appConfig.uris.fdburi;
        this.appService.enableLogging = this.appService.appConfig.enablelogging;
        this.appService.warningSeverity = this.appService.appConfig.warningSeverity;
        this.appService.warningTypes = this.appService.appConfig.warningTypes;
        ws.GetExistingWarnings(this.refreshonload, (data) => {
     
          this.onloadcomplete.emit(this.warningServices);

        });
      }));
  }
  FilterWarning(err:Warnings) {
    if(this.viewOnly == true) {
      if(!this.filterDisplayByPresId || !this.filterDisplayByMedCode) { return true}
       else {
      return(err.primaryprescriptionid==this.filterDisplayByPresId || err.secondaryprescriptionid == this.filterDisplayByPresId 
        || err.primarymedicationcode== this.filterDisplayByMedCode || err.secondarymedicationcode == this.filterDisplayByMedCode)
      } 
    } else 
    return true;
  }
  getAllPrescription(cb: () => any) {


    this.subscriptions.add(
      this.apiRequest.postRequest(this.appService.baseURI + "/GetBaseViewListByPost/epma_prescriptiondetail", this.createPrescriptionFilter())
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
      else if (wt == DisplayWarningType.drugwarnings && (<Warnings>item).overriderequired) {
        if (this.appService.warningSeverity.filter(z => z.matchcriteria.warningType.find(x => x.includes(WarningType.drugwarnings)
          && z.matchcriteria.patientspecific == item.ispatientspecific
          && z.matchcriteria.matchcondition.find
            (mc => mc.keycolumn == "warningcategories" && mc.keyvalue == "Advice on possible excipients") != null
          && (<Warnings>item).warningcategories.indexOf("Advice on possible excipients") != -1
        )).length != 0) {
          return wt + " - Advice on possible excipients ";
        }
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
    if (!environment.production)
      this.initDevMode();
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
      this.ws.UpdateOverrideMsg(comment, (data) => {
      });
    }
  }
  updateCommentStatus(comment) {
    if (this.appService.AuthoriseAction('epma_override_warning')) {
      this.ws.SetNewWarningStatus();
      this.cd.detectChanges();
    }
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.warningServices.contexts.forEach(w => {
      //w.subscriptions.unsubscribe();
    });
    this.ws = null;
    this.ws = null;
    this.warningServices = null;
    console.log("unloaded main warnigns component");
  }
  private createPrescriptionFilter() {
    let condition = "person_id = @person_id and encounter_id = @encounter_id";
    let f = new filters()
    f.filters.push(new filter(condition));

    let pm = new filterParams();
    pm.filterparams.push(new filterparam("person_id", this.ws.personId));
    pm.filterparams.push(new filterparam("encounter_id", this.ws.encounterId));

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
  warningContext: WarningContext;
  viewOnly: boolean;
  filterDisplayByPresId: string;
  filterDisplayByMedCode:string; 
}

