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
    


    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
