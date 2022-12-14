const passport = require("passport");
const passportAzureAd = require("passport-azure-ad");
const {
  isAppOnlyToken,
  hasRequiredDelegatedPermissions,
  hasRequiredApplicationPermissions,
} = require("./permissionUtils");
const authConfig = require("./authConfig");

module.exports.bearerStrategy = new passportAzureAd.BearerStrategy(
  {
    identityMetadata: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
    issuer: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}`,
    clientID: authConfig.credentials.clientID,
    audience: authConfig.credentials.clientID, // audience is this application
    validateIssuer: authConfig.settings.validateIssuer,
    passReqToCallback: authConfig.settings.passReqToCallback,
    // loggingLevel: authConfig.settings.loggingLevel,
    loggingNoPII: authConfig.settings.loggingNoPII,
  },
  (req, token, done) => {
    /**
     * Lines below verifies if the caller's client ID is in the list of allowed clients.
     * This ensures only the applications with the right client ID can access this API.
     * To do so, we use "azp" claim in the access token. Uncomment the lines below to enable this check.
     */
    // const myAllowedClientsList = [
    //     /* add here the client IDs of the applications that are allowed to call this API */
    // ]
    // if (!myAllowedClientsList.includes(token.azp)) {
    //     return done(new Error('Unauthorized'), {}, "Client not allowed");
    // }

    /**
     * Access tokens that have neither the 'scp' (for delegated permissions) nor
     * 'roles' (for application permissions) claim are not to be honored.
     */
    if (!token.hasOwnProperty("idp") && !token.hasOwnProperty("aio")) {
      return done(
        new Error("Unauthorized"),
        null,
        "No delegated or app permission claims found"
      );
    }

    /**
     * If needed, pass down additional user info to route using the second argument below.
     * This information will be available in the req.user object.
     */
    return done(null, {}, token);
  }
);

module.exports.isAuthenticated = (req, res, next) => {
  console.log(passport);
  passport.authenticate(
    "oauth-bearer",
    {
      session: false,
      /**
       * If you are building a multi-tenant application and you need supply the tenant ID or name dynamically,
       * uncomment the line below and pass in the tenant information. For more information, see:
       * https://github.com/AzureAD/passport-azure-ad#423-options-available-for-passportauthenticate
       */
      // tenantIdOrName: <some-tenant-id-or-name>
    },
    (err, user, info) => {
      // console.log("err user info");
      if (err) {
        /**
         * An error occurred during authorization. Either pass the error to the next function
         * for Express error handler to handle, or send a response with the appropriate status code.
         */
        return res.status(401).json({ error: err.message });
      }
      if (!user) {
        // If no user object found, send a 401 response.
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (info) {
        console.log("Found user");
        console.log(info)
        // access token payload will be available in req.authInfo downstream
        req.authInfo = info;
        return next();
      }
    }
  )(req, res, next);
  /* below will call to execute the next middleware, saying this middleware retured true
  if above lines are commented, uncomment this below line
   */
  // next();
};

module.exports.checkAppPermissions = (req) => {
  console.log("checking app permissions");
  /* if (
    hasRequiredApplicationPermissions(
      req.authInfo,
      authConfig.protectedRoutes.routes.applicationPermissions.read
    )
  ) {
    return true;
  } else {
    return false;
  } */
};

module.exports.checkDeligatedPermissions = (req) => {
  console.log("checking deligated permissions");
  /* if (
    hasRequiredDelegatedPermissions(
      req.authInfo,
      authConfig.protectedRoutes.routes.delegatedPermissions.read
    )
  ) {
    return true;
  } else {
    return false;
  } */
};
