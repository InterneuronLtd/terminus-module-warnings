//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2022  Interneuron CIC

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
export class Warnings {
  public epma_warnings_id: string
  public person_id: string
  public encounter_id: string
  public primarymedicationcode: string
  public secondarymedicationcode: string
  public primarymedicationname: string
  public secondarymedicationname: string
  public primaryprescriptionid: string
  public secondaryprescriptionid: string
  public fdbmessageid: string
  public warningtype: string
  public message: string
  public severity: number
  public fdbseverity: string
  public overridemessage: string
  public overriderequired: boolean
  public allergencode: string
  public allergeningredient: string
  public drugingredient: string
  public allergenmatchtype: string
  public updatetrigger: string
  public warningcategories: string
  public ispatientspecific: boolean
  public msgtype: string
  public sortOrder: number=0;
}
export class PatientWarnings {
  public epma_patientwarnings_id: string
  public person_id: string
  public encounter_id: string
  public warnings: string
  public warningcontextid:string
}
export class FDBDataRequestPatientSpecific {
  public products: FDBDataRequest[] = [];
  public currentproducts: FDBDataRequest[] = [];
  public patientinfo: PatientInfo;
  public warningtypes: string[];
}
export class FDBDataRequest {
  public productType: string
  public productCode: string
  public nameIdentifier: string
  public therapyName: string
  public routes: Route[]
}

export class Route {
  public name: string;
  public code: string;
}

export class PatientInfo {
  public gender: number
  public age: number
  public weight: number
  public bsa: number
  public allergens: Allergens[]
}

export class Allergens {
  public uname: string
  public type: number
  public code: string
}



export enum WarningType {
  ["contraindication"] = "contraindication",
  ["precaution"] = "precaution",
  ["drugwarnings"] = "drugwarnings",
  ["safetymessage"] = "safetymessage",
  ["mandatoryinstruction"] = "mandatoryinstruction",
  ["sideeffect"] = "sideeffect",
  ["druginteraction"] = "druginteraction",
  ["drugdoubling"] = "drugdoubling",
  ["drugequivalance"] = "drugequivalance",
  ["duplicatetherapy"] = "duplicatetherapy",
  ["sensitivity"] = "sensitivity",
  ["custom"] = "custom",
  ["error"] = "error"

}
export enum DisplayWarningType {
  ["contraindication"] = "Contraindication",
  ["precaution"] = "Precaution",
  ["drugwarnings"] = "Drug Warnings",
  ["safetymessage"] = "Safety Message",
  ["mandatoryinstruction"] = "Mandatory Instruction",
  ["sideeffect"] = "Side Effect",
  ["druginteraction"] = "Drug Interaction",
  ["drugdoubling"] = "Drug Doubling",
  ["drugequivalance"] = "Drug Equivalance",
  ["duplicatetherapy"] = "Duplicate Therapy",
  ["sensitivity"] = "Sensitivity",
  ["custom"] = "Custom",
  ["error"] = "Error"

}

export enum EPMASeverity {
  ["High"] = 4,
  ["Moderate"] = 3,
  ["Low"] = 2,
  ["Other"] = 1
}

export enum WarningContext {
  ["ip"] = "ip",
  ["mod"] = "mod"
}
