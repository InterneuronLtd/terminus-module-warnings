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
import { Injectable, OnDestroy } from "@angular/core";
import { forkJoin, Subscription } from "rxjs";
import { DoseEvents, InfusionEvents, Medicationadministration, Prescription, Prescriptionreminders, Prescriptionreviewstatus, Prescriptionroutes, SupplyRequest } from "../models/EPMA";
import { ApirequestService } from "./apirequest.service";
import { AppService } from "./app.service";
import { filter, filterparam, filterParams, filters, orderbystatement, selectstatement } from 'src/app/models/filter.model';

@Injectable({
    providedIn: 'root'
})

export class DataRequest implements OnDestroy {
    subscriptions = new Subscription();
    constructor(private apiRequest: ApirequestService, private appService: AppService) {

    }

    getSupplyRequest(cb: () => any) {
        this.appService.SupplyRequest = [];
        this.subscriptions.add(this.apiRequest.getRequest(this.appService.baseURI + "/GetList?synapsenamespace=local&synapseentityname=epma_supplyrequest&synapseattributename=encounterid&attributevalue=" + this.appService.encounter.encounter_id).subscribe(
            (response) => {
                let responseArray: SupplyRequest[] = JSON.parse(response);
                this.appService.SupplyRequest = responseArray.filter(s => s.requeststatus == 'Incomplete' || s.requeststatus == 'Pending');
                cb();
            }
        ));
    }

