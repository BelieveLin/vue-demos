import { v4 as uuidv4 } from "uuid";

export const getUUID = () => {
    let uuid_token = sessionStorage.getItem("UUIDTOKEN");
    if (!uuid_token) {
        uuid_token = uuidv4();
        sessionStorage.setItem("UUIDTOKEN", uuid_token);
    };
    return uuid_token;
}