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

export class Prescription {
	public prescription_id: string
	public correlationid: string
	public prescriptioncontext_id: string
	public indication: string
	public comments: string
	public heparin: number
	public heparinunit: string
	public prescriptionadditionalconditions_id: string
	public reminderdays: number
	public remindernotes: string
	public titration: boolean
	public titrationtype: string
	public targetinr: number
	public targetsaturation: number
	public oxygendevices_id: string
	public orderformtype: string
	public isinfusion: boolean
	public infusiontype_id: string
	public ismedicinalgas: boolean
	public prescriptionsource_id: string
	public hasbeenmodified: boolean
	public reasonforediting: string
	public lastmodifiedby: string
	public lastmodifiedon: any;
	public prescriptionstatus_id: string
	public epma_prescriptionevent_id: string
	public reasonforstopping: string
	public reasonforsuspending: string
	public allowsubstitution: boolean
	public substitutioncomments: string
	public person_id: string
	public encounter_id: string
	public createdon: any
	public createdby: string
	public linkedinfusionid: string;
	public titrationtargetmin: number;
	public titrationtargetmax: number;
	public titrationtargetunits: string;
	public titrationtypecode: string;
	public otherindications: string;
	public prescriptionsources: string;
	public dispensingfrom: string;
	public ismodifiedrelease: boolean;
	public isgastroresistant: boolean;
	public moatoip: boolean;
	public otherprescriptionsource: string
	public lastmodifiedfrom: any;
	public startdatetime: any;

	public __customWarning: any;
	public __warningOverrideREQ: boolean;
	public __severityWarning: string
	public __routes: Array<Prescriptionroutes>
	public __posology: Posology[]
	public __medications: Array<Medication>
	public __editingprescription: Prescription
	public __therapydate: any
	public oxygenadditionalinfo: string
	public __editingreviewstatus: Prescriptionreviewstatus
	public __index: number
	public __initialreminder: Prescriptionreminders[]
	public __nursinginstructions: Array<any>;
	public __drugindications: any[]
	public __drugcodes: any[]
	public __basicGroup:string

}

export class Posology {

	public posology_id: string
	public correlationid: string
	public prescription_id: string
	public prescriptionstartdate: any
	public prescriptionenddate: any
	public frequency: string
	public frequencysize: number
	public infusiontypeid: string
	public infusionrate: number
	public infusionduration: number
	public daysofweek: string
	public dosingdaysfrequency: string
	public dosingdaysfrequencysize: number
	public prescriptionduration: string
	public prescriptiodurationsize: number
	public repeatlastday: boolean
	public repeatprotocoltimes: number
	public doseperkg: number
	public dosepersa: number
	public antimicrobialstartdate: any
	public doctorsorder: boolean
	public prn: boolean
	public isadditionaladministration: boolean
	public person_id: string
	public encounter_id: string
	public __dose: Array<Dose>
	public classification: string
	public dosetype: string
	public repeatlastdayuntil: any
	public totalinfusionvolume: number
	public totalquantity: number
	public infusionrateunits: string;
	public maxnumofdosesperday: number;
	public totalquantitytext: string;
	public titration: boolean
	public titrationtype: string
	public titrationtargetmin: number;
	public titrationtargetmax: number;
	public titrationtargetunits: string;
	public titrationtypecode: string;
	public iscurrent: boolean;
	
}

export class Dose {
	public dose_id: string
	public correlationid: string
	public prescription_id: string
	public posology_id: string
	public dosestartdatetime: any
	public doseenddatatime: any
	public strengthneumerator: number
	public strengthdenominator: number
	public strengthneumeratorunit: string
	public strengthdenominatorunit: string
	public dosesize: string
	public doseunit: string
	public dosemeasure: string
	public descriptivedose: string
	public infusionrate: number
	public infusionduration: number
	public titration: boolean
	public titrateddoseconfirmedon: any
	public titrateddoseconfirmedby: string
	public lastmodifiedby: string
	public isadditionaladministration: boolean
	public additionaladministrationcomment: string;
	public person_id: string
	public encounter_id: string
	public dosetype: string
	public continuityid: string
	public isbolus: boolean
	public dosesizerangemax:number
	public strengthneumeratorrangemax: number
	public strengthdenominatorrangemax: number
	public __doseEvent: Array<DoseEvents>
}