    getReminders(cb: () => any) {
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.baseURI + "/GetListByAttribute?synapsenamespace=local&synapseentityname=epma_prescriptionreminders&synapseattributename=encounterid&attributevalue=" + this.appService.encounter.encounter_id)
                .subscribe(reminders => {
                    let responseArray = JSON.parse(reminders);
                    this.appService.Prescriptionreminders = [];
                    for (let r of responseArray) {
                        this.appService.Prescriptionreminders.push(<Prescriptionreminders>r);
                    }
                    cb();
                }));
    }


    getPharmacyReviewStatus(cb: () => any) {
        this.appService.Prescriptionreviewstatus = [];

        this.subscriptions.add(this.apiRequest.getRequest(this.appService.baseURI + "/GetListByAttribute?synapsenamespace=local&synapseentityname=epma_prescriptionreviewstatus&synapseattributename=person_id&attributevalue=" + this.appService.personId).subscribe(
            response => {
                let responseArray = JSON.parse(response);

                for (let r of responseArray) {
                    this.appService.Prescriptionreviewstatus.push(<Prescriptionreviewstatus>r);
                }
                cb();
            }));
    }



    // initialize application data
    getAdminstrations(cb: () => any) {
        this.appService.Medicationadministration = [];
        this.appService.DoseEvents = [];
        this.appService.InfusionEvents = [];

        if (this.appService.Prescription && this.appService.Prescription.length != 0) {
            let medicationAdministration = this.apiRequest.getRequest(this.appService.baseURI + "/GetListByAttribute?synapsenamespace=core&synapseentityname=medicationadministration&synapseattributename=encounter_id&attributevalue=" + this.appService.encounter.encounter_id);
            let doseEvent = this.apiRequest.postRequest(this.appService.baseURI + "/GetBaseViewListByPost/epma_doseevents", this.createEventsFilter());
            let infusionEvent = this.apiRequest.postRequest(this.appService.baseURI + "/GetBaseViewListByPost/epma_infusionevents", this.createEventsFilter());

            this.subscriptions.add(forkJoin([
                medicationAdministration,
                doseEvent,
                infusionEvent
            ]).subscribe(([medicationadministration, doseevent, infusionevent]) => {

                // initialize medication administration data
                let responseArrayMed = JSON.parse(medicationadministration);
                for (let r of responseArrayMed) {
                    this.appService.Medicationadministration.push(<Medicationadministration>r);
                }

                // initialize dose event data
                let responseArrayDose = doseevent;
                for (let r of responseArrayDose) {
                    this.appService.DoseEvents.push(<DoseEvents>r);
                }
                this.appService.DoseEvents.sort((a, b) => b._sequenceid - a._sequenceid);
                for (let dose of [].concat(...this.appService.Prescription.map(p => p.__posology.map(pos=> pos.__dose)))) {

                    dose.__doseEvent = this.appService.DoseEvents.filter(x => x.dose_id == dose.dose_id);
                }

                // initialize infusion event data
                let responseArrayInfusion = infusionevent;
                for (let r of responseArrayInfusion) {
                    this.appService.InfusionEvents.push(<InfusionEvents>r);
                }
                this.appService.InfusionEvents.sort((a, b) => b._sequenceid - a._sequenceid);



                cb();
            }));
        }
        else {
            cb();
        }
    }
    // get all prescription
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
    // get all metadata
    getAllPrescriptionMeta(cb: () => any) {
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.baseURI + "GetBaseViewList/epma_prescriptionmeta")
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
    // get medication administration
    getMedicationAdministration(cb: () => any) {
        this.appService.Medicationadministration = [];
        this.subscriptions.add(this.apiRequest.getRequest(this.appService.baseURI + "/GetListByAttribute?synapsenamespace=core&synapseentityname=medicationadministration&synapseattributename=encounter_id&attributevalue=" + this.appService.encounter.encounter_id).subscribe(
            (response) => {
                let responseArray = JSON.parse(response);
                for (let r of responseArray) {
                    this.appService.Medicationadministration.push(<Medicationadministration>r);
                }
                cb();
            }));
    }

    updateDoseForPrescription(pid: string, cb: () => any) {
        this.subscriptions.add(this.apiRequest.getRequest(this.appService.baseURI + "/GetListByAttribute?synapsenamespace=core&synapseentityname=dose&synapseattributename=prescription_id&attributevalue=" + pid).subscribe(
            (response) => {
                let responseArray = JSON.parse(response);

                let p = this.appService.Prescription.find(x => x.prescription_id == pid);
                if (p) {
                    p.__posology.forEach(pos => {
                        pos.__dose = responseArray.filter(d=>d.posology_id == pos.posology_id);
                    });
                    // p.__posology.__dose = responseArray;
                }
                cb();
            }));
    }
    // get dose event
    getDoseEvents(cb: () => any) {
        this.appService.DoseEvents = [];
        this.subscriptions.add(this.apiRequest.postRequest(this.appService.baseURI + "/GetBaseViewListByPost/epma_doseevents", this.createEventsFilter()).subscribe(
            (response) => {
                let responseArray = (response);
                for (let r of responseArray) {
                    this.appService.DoseEvents.push(<DoseEvents>r);
                }
                this.appService.DoseEvents.sort((a, b) => b._sequenceid - a._sequenceid);
                cb();
            }));
    }
    // get infusion event
    getInfusionEvents(cb: () => any) {
        this.appService.InfusionEvents = [];
        this.subscriptions.add(this.apiRequest.postRequest(this.appService.baseURI + "/GetBaseViewListByPost/epma_infusionevents", this.createEventsFilter()).subscribe(
            (response) => {
                let responseArray = (response);
                for (let r of responseArray) {
                    this.appService.InfusionEvents.push(<InfusionEvents>r);
                }
                this.appService.InfusionEvents.sort((a, b) => b._sequenceid - a._sequenceid);
                cb();
            }));
    }
    // get prescription route
    // getPriscriptionRoutes() {
    //     this.subscriptions.add(this.apiRequest.postRequest(this.appService.baseURI + "/GetBaseViewListByPost/epma_prescriptionroutes", this.createPrescriptionRoutesFilter()).subscribe(
    //         (response) => {
    //             let responseArray = (response);

    //             for (let r of responseArray) {
    //                 this.appService.Prescriptionroutes.push(<Prescriptionroutes>r);
    //             }
    //         }));
    // }
    private createEventsFilter() {

        if (this.appService.Prescription.length == 0) {
            return;
        }
        let index = 0
        const pm = new filterParams();
        const condition = []
        for (let pos of this.appService.Prescription.map(p => p.__posology)) {
            pos.forEach(pos1 => {
                let para = this.makeId(5);
                if (index === 0)
                    condition.push("posology_id =@" + para);
                else
                    condition.push(" or posology_id =@" + para);
    
                pm.filterparams.push(new filterparam("@" + para, pos1.posology_id));
                index = index + 1 
            });
   
        }

        const f = new filters()
        f.filters.push(new filter(condition.join('')));

        const select = new selectstatement("SELECT * ");
        const orderby = new orderbystatement("ORDER BY 1");


        const body = [];
        body.push(f);
        body.push(pm);
        body.push(select);
        body.push(orderby);
        let jsonobj = JSON.stringify(body);
        return jsonobj;
    }
    private createPrescriptionRoutesFilter() {
        if (this.appService.Prescription.length == 0) {
            return;
        }
        let index = 0
        const pm = new filterParams();
        const condition = []
        for (let prescription of this.appService.Prescription) {
            let para = this.makeId(5);
            if (index === 0)
                condition.push("prescription_id =@" + para);
            else
                condition.push(" or prescription_id =@" + para);

            pm.filterparams.push(new filterparam("@" + para, prescription.prescription_id));
            index = index + 1
        }

        const f = new filters()
        f.filters.push(new filter(condition.join('')));

        const select = new selectstatement("SELECT * ");
        const orderby = new orderbystatement("ORDER BY 1");


        const body = [];
        body.push(f);
        body.push(pm);
        body.push(select);
        body.push(orderby);
        let jsonobj = JSON.stringify(body);
        return jsonobj;
    }
    private createPrescriptionFilter() {
        let condition = "person_id = @person_id and encounter_id = @encounter_id";
        let f = new filters()
        f.filters.push(new filter(condition));

        let pm = new filterParams();
        pm.filterparams.push(new filterparam("person_id", this.appService.personId));
        pm.filterparams.push(new filterparam("encounter_id", this.appService.encounter.encounter_id));

        let select = new selectstatement("SELECT *");

        let orderby = new orderbystatement("ORDER BY prescription_id desc");

        let body = [];
        body.push(f);
        body.push(pm);
        body.push(select);
        body.push(orderby);

        return JSON.stringify(body);
    }

    private makeId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
