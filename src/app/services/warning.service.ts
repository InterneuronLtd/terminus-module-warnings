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
import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ApirequestService } from "./apirequest.service";
import { AppService } from "./app.service";
import { EPMASeverity, FDBDataRequest, FDBDataRequestPatientSpecific, PatientInfo, PatientWarnings, Route, WarningContext, Warnings, WarningType } from "../models/warning.model";
import { Dose, Medication, Medicationcodes, Medicationingredients, Posology, Prescription, Prescriptionroutes } from "../models/EPMA";
import { SubjectsService } from "./subjects.service";
import { v4 as uuid } from 'uuid';
import { UpsertTransactionManager } from "./upsert-transaction-manager.service";
@Injectable({
    providedIn: 'root'
})


export class WarningContexts {
    public contexts: WarningService[] = [];
    public encounterId;
    public personId;
    constructor(private apiRequest: ApirequestService, private appService: AppService, private subjects: SubjectsService) {

    }

    public GetWarningsInstanceWithCreate(context: WarningContext | string) {
        let checkifexists = this.GetWarningsInstance(context);
        if (!checkifexists) {
            let ws = new WarningService(this.apiRequest, this.appService, this.subjects);
            ws.context = context;
            this.contexts.push(ws);
            return ws;
        }
        else {
            return checkifexists;
        }
    }

    public GetWarningsInstance(context: WarningContext | string) {
        let ws = this.contexts.find(x => x.context == context);
        return ws;
    }
}

@Injectable()
// TODO: Add Angular decorator.
export class WarningService implements OnDestroy {
    subscriptions = new Subscription();
    refreshSubscriptions = new Subscription();
    newWarningSubscriptions = new Subscription();
    public newWarningsStatus: boolean;
    public existingWarningsStatus: boolean;
    public showExistingWarnings: boolean;
    public showNewWarnings: boolean;
    newWarnings: Warnings[] = [];
    existingWarnigns: Warnings[] = [];
    public overrideExistingWarning: Warnings[] = [];
    public otherExistingWarning: Warnings[] = [];
    public overrideNewWarning: Warnings[] = [];
    public otherNewWarning: Warnings[] = [];
    public loader: boolean = false;
    public customwarning: Warnings[] = [];
    public existingerrors: Warnings[] = [];
    public newerrors: Warnings[] = [];
    public context: WarningContext | string;
    public encounterId:string;
    public personId:string;
    constructor(private apiRequest: ApirequestService, private appService: AppService, private subjects: SubjectsService) {

    }




