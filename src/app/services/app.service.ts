//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

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
import { Injectable } from '@angular/core';
import { Encounter } from '../models/encounter.model';
import {jwtDecode} from 'jwt-decode';
import { Prescription, Posology, Dose, DoseEvents, Medication, Medicationadministration, Medicationcodes, Medicationingredients, Medicationroutes, MetaPrescriptionstatus, MetaPrescriptionduration, MetaPrescriptionadditionalcondition, Prescriptionroutes, InfusionEvents, PrescriptionSource, Oxygendevices, MetaReviewstatus, SupplyRequest, Prescriptionreminders, Prescriptionreviewstatus, MetaPrescriptioncontext } from "src/app/models/EPMA"
import { action } from '../models/filter.model';
import { Observation, Observationscaletype, PersonObservationScale } from '../models/observations.model';
import * as moment from 'moment';

import { PrescriptionContext } from './enum';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  isAppDataReady: boolean;
  showdrugChart: boolean;
  showDischargeSummaryNotes: boolean = true;
  warningTypes: string[];
  encounterId: string;

  constructor() { }
  public oxygenprescriptionadditionalinfo = [];
  public batchIndex = 0;
  public linkedBatchArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  public enableLogging = true;
  public appConfig: any;
  public buffertimeAmber: number;
  public bufferAdministered: number;
  public apiService: any;
  public baseURI: string;
  public fdbURI: string;
  public prescriptionId: string;
  public personId: string;
  public encounter: Encounter;
  public isCurrentEncouner = false;
  public MetaPrescriptionstatus: Array<MetaPrescriptionstatus>;
  public MetaReviewstatus: Array<MetaReviewstatus>;
  public MetaPrescriptioncontext: Array<MetaPrescriptioncontext>;
  public Prescription: Array<Prescription>;
  public Prescriptionreminders: Array<Prescriptionreminders>;
  public PrescriptionBag: any;
  public Prescriptionreviewstatus: Array<Prescriptionreviewstatus>;
  public FilteredPrescription: Array<Prescription>;
  public TherapyPrescription: Array<Prescription>;
  //public Posology: Array<Posology>;
  //public Dose: Array<Dose>;
  public events: any = [];
  public DoseEvents: Array<DoseEvents>;
  public InfusionEvents: Array<InfusionEvents>;
  //public Medication: Array<Medication>;
  public Medicationadministration: Array<Medicationadministration>;
  //public Medicationingredients: Array<Medicationingredients>;
  //public Medicationroutes: Array<Medicationroutes>;
  //public Prescriptionroutes: Array<Prescriptionroutes>;
  public MetaPrescriptionDuration: Array<MetaPrescriptionduration>;
  //public Medicationcodes: Array<Medicationcodes>;
  public DrugeGroupsType: Array<string>;

  public VtmUnits: any[];
  public oxygenDevices: Array<Oxygendevices> = [];

  public MetaPrescriptionadditionalcondition: Array<MetaPrescriptionadditionalcondition>;
  public openPrescriptionHistory: boolean = false;
  public openAdditionalAdministration: boolean = false;
  public MetaPrescriptionSource: Array<PrescriptionSource>;

  public roleActions: action[] = [];
  public loggedInUserName: string = null;
  public obsScales: Array<Observationscaletype> = [];
  public observation: Array<Observation> = [];
  public personAgeAtAdmission: number;
  public personDOB: Date;
  public personscale: PersonObservationScale = null;
  public currentEWSScale: string;
  public isWeightCaptured: boolean = false;
  public isWeightCapturedForToday: boolean = false;
  public refWeightValue: number;
  public refWeightRecordedOn: string;
  public isHeightCaptured: boolean = false;
  public refHeightValue: number;
  public bodySurfaceArea: number;
  public therapyCurrentDate: any;
  public therapyNoOfDays: number;
  public drugGroupOption: string;
  public drugRouteOption: string;
  public drugSortOrder: string;
  public SupplyRequest: Array<SupplyRequest> = [];
  public warningSeverity: any[];
  reset(): void {
    this.personId = null;
    this.encounter = null;
    this.isCurrentEncouner = null;
    this.apiService = null;
    this.baseURI = null;
    this.loggedInUserName = null;
    this.enableLogging = true;
    this.roleActions = [];
    this.personDOB = null;
    this.personAgeAtAdmission = null;
    this.personscale = null;
    this.currentEWSScale = null;
    this.obsScales = [];
    this.prescriptionId = null;
    this.Prescription.forEach(p => {
      p.__posology.forEach(pos => {
        pos.__dose = null;
        pos = null;
      });

      p.__medications.forEach(m => {
        m.__codes.forEach(c => {
          c = null;
        });
        m.__ingredients.forEach(i => {
          i = null;
        });
        m = null;
      });
      p.__medications = null;
      p.__routes.forEach(r => {
        r = null
      });
      p.__routes = null;
      p.__editingprescription = null;
      p.__editingreviewstatus = null;
      p.__initialreminder = null;

    });

    this.MetaPrescriptionstatus = [];
    this.MetaReviewstatus = [];

    this.Prescription = [];
    this.FilteredPrescription = [];
    this.TherapyPrescription = [];
    this.isWeightCaptured = false;
    this.isHeightCaptured = false;
    this.isWeightCapturedForToday = false;
    this.InfusionEvents = [];
    this.DoseEvents = [];
    //this.Prescriptionroutes = [];
    // this.Posology = [];
    //this.Dose = [];
    this.events = null;;
    this.DoseEvents = [];
    this.InfusionEvents = [];
    // this.Medication = [];
    this.Medicationadministration = [];
    //this.Medicationingredients = [];
    //this.Medicationroutes = [];
    //this.Prescriptionroutes = [];
    this.MetaPrescriptionDuration = [];
    // this.Medicationcodes = [];
    this.DrugeGroupsType = [];

    this.VtmUnits = [];
    this.PrescriptionBag = [];
    this.MetaPrescriptionadditionalcondition = [];
    this.openPrescriptionHistory = null;
    this.openAdditionalAdministration = null;
    this.MetaPrescriptionSource = [];
    this.Prescriptionreminders = [];
    this.roleActions = [];
    this.loggedInUserName = null;
    this.obsScales = [];
    this.observation = [];
    this.personAgeAtAdmission = null;
    this.personDOB = null;
    this.personscale = null;
    this.currentEWSScale = null;
    this.isWeightCaptured = null;
    this.isWeightCapturedForToday = null;
    this.refWeightValue = null;
    this.refWeightRecordedOn = null;
    this.isHeightCaptured = null;
    this.refHeightValue = null;
    this.bodySurfaceArea = null;
    this.therapyCurrentDate = null;
    this.therapyNoOfDays = null;
    this.drugGroupOption = null;
    this.drugRouteOption = null;
    this.drugSortOrder = null;
    this.SupplyRequest = [];
    this.oxygenDevices = [];
    this.oxygenprescriptionadditionalinfo = [];
    this.isAppDataReady = false;
    this.batchIndex = 0;
    this.Prescriptionreviewstatus = [];

  }


  decodeAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    }
    catch (Error) {
      this.logToConsole(`Error: ${Error}`);
      return null;
    }
  }


  public AuthoriseAction(action: string): boolean {
    if (this.appConfig && this.appConfig.enableRBAC)
      return this.roleActions.filter(x => x.actionname.toLowerCase().trim() == action.toLowerCase()).length > 0;
    else
      return true;
  }

  public getPrescriptionBags() {
    this.batchIndex = 0;
    this.PrescriptionBag = [];
    let allprescriptionbatches = this.Prescription.slice();
    allprescriptionbatches.sort((a, b) => new Date(a.createdon).getTime() - new Date(b.createdon).getTime());
    for (let prescription of allprescriptionbatches) {
      if (this.PrescriptionBag.find(x => x.prescriptionid == prescription.prescription_id)) {
        continue;
      }
      if (prescription.linkedinfusionid) {
        let letterBatch = "";
        if (this.PrescriptionBag.find(x => x.prescriptionid == prescription.linkedinfusionid)) {
          let temp = this.PrescriptionBag.find(x => x.prescriptionid == prescription.linkedinfusionid).Batch;
          letterBatch = temp.split("-")[0];
          letterBatch = letterBatch + "-" + (+temp.split("-")[1] + 1).toString();
          this.PrescriptionBag.push(
            {
              prescriptionid: prescription.prescription_id,
              Batch: letterBatch

            }
          );
        }

        else {
          let batchletter = this.getlinkedArrayLetter();
          this.PrescriptionBag.push({
            prescriptionid: prescription.linkedinfusionid,
            Batch: batchletter + "-0"
          }
          );
          this.PrescriptionBag.push({
            prescriptionid: prescription.prescription_id,
            Batch: batchletter + "-1"
          }
          );
        }
      }
    }
  }

  public getMultilinkPrescriptionBags() {
    this.batchIndex = 0;
    this.PrescriptionBag = [];
    let allprescriptionbatches = this.Prescription.slice();
    allprescriptionbatches.sort((a, b) => new Date(a.createdon).getTime() - new Date(b.createdon).getTime());
    for (let prescription of allprescriptionbatches) {
      if (this.PrescriptionBag.find(x => x.prescriptionid == prescription.prescription_id)) {
        continue;
      }
      if (prescription.linkedinfusionid) {
        let letterBatch = "";
        if (this.PrescriptionBag.find(x => x.prescriptionid == prescription.linkedinfusionid)) {
          let parentbag = this.PrescriptionBag.find(x => x.prescriptionid == prescription.linkedinfusionid).Batch;
          let count = 1;
          let multilink = allprescriptionbatches.filter(x => x.linkedinfusionid == prescription.linkedinfusionid)
          for (let linkprescri of multilink) {
            letterBatch = parentbag + "." + count;
            this.PrescriptionBag.push(
              {
                prescriptionid: linkprescri.prescription_id,
                Batch: letterBatch

              }
            );
            count++;
          }

        }

        else {
          let batchletter = this.getlinkedArrayLetter();
          this.PrescriptionBag.push({
            prescriptionid: prescription.linkedinfusionid,
            Batch: batchletter
          }
          );
          let count = 1;
          let multilink = allprescriptionbatches.filter(x => x.linkedinfusionid == prescription.linkedinfusionid)
          for (let linkprescri of multilink) {
            letterBatch = batchletter + "." + count;
            this.PrescriptionBag.push(
              {
                prescriptionid: linkprescri.prescription_id,
                Batch: letterBatch

              }
            );
            count++;
          }

        }
      }
    }
  }

  getlinkedArrayLetter() {
    this.batchIndex++;
    return this.linkedBatchArray.charAt(this.batchIndex - 1);

  }
  public getDateTimeinISOFormat(date: Date): string {

    var time = date;
    var hours = time.getHours();
    var s = time.getSeconds();
    var m = time.getMilliseconds()
    var minutes = time.getMinutes();
    date.setHours(hours);
    date.setMinutes(minutes);
    //date.setSeconds(s);
    //date.setMilliseconds(m);
    //this.appService.logToConsole(date);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1);
    let dt = date.getDate();
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    let msecs = date.getMilliseconds();
    let returndate = (year + "-" + (month < 10 ? "0" + month : month) + "-" + (dt < 10 ? "0" + dt : dt) + "T" + (hrs < 10 ? "0" + hrs : hrs) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs) + "." + (msecs < 10 ? "00" + msecs : (msecs < 100 ? "0" + msecs : msecs)));
    //this.appService.logToConsole(returndate);
    return returndate;
  }

  setPatientAgeAtAdmission() {
    this.personAgeAtAdmission = moment(this.encounter.admitdatetime, moment.ISO_8601).diff(moment(this.personDOB, moment.ISO_8601), "years");
  }

  logToConsole(msg: any) {
    if (this.enableLogging) {
      console.log(msg);
    }
  }
  setCurrentScale() {
    let scale = "";
    if (this.personAgeAtAdmission < 19) {
      if (this.personAgeAtAdmission <= 0)
        scale = "PEWS-0To11Mo";
      else if (this.personAgeAtAdmission >= 1 && this.personAgeAtAdmission <= 4)
        scale = "PEWS-1To4Yrs";
      else if (this.personAgeAtAdmission >= 5 && this.personAgeAtAdmission <= 12)
        scale = "PEWS-5To12Yrs";
      else if (this.personAgeAtAdmission >= 13 && this.personAgeAtAdmission <= 18)
        scale = "PEWS-13To18Yrs";

    } else
      if (this.personscale) {

        scale = this.obsScales.filter(x => x.observationscaletype_id == this.personscale.observationscaletype_id)[0].scaletypename;
      }
      else {
        scale = "NEWS2-Scale1";
      }
    this.currentEWSScale = scale;
    return scale;
  }



  checkMedicineTypeForMoa(prescription: Prescription) {
    if (prescription.prescriptioncontext_id ==
      this.MetaPrescriptioncontext.find(x => x.context == PrescriptionContext.Admission).prescriptioncontext_id) {
      return true;
    } else {
      let formularycode = prescription.__medications.find(x => x.isprimary).__codes.find
        (y => y.terminology == "formulary").code;

      // let codeobject = this.Prescription.find(x => x.prescriptioncontext_id ==
      //   this.MetaPrescriptioncontext.find(w => w.context == PrescriptionContext.Admission).prescriptioncontext_id)
      //   .__medications.find(y => y.isprimary == true).__codes.
      //   find(z => z.terminology == "formulary" && z.code == formularycode)

      let medcode = prescription.__medications.find(m => m.isprimary).__codes.find(c => c.terminology == "formulary").code;

      let codeobject = this.Prescription.find(p =>
        p.prescription_id != prescription.prescription_id &&
        p.prescriptioncontext_id == this.MetaPrescriptioncontext.find(w => w.context == PrescriptionContext.Admission).prescriptioncontext_id &&
        p.__medications.find(m => m.isprimary).__codes.find(c => c.terminology == "formulary").code == medcode);


      if (codeobject) {
        return true;// MOA match and no need to show
      } else {
        return false // Code not found and MOA prescription not prescribed
      }
    }
  }

  GetCurrentPosology(p: Prescription, pos_id: string = null) {
    if (pos_id) {
      return p.__posology.find(p => p.posology_id == pos_id);
    }
    else
      return p.__posology.find(p => p.iscurrent == true);
  }
}