export class Medicationadministration {

	public medicationadministration_id: string
	public site: string
	public method: string
	public dose_id: string
	public prescription_id: string
	public posology_id: string
	public administrationstartime: any
	public administrationendtime: any
	public administredby: string
	public planneddatetime: any
	public administeredstrengthneumerator: number
	public administeredstrengthneumeratorunits: string
	public administeredstrengthdenominator: number
	public administeredstrengthdenominatorunits: string
	public plannedstrengthneumerator: number
	public plannedstrengthneumeratorunits: string
	public plannedstrengthdenominator: number
	public plannedstrengthdenominatorunits: string
	public administreddosesize: string
	public administreddoseunit: string
	public administreddosemeasure: string
	public planneddosesize: string
	public planneddoseunit: string
	public planneddosemeasure: string
	public plannedinfustionrate: number
	public administredinfusionrate: number
	public comments: string
	public adminstrationstatus: string
	public adminstrationstatusreason: string
	public adminstrationstatusreasontext: string
	public requestresupply: boolean
	public doctorsordercomments: string
	public witness: string
	public substituted: boolean
	public administrationdevice: string
	public administrationsite: string
	public medication_id: string
	public person_id: string
	public encounter_id: string
	public logicalid: string
	public batchnumber: string
	public expirydate: any
	public prescriptionroutesid: string
}
export class Medication {
	public medication_id: string;
	public correlationid: string
	public prescription_id: string;
	public name: string;
	public genericname: string;
	public medicationtype: string;
	public displayname: string;
	public form: string;
	public formcode: string;
	public strengthneumerator: number;
	public strengthdenominator: number;
	public strengthneumeratorunit: string;
	public strengthdenominatorunit: string;
	public doseformunits: string;
	public doseformsize: number;
	public doseformunitofmeasure: string;
	public bnf: string;
	public defineddailydose: string;
	public doseform: string;
	public doseperweight: string;
	public doseperweightunit: string;
	public roundingfactor: number;
	public actgroupcode: string;
	public actgroupname: string;
	public orderformtype: string;
	public maxdoseperdayunit: string;
	public maxdoseperday: number;
	public maxdoseperweek: number;
	public maxdoseperweekunit: string;
	public titrationtype: string;
	public producttype: string;
	public isformulary: boolean;
	public isblacktriangle: boolean;
	public iscontrolled: boolean;
	public iscritical: boolean;
	public isbloodproduct: boolean;
	public markedmodifier: string;
	public modifiedreleasehrs: number;
	public reviewreminderdays: number;
	public isprimary: boolean;
	public person_id: string;
	public encounter_id: string;
	public classification: string;
	public __ingredients: Array<Medicationingredients>;
	public __codes: Array<Medicationcodes>;
	public isclinicaltrial: boolean;
	public isexpensive: boolean;
	public isunlicenced: boolean;
	public ishighalert: boolean;
	public customgroup: string;
}

export class Medicationcodes {
	public medicationcodes_id: string
	public correlationid: string
	public medication_id: string
	public code: string
	public terminology: string
}

export class Medicationingredients {
	public medicationingredients_id: string
	public correlationid: string
	public medication_id: string
	public name: string
	public displayname: string
	public strengthneumerator: number
	public strengthdenominator: string
	public strengthneumeratorunit: string
	public strengthdenominatorunit: string
	public isprimaryingredient: boolean
}

export class Prescriptionroutes {

	public prescriptionroutes_id: string
	public correlationid: string
	public prescription_id: string
	public medication_id: string
	public routecode: string
	public route: string
	public routetype: string
	public isdefault: boolean
	public isunlicensed: boolean
}

export class Medicationroutes {

	public medicationroutes_id: string
	public correlationid: string
	public prescription_id: string
	public medication_id: string
	public routecode: string
	public route: string
	public routetype: string
	public isdefault: boolean
	public isunlicensed: boolean
}

export class MetaPrescriptioncontext {

	public prescriptioncontext_id: string
	public context: string
}

export class MetaPrescriptionstatus {
	public prescriptionstatus_id: string
	public status: string

}
export class MetaReviewstatus {
	public reviewstatus_id: string
	public status: string
	public description: string
}

export class Oxygendevices {
	oxygendevices_id: string
	name: string
	description: string
	active: boolean
	code: string
}