    GetExistingWarnings(refreshfromdb: boolean, cb) {
        if (refreshfromdb) {
            this.loader = true;
            console.log("loader true from getexisting warnings" + this.context);
            this.subjects.refreshWarning.next();
            this.subscriptions.add(this.apiRequest.getRequest(this.appService.baseURI + "/GetListByAttribute?synapsenamespace=local&synapseentityname=epma_patientwarnings&synapseattributename=warningcontextid&attributevalue=" + this.encounterId + "_" + this.context).subscribe(
                (response) => {
                    let responseArray: PatientWarnings[] = JSON.parse(response);
                    if (responseArray.length > 0) {
                        let warning: Warnings[] = JSON.parse(responseArray[0].warnings);
                        this.existingWarnigns = warning;

                        this.setWarningDisplayArrays();


                    }
                    this.SetExistingWarningStatus();
                    this.loader = false;
                    console.log("loader false from getexisting warnings" + this.context);
                    this.subjects.refreshWarning.next();

                    cb(responseArray);
                }
            ));
        } else {
            this.loader = false;
            console.log("loader false from getexisting warnings no refresh" + this.context);
            this.subjects.refreshWarning.next();
            cb(this.existingWarnigns.slice());
        }
    }
    RefreshCurrentMedicationWarnings(CurrentPrescriptions, patientInfo, cb) {
        this.customwarning = [];
        let products = this.getFDBProducts(null, CurrentPrescriptions, patientInfo, "Current");
        // call FDB api
        this.existingWarningsStatus = false;
        this.loader = true;
        console.log("loader true from refresh current mnedication warnings" + this.context);
        this.subjects.refreshWarning.next();
        this.refreshSubscriptions.unsubscribe();
        this.refreshSubscriptions = new Subscription();
        this.refreshSubscriptions.add(this.apiRequest.postRequest(this.appService.fdbURI, products).subscribe(
            (response) => {
                let responseArray: Warnings[] = response;
                responseArray.push(...this.customwarning);
                //get all the existing comments from existingwarnings array
                let comments = this.existingWarnigns.filter(x => x.overridemessage);
                //update these comments in response matching by ids
                responseArray.forEach(item => {
                    let match = this.GetMatch(item, comments);
                    if (match) {
                        item.overridemessage = match.overridemessage;
                    }
                    //Check config for which warning needs override message and update overrtied required column                 
                    let d = this.GetEPMASeverityFromConfig(item);
                    if (d.length > 0) {
                        let ignoreDuplicate= CurrentPrescriptions.find(x=>x.prescription_id == item.primaryprescriptionid || x.prescription_id == item.secondaryprescriptionid);
                        if(ignoreDuplicate && ignoreDuplicate.__ignoreDuplicateWarnings =="1" && (item.warningtype==WarningType.drugdoubling || item.warningtype==WarningType.drugequivalance || item.warningtype==WarningType.duplicatetherapy)) {
                            item.overriderequired = false;
                            item.severity = EPMASeverity.Low;
                        } else {
                            item.overriderequired = d[0].overriderequired;
                            item.severity = d[0].severity;
                        }
                    }
                    else if (item.warningtype != WarningType.custom) {
                        item.overriderequired = false;
                        item.severity = EPMASeverity.Low;
                    }

                    if (item.primarymedicationcode) {
                        if (item.primarymedicationcode == "custom") {
                            item.primarymedicationname = CurrentPrescriptions.find(x => x.prescription_id == item.primaryprescriptionid).__medications[0].name;
                        } else {
                            //try go get prescription by primary code 
                            let med = CurrentPrescriptions.find(x => x.__medications.find(x => x.__codes.find(z => z.code == item.primarymedicationcode)));
                            if (!med) {
                                med = CurrentPrescriptions.find(x => x.__drugcodes.find(x => x.additionalCode == item.primarymedicationcode));
                            }
                            if (med) {
                                item.primarymedicationname = med.__medications[0].name;
                            }
                        }
                    }
                    if (item.secondarymedicationcode) {
                        //try go get prescription by primary code 
                        let med = CurrentPrescriptions.find(x => x.__medications.find(x => x.__codes.find(z => z.code == item.secondarymedicationcode)));
                        if (!med) {
                            med = CurrentPrescriptions.find(x => x.__drugcodes.find(x => x.additionalCode == item.secondarymedicationcode));
                        }
                        if (med) {
                            item.secondarymedicationname = med.__medications[0].name;
                        }
                    }
                    item.sortOrder = 0;
                    if (item.warningtype == WarningType.custom) {
                        item.sortOrder = 1;
                    }
                });
                this.existingWarnigns = [];
                var upsertManager = new UpsertTransactionManager();
                upsertManager.beginTran(this.appService.baseURI, this.apiRequest);
                upsertManager.addEntity('local', 'epma_patientwarnings', { "warningcontextid": this.encounterId + "_" + this.context }, "del");
                let pwarning = new PatientWarnings();
                pwarning.person_id = this.personId;
                pwarning.epma_patientwarnings_id = uuid();
                pwarning.encounter_id = this.encounterId;
                pwarning.warnings = JSON.stringify(responseArray);
                pwarning.warningcontextid = this.encounterId + "_" + this.context;
                upsertManager.addEntity('local', "epma_patientwarnings", pwarning);

                upsertManager.save((resp) => {
                    this.appService.logToConsole(resp);
                    this.loader = false;
                    console.log("loader false from refresh current mnedication warnings" + this.context);

                    this.subjects.refreshWarning.next();
                    this.existingWarnigns = responseArray;
                    this.setWarningDisplayArrays();
                    upsertManager.destroy();
                    this.SetExistingWarningStatus();

                    cb("success", this.existingWarnigns.slice(), resp.version);
                },
                    (error) => {
                        this.appService.logToConsole(error);
                        upsertManager.destroy();
                        this.SetExistingWarningStatus();
                        this.loader = false;
                        console.log("loader true from refresh current mnedication warnings error" + this.context);

                        this.subjects.refreshWarning.next();
                        cb("error", error);
                    }
                );

            }
        ));
    }

