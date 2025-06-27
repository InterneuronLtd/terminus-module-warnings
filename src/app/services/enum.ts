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
export enum contents{
    Administer_PRN="<div class='Administer_PRN'></div>", 
    Administration_Completed_early="<div class='Administration_Completed_early'></div>", 
    Administration_Completed_late="<div class='Administration_Completed_late'></div>", 
    Administration_Defered="<div class='Administration_Defered'></div>", 
    Administration_Failed="<div class='Administration_Failed'></div>", 
    Due_Administration="<div class='Due_Administration'></div>", 
    Late_Administration="<div class='Late_Administration'></div>", 
    Planned_Administration="<div class='Planned_Administration'></div>", 
    Administration_withheld_by_doctor="<div class='Administration_withheld_by_doctor'></div>", 
    Completed_Administration="<div class='Completed_Administration'></div>", 
    Dose_administered_is_differnt_from_prescribed= "<div class='Dose_administered_is_differnt_from_prescribed'></div>",
    Dose_administered_early_is_differnt_from_prescribed= "<div class='Dose_administered_early_is_differnt_from_prescribed'></div>",
    Dose_administered_late_is_differnt_from_prescribed= "<div class='Dose_administered_late_is_differnt_from_prescribed'></div>",
    Administration_requires_doctors_confirmation_Planned="<div class='Administration_requires_doctors_confirmation_Planned'></div>",
    Administration_requires_doctors_confirmation_Late="<div class='Administration_requires_doctors_confirmation_Late'></div>",
    Administration_requires_doctors_confirmation_Due="<div class='Administration_requires_doctors_confirmation_Due'></div>",
    Infusionplanned="<div class='Infusionplanned'></div>",
    Infusiondue="<div class='Infusiondue'></div>",
    InfusionLate="<div class='InfusionLate'></div>",
    Infusioncompletionplanned="<div class='Infusioncompletionplanned'></div>",
    InfusionCompletiondue="<div class='InfusionCompletiondue'></div>",
    InfusionCompleteoverdue="<div class='InfusionCompleteoverdue'></div>",
    durationline="<div></div>",
    IncreaseInfusionRatePlanned="<div class='IncreaseInfusionRatePlanned'></div>",
    IncreaseInfusionRateDue="<div class='IncreaseInfusionRateDue'></div>",
    IncreaseInfusionRateLate="<div class='IncreaseInfusionRateLate'></div>",

    DecreaseInfusionRateLate="<div class='DecreaseInfusionRateLate'></div>",
    DecreaseInfusionRateDue="<div class='DecreaseInfusionRateDue'></div>",
    DecreaseInfusionRatePlanned="<div class='DecreaseInfusionRatePlanned'></div>",
    BolusAdministrationCompleted="<div class='BolusAdministrationCompleted'></div>",

    additionaladministration="<div class='additionaladministration'></div>",

    Infusiondone="<div class='Infusiondone'></div>",

    InfusionCompletedEarly="<div class='InfusionCompletedEarly'></div>",
    InfusionCompletedLate="<div class='InfusionCompletedLate'></div>",
    IncreaseInfusionRatedone="<div class='IncreaseInfusionRatedone'></div>",
    IncreaseInfusionRatedonelate="<div class='IncreaseInfusionRatedonelate'></div>",
    IncreaseInfusionRatedoneearly="<div class='IncreaseInfusionRatedoneearly'></div>",
    DecreaseInfusionRatedone="<div class='DecreaseInfusionRatedone'></div>",
    DecreaseInfusionRatedonelate="<div class='DecreaseInfusionRatedonelate'></div>",
    DecreaseInfusionRatedoneearly="<div class='DecreaseInfusionRatedoneearly'></div>",
    InfusionCompleteddone="<div class='InfusionCompleteddone'></div>",
    InfusionCompletedEarly2="<div class='InfusionCompletedEarly2'></div>",
    InfusionCompletedLate2="<div class='InfusionCompletedLate2'></div>",

    AdjustedIncreaseInfusionRatedonelate="<div class='AdjustedIncreaseInfusionRatedonelate'></div>",
    AdjustedIncreaseInfusionRatedoneearly="<div class='AdjustedIncreaseInfusionRatedoneearly'></div>",
    AdjustedDecreaseInfusionRatedone="<div class='AdjustedDecreaseInfusionRatedone'></div>",
    AdjustedDecreaseInfusionRatedonelate="<div class='AdjustedDecreaseInfusionRatedonelate'></div>",
    AdjustedDecreaseInfusionRatedoneearly="<div class='AdjustedDecreaseInfusionRatedoneearly'></div>",

    AdjustedIncreaseInfusionRatedone="<div class='AdjustedIncreaseInfusionRatedone'></div>",
    MaintainInfusionRatedoneearly="<div class='AdjustedIncreaseInfusionRatedone'></div>",
    MaintainInfusionRatedonelate="<div class='MaintainInfusionRatedonelate'></div>",

