const ExpertRoutes = require('express').Router();
const ExpertController = require('./../controllers/tax_expert_controller');


// route level middleware to protect route
// UserRoutes.use("/personal-details", checkExpertAuth);
// UserRoutes.use("/educational-details", checkExpertAuth);
// UserRoutes.use("/experience-details", checkExpertAuth);


ExpertRoutes.post("/sign-up", ExpertController.signUp);
ExpertRoutes.post("/sign-in", ExpertController.signIn);
ExpertRoutes.post("/save-all-data", ExpertController.saveAllData);
ExpertRoutes.get("/all-tax-experts", ExpertController.fetchTaxExperts);
ExpertRoutes.get("/search", ExpertController.searchTaxExperts);
ExpertRoutes.post('/hire', ExpertController.hireExpert);
ExpertRoutes.get('/allocated-users/:expertId', ExpertController.getAllocatedUsers);
ExpertRoutes.get('/check-email-expert', ExpertController.checkEmail);



// TaxExpertRoutes.get("/search", TaxExpertController.searchTaxExperts);


// protected Routes
// TaxExpertRoutes.post("/personal-details", TaxExpertController.savePersonalDetails);
// TaxExpertRoutes.post("/educational-details", TaxExpertController.saveEducationalDetails);
// TaxExpertRoutes.post("/experience-details", TaxExpertController.saveExperienceDetails);


module.exports = ExpertRoutes;