    UpdateOverrideMsg(comments, cb) {
        this.loader = true;
        console.log("loader true from override msg" + this.context);

        this.subjects.refreshWarning.next();

        var upsertManager = new UpsertTransactionManager();
        upsertManager.beginTran(this.appService.baseURI, this.apiRequest);
        upsertManager.addEntity('local', 'epma_patientwarnings', { "warningcontextid": this.encounterId + "_" + this.context }, "del");
        let pwarning = new PatientWarnings();
        pwarning.person_id = this.personId;
        pwarning.epma_patientwarnings_id = uuid();
        pwarning.encounter_id = this.encounterId;
        pwarning.warningcontextid = this.encounterId + "_" + this.context;
        this.existingWarnigns.forEach((item) => {
            item.overridemessage = item.overridemessage?.trim();
        });
        pwarning.warnings = JSON.stringify(this.existingWarnigns);
        upsertManager.addEntity('local', "epma_patientwarnings", pwarning);
        upsertManager.save((resp) => {
            this.loader = false;
            console.log("loader false from override msg current mnedication warnings" + this.context);

            this.appService.logToConsole(resp);
            this.loader = false;
            this.subjects.refreshWarning.next();
            this.setWarningDisplayArrays();
            upsertManager.destroy();
            this.SetExistingWarningStatus();
            this.subjects.refreshWarning.next();
            cb("success", this.existingWarnigns.slice(), resp.version);
        },
            (error) => {
                this.loader = false;
                console.log("loader false from override msg current mnedication warnings error" + this.context);

                this.appService.logToConsole(error);
                upsertManager.destroy();
                this.SetExistingWarningStatus();
                this.loader = false;
                this.subjects.refreshWarning.next();
                cb("error", error);
            }
        );
    }
    getClonedArray(ar: any) {
        let clone = [];
        ar.forEach(p => {
            clone.push(this.ClonePrescription(p));
        });
        return clone;
    }

