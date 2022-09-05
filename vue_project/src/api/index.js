import * as dashboard from "./dashboard"
import acl from "./acl";
import product from "./product";


export default {
    ...dashboard,
    ...acl,
    ...product
}

