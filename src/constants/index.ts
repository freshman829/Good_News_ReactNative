import * as PlanConstants from "./plans";
import * as Allergies from "./allergies";
import * as HealthConstants from "./healthCondition";
import * as Common from "./common";

// const API_URL = "https://goodnews2023.herokuapp.com/api";
const API_URL = "http://10.0.2.2:3000/api";

// OpenPhone API Setting
const OPANPHONE_API_URL = "https://api.openphone.co/vl"; 
const OPENPHONE_NUMBER = "+14155238886";
const OPENPHONE_API_KEY = "Bearer 5b1b4b7b-7b7b-4b7b-8b7b-7b7b7b7b7b7b";   

const StorageDatesNames = {
    plan: "planStorageDate",
    suggest: "suggestStorageDate",
    alarm: "alarmStorageDate",
};

export {
    PlanConstants,
    HealthConstants,
    Allergies,
    API_URL,
    StorageDatesNames,
    Common,
    OPANPHONE_API_URL,
    OPENPHONE_NUMBER,
    OPENPHONE_API_KEY
};