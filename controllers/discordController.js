const { COOKIE_CONFIG } = require("../config");
const cookie = require("cookie");
const discordOAuthService = require("../services/discordService");

function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

exports.getDiscordUrl = (req, res) => {
  // Passes scope and crypto state, along with client id and redirect URI, constructed in library method
  const url = discordOAuthService.generateDiscordURL();

  res.cookie("state", getParameterByName("state", url), {
    maxAge: 1000 * 60 * 20,
  });

  res.json({
    discordUrl: url,
  });
};

//Get state from req header
const getStateFromHeader = (req) => {
  if (req.headers) {
    const state = cookie.parse(req.headers.cookie).state;
    return state;
  }
};

exports.authenticateDiscordUser = async (req, res) => {
  // URL contains state and code when user redirected back to app by redirect uri specified
  try {
    const { code, state } = req.body;
    //Get state from header
    const previousState = getStateFromHeader(req);

    if (previousState === state) {
      // Function that requests token from Discord, gens JWT, returns user data and JWT
      const { jwt, user } = await discordOAuthService.createDiscordUser(code);
      res.cookie("jwt", jwt, COOKIE_CONFIG);
      //TODO: figure out what issue is here because user data not being returned - console shows undefined

      res.json(user);
    } else {
      res.status(401).json({ message: "Invalid Discord authorization" });
    }
  } catch (err) {
    console.log(err);
  }
};

// var cookie = require("cookie");
// const COOKIE_CONFIG = require("../config").COOKIE_CONFIG;
// var discordOAuthService = require("../services/discordService");

// function getParameterByName(name, url) {
//   name = name.replace(/[\[\]]/g, "\\$&");
//   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//     results = regex.exec(url);
//   if (!results) return null;
//   if (!results[2]) return "";
//   return decodeURIComponent(results[2].replace(/\+/g, " "));
// }

// exports.getDiscordUrl = (req, res) => {
//   const url = discordOAuthService.generateDiscordURL();
//   res.cookie("state", getParameterByName("state", url), {
//     maxAge: 1000 * 60 * 20, // 20min. Short because this is for CSRF protection
//   });

//   res.json({
//     discordUrl: url,
//   });
// };

// const getStateFromHeader = (req) => {
//   if (req.headers) {
//     const state = cookie.parse(req.headers.cookie).state;
//     return state;
//   }
// };

// exports.authenticateDiscordUser = async function (req, res) {
//   const { code, state } = req.body;

//   // we need to check the state.
//   // It was set in the cookie and the supposedly-correct state was sent in the body
//   const previousState = getStateFromHeader(req);

//   if (state === previousState) {
//     // by taking this out of the controller function, we keep our responsibilities low
//     const { user, jwt } = await discordOAuthService.createDiscordUser(
//       code,
//       state
//     );

//     // we're good. Let's log them in with a JWT
//     res.cookie("jwt", jwt, COOKIE_CONFIG);

//     res.json(user);
//   } else {
//     // if the state from the body didn't match the state from the cookie, it was not the same user.
//     res.status(401).json({
//       message: "invalid Discord authorization",
//     });
//   }
// };