import * as PlanConstants from "./plans";
import * as Allergies from "./allergies";
import * as HealthConstants from "./healthCondition";

// const API_URL = "https://goodnews2023.herokuapp.com/api";
const API_URL = "http://10.0.2.2:3000/api";

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
    StorageDatesNames
};