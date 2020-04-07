//Setzt im LocalStorage die jobId
function setLocalstorageJobId(jobId) {
    localStorage.setItem("jobId", jobId);
}

//Gibt den Wert der jobId, welcher im LocalStorage ist, zurueck 
function getLocalstorageJobId() {
    return localStorage.getItem("jobId");
}

//Setzt im LocalStorage die klassenId
function setLocalstorageKlassenId(klassenId) {
    localStorage.setItem("klassenId", klassenId);
}

//Gibt den Wert der klassenId, welcher im LocalStorage ist, zurueck
function getLocalstorageKlassenId() {
    return localStorage.getItem("klassenId");
}
