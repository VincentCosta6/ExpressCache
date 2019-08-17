var store_1 = require("./store");
exports.passInGET = function (req) {
    return { user_id: req.query.user_id };
};
exports.passInPUT = function (req) {
    return { user_id: req.body.user_id };
};
function DBCall(passIns, resolve, reject) {
    setTimeout(function (_) { return resolve({ hello: Math.random() * 50000000 }); }, 1500);
}
exports.userContext = store_1.default.createContext("USER_INFO", exports.passInGET, DBCall);