export class MetaPrescriptionduration {
	public prescriptionduration_id: string
	public duration: string
	public displayorder: number
}

export class MetaPrescriptionadditionalcondition {
	public prescriptionadditionalconditions_id: string
	public additionalcondition: string

}


export class DoseEvents {

	public doseevents_id: string
	public dose_id: string
	public posology_id: string
	public startdatetime: any
	public eventtype: string
	public dosedatetime: any
	public comments: string
	public iscancelled: boolean
	public logicalid: string
	public _sequenceid: any

	public titrateddosesize: string
	public titrateddoseunit: string
	public titratedstrengthneumerator: number
	public titratedstrengthneumeratorunits: string
	public titratedstrengthdenominator: number
	public titratedstrengthdenominatorunits: string
	public grouptitration: boolean
	public titrateduntildatetime: any
}

export class InfusionEvents {

	public infusionevents_id: string
	public dose_id: string
	public posology_id: string
	public eventtype: string
	public planneddatetime: any
	public eventdatetime: any
	public comments: string
	public logicalid: string
	public _sequenceid: any;
}

export class PrescriptionSource {
	public prescriptionsource_id: string
	public source: string
	public description: string
	public displayname: string
}

export class Orderset {
	public epma_orderset_id: string
	public prescriptionordersettype_id: string
	public ordersetname: string
	public owner: string
	public person_id: string
	public defined_criteria: string
	public inclusive_value: number
	public exclusive_value: number
}

export class OrdersetPrescription {
	public epma_ordersetprescription_id: string
	public prescription_id: string
	public ordersetid: string
}

export class FormularyDescendent {
	productCode: string;
	productName: string;
	productType: string;
	productDescendents: Array<FormularyDescendent>;
}


export class AdministerMedication {
	public administermedication_id: string;
	public medicationadministrationid: string;
	public name: string;
	public genericname: string;
	public medicationtype: string;
	public displayname: string;
	public form: string;
	public formcode: string;
	public strengthneumerator: number;
	public strengthdenominator: number;
	public strengthneumeratorunit: string;
	public strengthdenominatorunit: string;
	public doseformunits: string;
	public doseformsize: number;
	public doseformunitofmeasure: string;
	public bnf: string;
	public defineddailydose: string;
	public doseform: string;
	public doseperweight: string;
	public doseperweightunit: string;
	public roundingfactor: number;
	public actgroupcode: string;
	public actgroupname: string;
	public orderformtype: string;
	public maxdoseperdayunit: string;
	public maxdoseperday: number;
	public maxdoseperweek: number;
	public maxdoseperweekunit: string;
	public titrationtype: string;
	public producttype: string;
	public isformulary: boolean;
	public isblacktriangle: boolean;
	public iscontrolled: boolean;
	public iscritical: boolean;
	public markedmodifier: string;
	public modifiedreleasehrs: number;
	public reviewreminderdays: number;
	public isprimary: boolean;
	public personid: string;
	public encounterid: string;
	public classification: string;
	public __ingredients: Array<AdministerMedicationingredients>;
	public __codes: Array<AdministerMedicationcodes>;
	public isclinicaltrial: boolean;
	public isexpensive: boolean;
	public isunlicenced: boolean;
	public ishighalert: boolean;
	public customgroup: string;
}

export class AdministerMedicationcodes {
	public administermedicationcodes_id: string
	public administermedicationid: string;
	public medicationadministrationid: string;
	public code: string
	public terminology: string
}

export class AdministerMedicationingredients {
	public administermedicationingredients_id: string
	public administermedicationid: string;
	public medicationadministrationid: string;
	public name: string
	public displayname: string
	public strengthneumerator: number
	public strengthdenominator: string
	public strengthneumeratorunit: string
	public strengthdenominatorunit: string
	public isprimaryingredient: boolean
}

export class ComplianceAid {
	public complianceaid_id: string;
	public complianceaid_name: string;
}

export class PrescriptionMedicaitonSupply {
	public epma_prescriptionmedicaitonsupply_id: string;
	public prescriptionid: string;
	public prescribedmedicationid: string;
	public selectedproductcode: string;
	public selectproductcodetype: string;
	public availablequantity: number;
	public quantityunits: string;
	public complianceaid: string;
	public ownsupplyathome: boolean;
	public resupplyfrom: string;
	public lastmodifiedby: string;
	public updatesouce: string;
	public noofdays: number;
}