    GetNewWarnings(prosp, currpres, patientInfo, cb, isEdit = false) {
        let ProspectivePrescriptions = this.getClonedArray(prosp)
        let CurrentPrescriptions = this.getClonedArray(currpres);

        this.customwarning = [];
        let products = this.getFDBProducts(ProspectivePrescriptions, CurrentPrescriptions, patientInfo, "New");

        //products.products = products.products.filter(p => p.productCode.toLowerCase() != "custom");

        if (products.products.length != 0) {
            // call FDB api
            this.loader = true;
            console.log("loader true from get new warnings" + this.context);

            this.subjects.refreshWarning.next();
            this.newWarningSubscriptions.unsubscribe();
            this.newWarningSubscriptions = new Subscription();
            this.newWarningSubscriptions.add(this.apiRequest.postRequest(this.appService.fdbURI, products).subscribe(
                (response) => {
                    console.log("new warnings received" + this.context);
                    let responseArray: Warnings[] = response;
                    responseArray.push(...this.customwarning);
                    //get all the existing comments from newwarnings array
                    let comments = [];
                    if (isEdit)
                        comments = this.existingWarnigns.filter(x => x.overridemessage);
                    else
                        comments = this.newWarnings.filter(x => x.overridemessage);
                    //update these comments in response matching by ids
                    responseArray.forEach(item => {
                        let match = this.GetMatch(item, comments);

                        if (match) {

                            item.overridemessage = match.overridemessage;

                        }
                        //Check config for which warning needs override message and update overrtied required column
                        let d = this.GetEPMASeverityFromConfig(item);
                        if (d.length > 0) {
                            let ignoreDuplicate= prosp.find(x=>x.prescription_id == item.primaryprescriptionid || x.prescription_id == item.secondaryprescriptionid);
                            if(ignoreDuplicate && ignoreDuplicate.__ignoreDuplicateWarnings =="1" && (item.warningtype==WarningType.drugdoubling || item.warningtype==WarningType.drugequivalance || item.warningtype==WarningType.duplicatetherapy)) {
                                item.overriderequired = false;
                                item.severity = EPMASeverity.Low;
                            } else {
                                item.overriderequired = d[0].overriderequired;
                                item.severity = d[0].severity;
                            }
                        }
                        else if (item.warningtype != WarningType.custom) {
                            item.overriderequired = false;
                            item.severity = EPMASeverity.Low;
                        }

                        Array.prototype.push.apply(ProspectivePrescriptions, CurrentPrescriptions)
                        if (item.primarymedicationcode) {
                            if (item.primarymedicationcode == "custom") {
                                item.primarymedicationname = ProspectivePrescriptions.find(x => x.prescription_id == item.primaryprescriptionid).__medications[0].name;
                            } else {
                                //try go get prescription by primary code 
                                let med = ProspectivePrescriptions.find(x => x.__medications.find(x => x.__codes.find(z => z.code == item.primarymedicationcode)));
                                if (!med) {
                                    med = ProspectivePrescriptions.find(x => x.__drugcodes.find(x => x.additionalCode == item.primarymedicationcode));
                                }
                                if (med) {
                                    item.primarymedicationname = med.__medications[0].name;
                                }
                            }
                        }
                        if (item.secondarymedicationcode) {
                            //try go get prescription by primary code 
                            let med = ProspectivePrescriptions.find(x => x.__medications.find(x => x.__codes.find(z => z.code == item.secondarymedicationcode)));
                            if (!med) {
                                med = ProspectivePrescriptions.find(x => x.__drugcodes.find(x => x.additionalCode == item.secondarymedicationcode));
                            }
                            if (med) {
                                item.secondarymedicationname = med.__medications[0].name;
                            }
                        }
                        item.sortOrder = 0;
                        if (item.warningtype == WarningType.custom) {
                            item.sortOrder = 1;
                        }
                    });
                    this.newWarnings = [];
                    this.newWarnings = responseArray;
                    console.log(this.newWarnings);
                    this.loader = false;
                    console.log("loader false from get new warnings" + this.context);

                    this.setWarningDisplayArrays();
                    this.SetNewWarningStatus();
                    cb(this.newWarnings);

                }
            ));
        }
        else {
            this.ClearNewWarnings();
        }
    }
    CommitNewWarningsToDB(cb) {
        this.loader = true;
        console.log("loader true from  commit warnings" + this.context);

        this.subjects.refreshWarning.next();
        // For contraindications, precautions, drugwarnings , mandatoryinstructions, safetymessages 
        // get all existing comments
        let comments = this.existingWarnigns.filter(x => (x.warningtype == WarningType.contraindication
            || x.warningtype == WarningType.precaution) && x.overridemessage)


        let exWarning = this.existingWarnigns.slice();
        //for each row with matching ids based on warning type, copy the comments to NewWarnings object, only if the new warning object comment is empty
        this.newWarnings.forEach(item => {
            item.person_id = this.personId;
            item.encounter_id = this.encounterId;
            item.overridemessage = item.overridemessage?.trim();
            // TO DO: add more condition
            if (item.warningtype == WarningType.drugdoubling || item.warningtype == WarningType.drugequivalance
                || item.warningtype == WarningType.duplicatetherapy || item.warningtype == WarningType.druginteraction
                || item.warningtype == WarningType.sensitivity) {
                exWarning.push(item);
            }
            else {
                if (!item.overridemessage) {
                    let match = this.GetMatch(item, comments);
                    if (match && match.overridemessage) {
                        item.overridemessage = match.overridemessage;
                    }
                }
                let matchWarning = this.existingWarnigns.filter(x => x.primarymedicationcode == item.primarymedicationcode
                    && x.fdbmessageid == item.fdbmessageid
                    && x.message == item.message
                    && x.warningtype == item.warningtype);
                matchWarning.forEach(i => {
                    exWarning = exWarning.filter(x => x.epma_warnings_id != i.epma_warnings_id);
                });
                exWarning.push(item);
            }
        });
        var upsertManager = new UpsertTransactionManager();
        upsertManager.beginTran(this.appService.baseURI, this.apiRequest);
        upsertManager.addEntity('local', 'epma_patientwarnings', { "warningcontextid": this.encounterId + "_" + this.context }, "del");
        let pwarning = new PatientWarnings();
        pwarning.person_id = this.personId;
        pwarning.epma_patientwarnings_id = uuid();
        pwarning.encounter_id = this.encounterId;
        pwarning.warningcontextid = this.encounterId + "_" + this.context;
        pwarning.warnings = JSON.stringify(exWarning);
        upsertManager.addEntity('local', "epma_patientwarnings", pwarning);
        upsertManager.save((resp) => {
            this.appService.logToConsole(resp);
            this.loader = false;
            console.log("loader false from commit warnings" + this.context);

            upsertManager.destroy();
            this.existingWarnigns = exWarning;
            this.newWarnings = [];
            this.setWarningDisplayArrays();
            this.SetExistingWarningStatus();
            cb("success", this.existingWarnigns.slice(), resp.version);
        },
            (error) => {
                this.newWarnings = [];
                this.setWarningDisplayArrays();
                this.appService.logToConsole(error);
                upsertManager.destroy();
                this.SetExistingWarningStatus();
                this.loader = false;
                console.log("loader false from commit warnings error" + this.context);

                cb("error", error);

            }
        );

    }
    GetMatch(item: Warnings, comments: Warnings[]) {

        switch (item.warningtype) {
            case WarningType.contraindication:
            case WarningType.precaution: {
                let data = comments.find(x => x.primarymedicationcode == item.primarymedicationcode
                    && x.fdbmessageid == item.fdbmessageid
                    && x.message == item.message
                    && x.warningtype == item.warningtype
                );
                return data;
            }
            case WarningType.drugwarnings: {
                let data = comments.find(x => x.primarymedicationcode == item.primarymedicationcode
                    // change match logic to array compare
                    && JSON.stringify(x.warningcategories).toLowerCase() == JSON.stringify(item.warningcategories).toLowerCase()
                    && x.message == item.message
                    && x.warningtype == item.warningtype
                );
                return data;
            }
            case WarningType.mandatoryinstruction:
            case WarningType.safetymessage: {
                let data = comments.find(x => x.primarymedicationcode == item.primarymedicationcode
                    && x.msgtype == item.msgtype
                    && x.message == item.message
                    && x.warningtype == item.warningtype
                );
                return data;
            }
            case WarningType.drugdoubling:
            case WarningType.drugequivalance:
            case WarningType.duplicatetherapy:
            case WarningType.druginteraction:
                {
                    if (WarningType.druginteraction == item.warningtype) {
                        console.log(item);
                        console.log(comments);
                    }
                    let data = comments.find(x => ((x.primaryprescriptionid == item.primaryprescriptionid
                        && x.secondaryprescriptionid == item.secondaryprescriptionid)
                        || (x.secondaryprescriptionid == item.primaryprescriptionid && x.primaryprescriptionid == item.secondaryprescriptionid))

                        &&
                        x.warningtype == item.warningtype
                    );
                    return data;

                }

            case WarningType.custom: {
                let data = comments.find(x => x.primaryprescriptionid == item.primaryprescriptionid
                    && x.message == item.message
                    && x.warningtype == item.warningtype
                );
                return data;
            }

            case WarningType.sensitivity: {
                let data = comments.find(x => x.primaryprescriptionid == item.primaryprescriptionid
                    && x.primarymedicationcode == item.primarymedicationcode
                    && x.allergencode == item.allergencode
                );
                return data;
            }
        }
    }
    GetEPMASeverityFromConfig(item: Warnings) {
        let config = this.appService.warningSeverity.filter(z => z.matchcriteria.warningType.find(x => x.includes(item.warningtype)
            && z.matchcriteria.patientspecific == item.ispatientspecific
            && this.ConfigMatchCondition(z, item)
        )).sort((a, b) => b.severity - a.severity);
        return config;
    }
    ConfigMatchCondition(data, item) {
        let result = true;
        if (!data.matchcriteria.matchcondition || data.matchcriteria.matchcondition.length == 0)
            return result;
        for (var i = 0; i < data.matchcriteria.matchcondition.length; i++) {
            for (let key of Object.keys(item)) {
                if (key == data.matchcriteria.matchcondition[i].keycolumn) {
                    if (this.IsJsonString(item[key]) && Array.isArray(JSON.parse(item[key]))) {
                        let obj = JSON.parse(item[key]);
                        result = false;
                        obj.forEach(val => {
                            if (val == data.matchcriteria.matchcondition[i].keyvalue)
                                result = true;
                        });
                    }
                    else if (item[key] != data.matchcriteria.matchcondition[i].keyvalue) {
                        result = false;
                    }
                }
            }
        }
        return result;
    }

    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    SetExistingWarningStatus() {
        let status = this.existingWarnigns.find(x => x.overriderequired && !x.overridemessage);
        if (status) {
            this.existingWarningsStatus = false;
        } else {
            this.existingWarningsStatus = true;
        }
        //this.showExistingWarnings = true;
    }
    SetNewWarningStatus() {
        let status = this.newWarnings.find(x => x.overriderequired && !x.overridemessage);
        if (status) {
            this.newWarningsStatus = false;
        } else {
            this.newWarningsStatus = true;
        }
        // this.showNewWarnings = true;
    }