    AdjustedsameInfusionRatedone="<div class='AdjustedsameInfusionRatedone'></div>",

    FaliedtoAdjustInfusionRatedonelate="<div class='FaliedtoAdjustInfusionRatedonelate'></div>",
    FaliedtoAdjustInfusionRatedoneearly="<div class='FaliedtoAdjustInfusionRatedoneearly'></div>",

    InfusionRatePaused="<div class='InfusionRatePaused'></div>",

    ContinuousInfusionSetChanged="<div class='ContinuousInfusionSetChanged'></div>",

    Continuousinfusionsyringeorbagchange="<div class='Continuousinfusionsyringeorbagchange'></div>",

    Maintain_Infusion_Rate_done="<div class='Maintain_Infusion_Rate_done'></div>",
    Maintain_Infusion_Rate_Late="<div class='Maintain_Infusion_Rate_Late'></div>",
    Maintain_Infusion_Rate_Planned="<div class='Maintain_Infusion_Rate_Planned'></div>",
    Maintain_Infusion_Rate_Due="<div class='Maintain_Infusion_Rate_Due'></div>",
    Cancelled="<div class='Cancelled'></div>",

    Recordadditionaladministration="<div class='Recordadditionaladministration'></div>"


}



export enum DoseType {
    ["units"] = "units",
    ["strength"] = "strength",
    ["descriptive"] = "descriptive",
  }
  
  export enum FrequencyType {
    ["stat"] = "stat",
    ["mor"] = "mor",
    ["mid"] = "mid",
    ["eve"] = "eve",
    ["x"] = "x",
    ["h"] = "h"
  }
  
  export enum IntervalType {
    ["standard"] = "standard",
    ["variable"] = "variable",
    ["protocol"] = "protocol"
  }
  
  export enum InfusionType {
    ["ci"] = "ci",
    ["bolus"] = "bolus",
    ["rate"] = "rate"
  }
  
  export enum DoseForm {
    ["Discrete"] = "1",
    ["Continuous"] = "2",
    ["NA"] = "3",
  }
  
  export enum PrescriptionDuration {
    ["hours"] = "hours",
    ["days"] = "days",
    ["weeks"] = "weeks",
    ["months"] = "months",
    ["untilcancelled"] = "until cancelled",
    ["enddate"] = "end date"
  }
  export enum DaysOfWeek {
    ["mon"] = "Monday",
    ["tue"] = "Tuesday",
    ["wed"] = "Wednesday",
    ["thu"] = "Thursday",
    ["fri"] = "Friday",
    ["sat"] = "Saturday",
    ["sun"] = "Sunday"
  }
  
  export enum ChosenDays {
    ["all"] = "all",
    ["chosen"] = "chosen",
    ["skip"] = "skip",
  }
  
  export enum FormContext {
    ["moa"] = "moa",
    ["mod"] = "mod",
    ["ip"] = "ip",
    ["op"] = "op"
  
  }
  
  export enum PrescriptionContext {
    ["Inpatient"] = "Inpatient",
    ["Outpatient"] = "Outpatient",
    ["Orderset"] = "Orderset",
    ["Admission"] = "Admission",
    ["Discharge"] = "Discharge"
  }
  
  
  export enum ReconciliationListActions {
    ["start"] = "start",
    ["edit"] = "edit",
    ["complete"] = "complete",
    ["notes"] = "notes",
  }
  
  export enum modules {
    ["app-drug-chart"] = "app-drug-chart",
    ["app-therapy-overview"] = "app-therapy-overview",
    ["app-inpatient-prescribing"] = "app-inpatient-prescribing",
    ["app-reconciliation-lists"]="app-reconciliation-lists",
    ["app-inpatient-prescribing-edit"] = "app-inpatient-prescribing-edit"
  }

  
  export enum AdministrationStatus {
    ["given"] = "given",
    ["defer"] = "defer",
    ["selfadminister"] = "self-administer",
    ["notgiven"] = "notgiven",
  }
  
  export enum AdministrationStatusReason {
    ["Patientunavailable"] = "Patient unavailable",
    ["Nilbymouth"] = "Nil by mouth",
    ["Patientrefused"] = "Patient refused",
    ["Drugunavailable"] = "Drug unavailable",
    ["Clinicalreason"] = "Clinical reason",
    ["Other"] = "Other",
  }
  export enum LevelOfSelfAdmin {
    ["chartedbynurse"] = "Charted by nurse",
    ["automaticallycharted"] = "Automatically charted",
     
  }
 
  export enum AdministrationType {
    ["record"] = "record",
    ["schedule"] = "schedule",
  }
  
  export enum ChangeInfusion {
    ["changeinfusion"] = "changeinfusionset",
    ["changeinfusionkit"] = "changeinfusionkit",
  
  }

  export enum PrescriptionStatus {
	["active"] = "active",
	["modified"] = "modified",
	["suspended"] = "suspended",
	["restarted"] = "restarted",
	["stopped"] = "stopped",
	["cancelled"] = "cancelled",
}