export class PrescriptionEvent {
	public epma_prescriptionevent_id: string
	public prescriptionid: string
	public prescriptionstatusid: string
	public datetime: any
	public createdby: string
	public comments: string
	public correlationid: string
}


export class SupplyRequest {
	public epma_supplyrequest_id: string;
	public prescription_id: string;
	public personid: string;
	public encounterid: string;
	public medication_id: string;
	public selectedproductcode: string;
	public selectproductcodetype: string;
	public requeststatus: string;
	public requestedby: string;
	public lastmodifiedby: string;
	public requestednoofdays: number;
	public requestquantity: string;
	public requestedquantityunits: string;
	public requestedon: any;
	public daterequired: any;
	public labelinstructiosrequired: boolean;
	public additionaldirections: string;
	public isformulary: boolean;
	public othercommentsnf: string;
	public ordermessage: string;
	public suppliedquantity: string;
	public suppliedquantityunits: string;
	public lastmodifiedon: any;
	public fulfilledon: any;
	public selectedproductname: string;
	public route: any;
	public indication: any;
	public otherindication: string;
	public licenseauthority: string;
	public marketingauthorisation: string;
	public othercountry: string;
	public othercountrytext: string;
}


export class Prescriptionnursinginstructions {

	public epma_prescriptionnursinginstructions_id: string;
	public prescription_id: string;
	public medication_id: string;
	public instructions: string;
	public createdby: string;
}

export class Prescriptionreviewstatus {

	public epma_prescriptionreviewstatus_id: string
	public person_id: string
	public prescription_id: string
	public precriptionedited: boolean
	public modifiedby: string
	public modifiedon: any
	public reviewcomments: string
	public status: string
	public oldcorrelationid: string
	public newcorrelationid: string
	public __oldprescriptiondata: any;
	public __newprescriptiondata: any;
	public __isprescriptionevent: any;
	public __prescriptionEventStatus: string;
}

export class Prescriptionreminders {

	public epma_prescriptionreminders_id: string
	public prescription_id: string
	public medication_id: string
	public personid: string;
	public encounterid: string;
	public activationdatetime: any
	public message: string
	public isacknowledged: boolean
	public ackmsg: string
	public acknowledgedby: string
	public acknowledgedon: any
	public lastmodifiedby: string
	public lastmodifiedon: any
	public isackmandatory: boolean
	public activationinhours: string
	public issystem: boolean
	public isivtooral: boolean
	public ackcomments: string
	public ackstatus: string
	public __calculatedactivationdatetime: any
	public __noactivationdatetime: any
}

export class Epma_Medsonadmission {
	public epma_medsonadmission_id: string
	public createdby: string
	public notes: string
	public encounterid: string
	public person_id: string
	public createdon: any
	public modifiedon: any
	public iscomplete: boolean
	public noteshasaddinfo: boolean
	public action: string
	public modifiedby: string

}

export class Epma_Dischargesummarry {
	public epma_dischargesummarry_id: string
	public createdby: string
	public notes: string
	public encounterid: string
	public person_id: string
	public createdon: any
	public modifiedon: any
	public iscomplete: boolean
	public noteshasaddinfo: boolean
	public action: string
	public modifiedby: string

}

export class Epma_Medsondischarge {

	public epma_medsondischarge_id: string
	public createdby: string
	public notes: string
	public encounterid: string
	public person_id: string
	public createdon: any
	public modifiedon: any
	public iscomplete: boolean
	public noteshasaddinfo: boolean
	public action: string
	public modifiedby: string

}

export class Epma_Moaprescriptions {

	public epma_moaprescriptions_id: string
	public prescription_id: string
	public epma_medsonadmission_id: string
	public notes: string
	public person_id: string
	public encounter_id: string

}

export class Epma_Modprescriptions {
	public epma_modprescriptions_id: string
	public prescription_id: string
	public epma_medsondischarge_id: string
	public notes: string
	public person_id: string
	public encounter_id: string
}


export class PrescriptionIndication {
	public code: string
	public indication: string
	public islicensed: boolean
}

export class Medreconciliation {

	public epma_medreconciliation_id: string
	public encounter_id: string
	public createdby: string
	public createdon: any
	public modifiedon: any
	public modifiedby: string
}