    getFDBProducts(ProspectivePrescriptions: Prescription[], CurrentPrescriptions: Prescription[], patientInfo: PatientInfo, type: string) {
        let products = new FDBDataRequestPatientSpecific();
        let productCurr: FDBDataRequest[] = [];
        let productPros: FDBDataRequest[] = [];
        let pInfo: PatientInfo;
        if (ProspectivePrescriptions) {
            ProspectivePrescriptions.forEach(item => {

                let product = new FDBDataRequest();
                product.nameIdentifier = item.prescription_id;
                //get dmd code 
                //check if the there is a dmd code in formulary additional codes 
                //else use the primary code
                let dmd = (item.__drugcodes??[]).find(x => (x.additionalCodeSystem ?? "").toLowerCase() == "dmd")
                if (dmd) {
                    product.productCode = dmd.additionalCode;
                    //console.log("dmd found in additional: " + dmd.additionalCode);
                }
                else {
                    product.productCode = item.__medications.find(x => x.isprimary).__codes[0].code;
                    //console.log("dmd found in regular: " + product.productCode);
                }

                if (item.__medications.find(x => x.isprimary).__codes.filter)
                    product.productType = item.__medications.find(x => x.isprimary).producttype;
                console.log(item);
                let dose = "";
                let currentpos = this.appService.GetCurrentPosology(item);
                if (currentpos.frequency.toLowerCase() != "variable"
                    && currentpos.frequency.toLowerCase() != "protocol"
                    && currentpos.dosetype.toLowerCase() == "units"
                    && item.__medications[0].producttype.toLowerCase() == "vtm" && !item.titration) {
                    dose = currentpos.__dose[0].dosesize + " " + currentpos.__dose[0].doseunit;
                }
                if (dose != "")
                    product.therapyName = item.__medications.find(x => x.isprimary).name + " " + dose;
                else
                    product.therapyName = item.__medications.find(x => x.isprimary).name;

                product.routes = [];
                let route = item.__routes.map<Route>((r: Prescriptionroutes) => {
                    return { name: r.route, code: r.routecode };
                });

                if (item.__customWarning && type == "New" && item.__customWarning.length > 0) {
                    item.__customWarning.forEach(el => {
                        let warning = new Warnings();
                        warning.epma_warnings_id = uuid();
                        warning.severity = EPMASeverity.High;
                        warning.primarymedicationname = product.therapyName;
                        warning.message = "<b>" + product.therapyName + "</b> " + el.warning;
                        warning.overriderequired = el.needResponse;
                        warning.warningtype = WarningType.custom;
                        warning.primaryprescriptionid = item.prescription_id;
                        warning.sortOrder = 1;
                        this.customwarning.push(warning);
                    });

                }

                product.routes.push(...route);
                productPros.push(product);
            });
        }
        if (CurrentPrescriptions) {
            CurrentPrescriptions.forEach(item => {
                let product = new FDBDataRequest();
                product.nameIdentifier = item.prescription_id;
                // product.productCode = item.__medications.find(x => x.isprimary).__codes[0].code;
                //get dmd code 
                //check if the there is a dmd code in formulary additional codes 
                //else use the primary code
                let dmd = (item.__drugcodes??[]).find(x => (x.additionalCodeSystem ?? "").toLowerCase() == "dmd")
                if (dmd) {
                    product.productCode = dmd.additionalCode;
                    //console.log("dmd found in additional: " + dmd.additionalCode);
                }
                else {
                    product.productCode = item.__medications.find(x => x.isprimary).__codes[0].code;
                    //console.log("dmd found in regular: " + product.productCode);
                }
                product.productType = item.__medications.find(x => x.isprimary).producttype;

                let dose = "";
                let currentpos = this.appService.GetCurrentPosology(item);
                if (currentpos.frequency.toLowerCase() != "variable"
                    && currentpos.frequency.toLowerCase() != "protocol"
                    && currentpos.dosetype.toLowerCase() == "units"
                    && item.__medications[0].producttype.toLowerCase() == "vtm" && !item.titration) {
                    dose = currentpos.__dose[0].dosesize + " " + currentpos.__dose[0].doseunit;
                }
                if (dose != "")
                    product.therapyName = item.__medications.find(x => x.isprimary).name + " " + dose;
                else
                    product.therapyName = item.__medications.find(x => x.isprimary).name

                product.routes = [];
                let route = item.__routes.map<Route>((r: Prescriptionroutes) => {
                    return { name: r.route, code: r.routecode };
                });
                if (item.__customWarning && type == "Current" && item.__customWarning.length > 0) {
                    item.__customWarning.forEach(el => {
                        let warning = new Warnings();
                        warning.epma_warnings_id = uuid();
                        warning.severity = EPMASeverity.High;
                        warning.primarymedicationname = product.therapyName;
                        warning.message = "<b>" + product.therapyName + "</b> " + el.warning;
                        warning.overriderequired = el.needResponse;
                        warning.warningtype = WarningType.custom;
                        warning.primaryprescriptionid = item.prescription_id;
                        warning.sortOrder = 1;
                        this.customwarning.push(warning);
                    });
                }
                product.routes.push(...route);
                productCurr.push(product);
            });
        }
        products.products = productPros;
        products.currentproducts = productCurr;
        products.patientinfo = patientInfo;
        if (this.appService.warningTypes && Array.isArray(this.appService.warningTypes) && this.appService.warningTypes.length > 0) {
            products.warningtypes = this.appService.warningTypes;//[WarningType.drugdoubling, WarningType.druginteraction, WarningType.drugequivalance, WarningType.duplicatetherapy, WarningType.sensitivity]
        }

        return products;
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.refreshSubscriptions.unsubscribe();
        this.newWarningSubscriptions.unsubscribe();
    }
    ClearNewWarnings() {
        this.newWarnings = [];
        this.newWarningsStatus = true;
        this.setWarningDisplayArrays();
    }

