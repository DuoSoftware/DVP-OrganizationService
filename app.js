var express = require("express");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var errorhandler = require("errorhandler");
var session = require("express-session");
var cors = require("cors");
var app = express();

var logger = require("dvp-common/LogHandler/CommonLogHandler.js").logger;
var organisationService = require("./OrganisationService");
var config = require("config");
var jwt = require("restify-jwt");
var secret = require("dvp-common/Authentication/Secret.js");
var authorization = require("dvp-common/Authentication/Authorization.js");
var healthcheck = require("dvp-healthcheck/DBHealthChecker");

// tenant operations
var businessUnitService = require("./BusinessUnitService");
var tenantService = require("./TenantService");
var mongomodels = require("dvp-mongomodels");

var port = config.Host.port || 3000;
process.on("uncaughtException", function(err) {
  console.error(err);
  console.log("[Unhandled Exception] Node Exiting...");
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error(err);
  console.log("[Unhandled Rejection] Node Exiting...");
  process.exit(1);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(errorhandler({ dumpExceptions: true, showStack: true }));
app.use(cors());
//app.use(jwt({secret: secret.Secret}));

var hc = new healthcheck(app, {
  redis: organisationService.RedisCon,
  pg: organisationService.DbConn,
  mongo: mongomodels.connection
});
hc.Initiate();

//-----------------------------------Organization----------------------------------------------------------
app.get(
  "/DVP/API/:version/Organisation/Name/:tenant/:company",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "myUserProfile", action: "read" }),
  organisationService.GetOrganisationName
);
app.get(
  "/DVP/API/:version/Organisations",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "read" }),
  organisationService.GetOrganisations
);
app.get(
  "/DVP/API/:version/Organisations/:page/:size",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "read" }),
  organisationService.GetOrganisationsWithPaging
);
app.get(
  "/DVP/API/:version/Organisation",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "read" }),
  organisationService.GetOrganisation
);
app.get(
  "/DVP/API/:version/Organisation/ConsoleAccessLimits",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "read" }),
  organisationService.GetOrganisationConsoleAccessLimits
);
app.delete(
  "/DVP/API/:version/Organisation",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "delete" }),
  organisationService.DeleteOrganisation
);
app.put(
  "/DVP/API/:version/Organisation/Activate/:state",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisationManage", action: "write" }),
  organisationService.ActivateOrganisation
);
app.get(
  "/DVP/API/:version/Organisation/Packages/:company/:type?",
  authorization({ resource: "package", action: "read" }),
  organisationService.GetOrganisationPackagesByType
);

app.get(
  "/DVP/API/:version/Organization/:company/exists",
  organisationService.IsOrganizationExists
);

app.put(
  "/DVP/API/:version/Organisation",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "write" }),
  organisationService.UpdateOrganisation
);
app.put(
  "/DVP/API/:version/Organisation/Package/:packageName",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "write" }),
  organisationService.AssignPackageToOrganisation
);
app.delete(
  "/DVP/API/:version/Organisation/Package/:packageName",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "write" }),
  organisationService.RemovePackageFromOrganisation
);
app.get(
  "/DVP/API/:version/MyOrganization/mypackages",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "package", action: "read" }),
  organisationService.GetOrganisationPackages
);
app.get(
  "/DVP/API/:version/Organisation/billingInformation",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "package", action: "read" }),
  organisationService.GetBillingDetails
);

app.put(
  "/DVP/API/:version/Organisation/Package/:packageName/Unit/:unitName/:topUpCount",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "write" }),
  organisationService.AssignPackageUnitToOrganisation
);

app.get(
  "/DVP/API/:version/Organisation/SpaceLimit/:spaceType",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "read" }),
  organisationService.GetSpaceLimit
);
app.get(
  "/DVP/API/:version/Organisation/SpaceLimits/:spaceType",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "read" }),
  organisationService.GetSpaceLimitForTenant
);

//Abandon Call Redial Config

app.post(
  "/DVP/API/:version/Organisation/AbandonCallRedialConfig",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "write" }),
  organisationService.AddOrUpdateAbandonCallRedialConfig
);
app.get(
  "/DVP/API/:version/Organisation/AbandonCallRedialConfig",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "organisation", action: "read" }),
  organisationService.GetAbandonCallRedialConfig
);

