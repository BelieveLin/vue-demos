import * as user from "./user";
import * as role from "./role";
import * as permission from "./permission";


export default {
    ...user,
    ...role,
    ...permission
}