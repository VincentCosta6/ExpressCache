import store from "./store";

export const passInGET = req => {
    return { user_id: req.query.user_id };
}
export const passInPUT = req => {
    return { user_id: req.body.user_id };
}

function DBCall(passIns, resolve, reject) {
    setTimeout(_ => resolve({ hello: Math.random() * 50000000 }), 1500);
}

export const userContext = store.createContext("USER_INFO", passInGET, DBCall);