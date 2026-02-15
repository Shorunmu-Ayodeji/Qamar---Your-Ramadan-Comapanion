const {setGlobalOptions} = require("firebase-functions/v2");

setGlobalOptions({maxInstances: 10, region: "us-central1"});

// Spark-safe placeholder: no email backend or scheduled digest jobs.