//-----------------------------------Tenant Monitoring----------------------------------------------------------
app.get(
  "/DVP/API/:version/Tenant/Company/:company",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "tenant", action: "read" }),
  organisationService.GetOrganisation
);
app.put(
  "/DVP/API/:version/Organisation/:company",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "tenant", action: "write" }),
  organisationService.UpdateOrganisation
);
app.put(
  "/DVP/API/:version/Organisation/:company/Package/:packageName",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "tenant", action: "write" }),
  organisationService.AssignPackageToOrganisation
);
app.put(
  "/DVP/API/:version/Organisation/:company/Package/:packageName/Unit/:unitName/:topUpCount",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "tenant", action: "write" }),
  organisationService.AssignPackageToOrganisation
);
app.put(
  "/DVP/API/:version/Organisation/:company/Activate/:state",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "tenant", action: "write" }),
  organisationService.ActivateOrganisation
);

//----------------------------------- BusinessUnit ----------------------------------------------------------
app.post(
  "/DVP/API/:version/BusinessUnit",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "user", action: "write" }),
  businessUnitService.AddBusinessUnit
);
app.put(
  "/DVP/API/:version/BusinessUnit/:unitname",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "user", action: "write" }),
  businessUnitService.UpdateBusinessUnit
);
app.put(
  "/DVP/API/:version/BusinessUnit/:unitname/Groups",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "user", action: "write" }),
  businessUnitService.UpdateBusinessUnitUserGroups
);
app.get(
  "/DVP/API/:version/BusinessUnits",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "user", action: "read" }),
  businessUnitService.GetBusinessUnits
);
app.get(
  "/DVP/API/:version/ConsolidatedBusinessUnits/:consolidated",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "consolidatedreports", action: "read" }),
  businessUnitService.GetBusinessUnits
);
app.get(
  "/DVP/API/:version/BusinessUnitsWithGroups",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "user", action: "read" }),
  businessUnitService.GetBusinessUnitsWithGroups
);
app.get(
  "/DVP/API/:version/BusinessUnit/:unitName",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "user", action: "read" }),
  businessUnitService.GetBusinessUnit
);

app.put(
  "/DVP/API/:version/BusinessUnit/:name/Head/:hid",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "write" }),
  businessUnitService.AddHeadToBusinessUnits
);
app.delete(
  "/DVP/API/:version/BusinessUnit/:name/Head/:hid",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "write" }),
  businessUnitService.RemoveHeadToBusinessUnits
);
app.put(
  "/DVP/API/:version/BusinessUnit/:name/Heads",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "write" }),
  businessUnitService.AddHeadsToBusinessUnit
);
app.get(
  "/DVP/API/:version/Supervisor/:sid/BusinessUnits",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "read" }),
  businessUnitService.GetSupervisorBusinessUnits
);
app.get(
  "/DVP/API/:version/BusinessUnit/:name/Users",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "read" }),
  businessUnitService.GetUsersOfBusinessUnits
);
app.get(
  "/DVP/API/:version/ConsolidatedBusinessUnit/:name/Users/:consolidated",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "consolidatedreports", action: "read" }),
  businessUnitService.GetUsersOfBusinessUnits
);
app.get(
  "/DVP/API/:version/ConsolidatedBusinessUnitFull/:name/Users/:consolidated",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "consolidatedreports", action: "read" }),
  businessUnitService.GetUsersOfBusinessUnitsWithScopes
);
app.get(
  "/DVP/API/:version/BusinessUnitFull/:name/Users",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "read" }),
  businessUnitService.GetUsersOfBusinessUnitsWithScopes
);
app.get(
  "/DVP/API/:version/MyBusinessUnit",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "read" }),
  businessUnitService.GetMyBusinessUnit
);
app.get(
  "/DVP/API/:version/GetBusinessUnitAndGroups/:ResourceId",
  authorization({ resource: "userGroup", action: "read" }),
  businessUnitService.GetBusinessUnitAndGroupsByResourceId
);
app.get(
  "/DVP/API/:version/BusinessUnit/:name/UserCount",
  authorization({ resource: "userGroup", action: "read" }),
  businessUnitService.GetUserCountOfBusinessUnit
);

//----------------------------------- Tenant ----------------------------------------------------------
app.post(
  "/DVP/API/:version/Tenant",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", ion: "write" }),
  tenantService.CreateTenant
);
app.get(
  "/DVP/API/:version/Tenants",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "read" }),
  tenantService.GetAllTenants
);
app.get(
  "/DVP/API/:version/Tenant/:id",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "read" }),
  tenantService.GetTenant
);
app.get(
  "/DVP/API/:version/CompanyDomain/:companyname",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "userGroup", action: "read" }),
  tenantService.GetCompanyDomain
);
app.get(
  "/DVP/API/:version/Tenant/Company/BasicInfo",
  jwt({ secret: secret.Secret }),
  authorization({ resource: "tenant", action: "read" }),
  tenantService.GetBasicCompanyDetailsByTenant
);

app.listen(port, function() {
  logger.info("DVP-OrganizationService.main Server listening at %d", port);
});