    resetWarningService() {
        console.log("resetting warning service" + this.context)
        this.newWarningsStatus = null;
        this.existingWarningsStatus = null;
        this.showExistingWarnings = null;
        this.showNewWarnings = null;
        this.newWarnings = [];
        this.existingWarnigns = [];
        this.overrideExistingWarning = [];
        this.otherExistingWarning = [];
        this.overrideNewWarning = [];
        this.otherNewWarning = [];
        this.loader = false;
        console.log("loader false from reset warningservice");

        this.customwarning = [];
        this.subscriptions.unsubscribe();
        this.refreshSubscriptions.unsubscribe();
        this.newWarningSubscriptions.unsubscribe();

    }
    CleanAndCloneObject(obj: any) {
        var clone = {};

        Object.keys(obj).map((e) => {
            if (!e.startsWith("__")) {
                clone[e] = obj[e];
            }
        });
        return clone;
    }

    ClonePrescription(p: Prescription, skipVisitIdentifiers = false) {

        var person_id = p.person_id;
        var encounter_id = p.encounter_id;
        if (skipVisitIdentifiers) {
            person_id = null;
            encounter_id = null;
        }
        var p1 = <Prescription>this.CleanAndCloneObject(p);
        //p1.prescription_id = uuid();
        //p1.correlationid = uuid();

        p1.__medications = new Array<Medication>();
        p1.__medications = [];
        p1.person_id = person_id;
        p1.encounter_id = encounter_id;
        //p1.prescriptionstatus_id = null;

        p.__medications.forEach(m => {
            var mindex = p.__medications.indexOf(m);
            p1.__medications.push(<Medication>this.CleanAndCloneObject(m));
            //p1.__medications[mindex].medication_id = uuid();
            p1.__medications[mindex].correlationid = p1.correlationid;

            p1.__medications[mindex].prescription_id = p1.prescription_id;
            p1.__medications[mindex].person_id = person_id;
            p1.__medications[mindex].encounter_id = encounter_id;

            p1.__medications[mindex].__codes = new Array<Medicationcodes>();
            p1.__medications[mindex].__codes = [];
            m.__codes.forEach(c => {
                var cindex = m.__codes.indexOf(c);
                p1.__medications[mindex].__codes.push(<Medicationcodes>this.CleanAndCloneObject(c));
                p1.__medications[mindex].__codes[cindex].medication_id = p1.__medications[mindex].medication_id;
                // p1.__medications[mindex].__codes[cindex].medicationcodes_id = uuid();
                p1.__medications[mindex].__codes[cindex].correlationid = p1.correlationid;
            });

            p1.__medications[mindex].__ingredients = new Array<Medicationingredients>();
            p1.__medications[mindex].__ingredients = [];
            m.__ingredients.forEach(ig => {
                var igindex = m.__ingredients.indexOf(ig);
                p1.__medications[mindex].__ingredients.push(<Medicationingredients>this.CleanAndCloneObject(ig));
                p1.__medications[mindex].__ingredients[igindex].medication_id = p1.__medications[mindex].medication_id;
                // p1.__medications[mindex].__ingredients[igindex].medicationingredients_id = uuid();
                p1.__medications[mindex].__ingredients[igindex].correlationid = p1.correlationid;
            });
        });

        p1.__posology = [];
        p1.__posology.push(<Posology>this.CleanAndCloneObject(this.appService.GetCurrentPosology(p)));

        p1.__posology[0].prescription_id = p1.prescription_id;
        // p1.__posology.posology_id = uuid();
        p1.__posology[0].correlationid = p1.correlationid;

        p1.__posology[0].person_id = person_id;
        p1.__posology[0].encounter_id = encounter_id;

        p1.__posology[0].__dose = new Array<Dose>();
        p1.__posology[0].__dose = [];
        this.appService.GetCurrentPosology(p).__dose.forEach(d => {
            var dindex = this.appService.GetCurrentPosology(p).__dose.indexOf(d);
            p1.__posology[0].__dose.push(<Dose>this.CleanAndCloneObject(d));
            //p1.__posology.__dose[dindex].dose_id = uuid();
            if (dindex > 0 && p.isinfusion)
                p1.__posology[0].__dose[dindex].continuityid = p1.__posology[0].__dose[0].dose_id;
            p1.__posology[0].__dose[dindex].posology_id = p1.__posology[0].posology_id;
            p1.__posology[0].__dose[dindex].prescription_id = p1.prescription_id;
            p1.__posology[0].__dose[dindex].correlationid = p1.correlationid;

        });

        p1.__routes = new Array<any>();
        p1.__routes = [];
        p.__routes.forEach(r => {
            var rindex = p.__routes.indexOf(r);
            p1.__routes.push(<any>this.CleanAndCloneObject(r));
            p1.__routes[rindex].medication_id = "";
            p1.__routes[rindex].prescription_id = p1.prescription_id;
            /// p1.__routes[rindex].prescriptionroutes_id = uuid();
            p1.__routes[rindex].correlationid = p1.correlationid;

        });

        p1.__customWarning = [];
        if (p.__customWarning)
            p.__customWarning.forEach(cw => {
                p1.__customWarning.push(<any>this.CleanAndCloneObject(cw));
            });

        p1.__drugcodes = [];
        if (p.__drugcodes)
            p.__drugcodes.forEach(dc => {
                p1.__drugcodes.push(<any>this.CleanAndCloneObject(dc));
            });

        this.appService.logToConsole(p);
        this.appService.logToConsole(p1);

        return p1;
    }

