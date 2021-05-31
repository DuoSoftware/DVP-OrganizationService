/**
 * Created by Pawan on 8/1/2016.
 */
var logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
var Tenant = require('dvp-mongomodels/model/Tenant').Tenant;
var messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var Org = require('dvp-mongomodels/model/Organisation');
var organizationService = require('./OrganisationService.js');
var util = require('util');

function CreateTenant(req, res) {

    logger.debug("DVP-UserService.CreateTenant Internal method ");
    var jsonString;

    if(req.body ) {
        var tenantObj = Tenant({
            id: req.body.id,
            rootDomain:req.body.rootDomain,
            created_at: Date.now(),
            updated_at: Date.now()
        });


        tenantObj.save(function (err, usertenant) {
            if (err) {
                jsonString = messageFormatter.FormatMessage(err, "User Group save failed", false, undefined);
                res.end(jsonString);
            } else {


                jsonString = messageFormatter.FormatMessage(undefined, "User Group saved successfully", true, usertenant);
                res.end(jsonString);
            }
        });
    }else{


        jsonString = messageFormatter.FormatMessage(undefined, "Require fields not found", false, undefined);
        res.end(jsonString);

    }
}

function GetAllTenants(req, res){


    logger.debug("DVP-UserService.GetAllTenants Internal method ");

    var jsonString;
    Tenant.find(function(err, Tenants) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Tenants Failed", false, undefined);

        }else {

            if (Tenants) {


                jsonString = messageFormatter.FormatMessage(err, "Get Tenants Successful", true, Tenants);

            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Tenants Found", false, undefined);

            }
        }

        res.end(jsonString);
    });

}
function GetTenant(req, res){


    logger.debug("DVP-UserService.GetTenant Internal method ");

    var jsonString;
    Tenant.find({id:req.params.id},function(err, Tenants) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Tenant Failed", false, undefined);

        }else {

            if (Tenants) {


                jsonString = messageFormatter.FormatMessage(err, "Get Tenant Successful", true, Tenants);

            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Tenant Found", false, undefined);

            }
        }

        res.end(jsonString);
    });

}

function GetCompanyDomain(req, res){


    logger.debug("DVP-UserService.GetTenant Internal method ");

    var jsonString;
    Org.findOne({companyName:req.params.companyname}).populate('tenantRef').exec(function(err, organizationData) {
        if (err) {

            jsonString = messageFormatter.FormatMessage(err, "Get Tenant Failed", false, undefined);

        }else {

            if (organizationData) {

                var domainData=req.params.companyname+"."+organizationData.tenantRef.rootDomain;
                var organizationDomain= {
                    Domain:domainData.toLowerCase()
                };



                jsonString = messageFormatter.FormatMessage(err, "Get Tenant Successful", true, organizationDomain);

            }else{

                jsonString = messageFormatter.FormatMessage(undefined, "No Tenant Found", false, undefined);

            }
        }

        res.end(jsonString);
    });

}
 async function getObject(key, callback) {
     await organizationService.RedisCon.get(key, function (err, obj) {
        if (err) {
            logger.error("Redis getObject (get) error :: %s", err);
            callback(err, undefined);
        } else {
            logger.info("Redis getObject (get) success :: %s", obj);
            callback(err, obj);
        }
    });
};

async function GetBasicCompanyDetailsByTenant(req, res){
    var jsonString;
    try{
        var tenant = req.user.tenant;
        logger.debug("DVP-UserService.GetBasicCompanyDetailsByTenant Internal method ");
        Org.find({tenant: tenant}).lean().exec(async function (err, orgs) {
            if(err){
                jsonString = messageFormatter.FormatMessage(err, "Get Basic Company Details Failed", false, undefined);
            }else{
                var basicOrgDetails = orgs.map(function (org) {
                    return{
                        companyName: org.companyName,
                        companyId: org.id,
                        companyStatus: org.companyEnabled,
                        activeUsers: 0
                    }
                });


                for(var i=0; i<basicOrgDetails.length; i++){
                    currentCountSearch = util.format('CONCURRENTWLPARAM:%s:%s:%s:%s', tenant, basicOrgDetails[i].companyId, 'LOGIN', 'Register');
                    logger.info("REDIS KEY :: %s", currentCountSearch);

                    await getObject(currentCountSearch, function(err, result){
                        if(err){
                            jsonString = messageFormatter.FormatMessage(err, "OnGetCurrentCount: Get Failed", false, 0);
                            logger.error("Redis get Concurrent info failed :: %s", jsonString);
                        }else{
                            if(result){
                                basicOrgDetails[i].activeUsers = result;
                                jsonString = messageFormatter.FormatMessage(undefined, "OnGetCurrentCount: Success", true, basicOrgDetails[i].activeUsers);
                                logger.info("Redis get Concurrent info success :: %s", jsonString);
                            }else{
                                jsonString = messageFormatter.FormatMessage(undefined, "OnGetCurrentCount: No Keys Found", false, basicOrgDetails[i].activeUsers);
                                logger.info("Redis get Concurrent info failed :: %s", jsonString);
                            }
                        }
                    });
                }
                jsonString = messageFormatter.FormatMessage(undefined, "Get Basic Company Details Success", true, basicOrgDetails);


            }

            res.end(jsonString);
        });
    }catch(ex){
        jsonString = messageFormatter.FormatMessage(ex, "Get Basic Company Details Failed", false, undefined);
        res.end(jsonString);
    }
}

module.exports.CreateTenant = CreateTenant;
module.exports.GetAllTenants = GetAllTenants;
module.exports.GetTenant = GetTenant;
module.exports.GetCompanyDomain = GetCompanyDomain;
module.exports.GetBasicCompanyDetailsByTenant = GetBasicCompanyDetailsByTenant;