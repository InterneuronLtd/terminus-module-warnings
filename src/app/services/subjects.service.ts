//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2023  Interneuron Holdings Ltd

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
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  encounterChange = new Subject();
  personIdChange = new Subject();
  apiServiceReferenceChange = new Subject();
  unload = new Subject();
  frameworkEvent = new Subject();
  weightChanged = new Subject();
  prescriptionHistory = new Subject();
  additionalAdministration = new Subject();
  drugInformation = new Subject();
  addBolus = new Subject();
  changeInfusion = new Subject();
  adjustInfusion = new Subject();
  pauseInfusion = new Subject();
  restartInfusion = new Subject();
  refreshDrugChart = new Subject();
  editPrescription = new Subject();
  reloadPrescriptions = new Subject();
  refreshTemplate = new Subject();
  clonePrescription = new Subject();
  therapyOverview = new Subject();
  comments = new Subject();
  viewReminder = new Subject();
  patientDrug = new Subject();
  supplyRequest = new Subject();
  pharmacyReview = new Subject();
  reconcillationNotes = new Subject();
  CompleteReconciliation = new Subject();
  nursingInstruction = new Subject();
  closePform = new Subject();
  movePatientDrugs = new Subject();
  refreshWarning= new Subject();
  constructor() {
  }
}
