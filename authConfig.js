require('dotenv').config();
const passportConfig = {
  credentials: {
    tenantID: process.env.TENANT_ID, //"Enter_the_Tenant_Info_Here",
    clientID: process.env.CLIENT_ID, //"Enter_the_Application_Id_Here",
    clientSecret: "Enter_the_Client_Secret_Here", //process.env.CLIENT_SECRET,
  },
  metadata: {
    authority: "login.microsoftonline.com",
    discovery: ".well-known/openid-configuration",
    version: "v2.0",
  },
  settings: {
    validateIssuer: true,
    passReqToCallback: true,
    loggingLevel: "info",
    loggingNoPII: true,
    cacheTTL: 3600,
  },
  protectedRoutes: {
    routes: {
      endpoint: "https://graph.microsoft.com/v1.0/me/checkMemberGroups",
      scopes: ["User.Read"],
      delegatedPermissions: {
        read: ["User.Read"],
        write: ["User.Read"],
      },
      applicationPermissions: {
        read: ["User.Read"],
        write: ["User.Read"],
      },
    },
  },
};

module.exports = passportConfig;