    setWarningDisplayArrays() {
        this.overrideExistingWarning = this.existingWarnigns.filter(x => (x.overriderequired || x.severity == EPMASeverity.High) && x.warningtype != WarningType.error).sort((a, b) => a.warningtype.localeCompare(b.warningtype));
        this.otherExistingWarning = this.existingWarnigns.filter(x => !x.overriderequired && x.severity != 4 && x.severity != 1 && x.warningtype != WarningType.error).sort((a, b) => a.warningtype.localeCompare(b.warningtype));

        this.overrideNewWarning = this.newWarnings.filter(x => (x.overriderequired || x.severity == EPMASeverity.High) && x.warningtype != WarningType.error).sort((a, b) => a.warningtype.localeCompare(b.warningtype));
        this.otherNewWarning = this.newWarnings.filter(x => !x.overriderequired && x.severity != 4 && x.severity != 1 && x.warningtype != WarningType.error).sort((a, b) => a.warningtype.localeCompare(b.warningtype));

        this.existingerrors = this.existingWarnigns.filter(x => x.warningtype == WarningType.error).sort((a, b) => a.warningcategories.localeCompare(b.warningcategories));
        this.newerrors = this.newWarnings.filter(x => x.warningtype == WarningType.error).sort((a, b) => a.warningcategories.localeCompare(b.warningcategories));

        let temp = [];
        this.existingerrors.forEach(e => {
            if (temp.filter(er => er.primarymedicationname == e.primarymedicationname
                && er.message == e.message).length == 0) {
                temp.push(e);
            }
        });
        this.existingerrors = [];
        Object.assign(this.existingerrors, temp);

        temp = [];
        this.newerrors.forEach(e => {
            if (temp.filter(er => er.primarymedicationname == e.primarymedicationname
                && er.message == e.message).length == 0) {
                temp.push(e);
            }
        });
        this.newerrors = [];
        Object.assign(this.newerrors, temp);

        this.existingerrors.forEach(e => e.message = e.message.replace("Dose Range Check, Pharmacological Equivalence,", ""));
        this.newerrors.forEach(e => e.message = e.message.replace("Dose Range Check, Pharmacological Equivalence,", ""));

        this.subjects.refreshWarning.next();

        this.overrideExistingWarning.sort((a, b) => {
            return (a.overriderequired === b.overriderequired) ? 0 : a.overriderequired ? -1 : 1;
        }).sort((a, b) => b.sortOrder - a.sortOrder);

        this.overrideNewWarning.sort((a, b) => {
            return (a.overriderequired === b.overriderequired) ? 0 : a.overriderequired ? -1 : 1;
        }).sort((a, b) => b.sortOrder - a.sortOrder);
    }

}
