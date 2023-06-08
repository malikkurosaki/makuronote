```js
import toast from "react-simple-toasts"
import { userRoleEdit } from "../view/modal_user_role_edit"
import { api_user_role_edit } from "../api/api_user_role_edit"
import _ from "lodash"

const fun_user_role_edit = async ({ body }: { body: any }) => {


    const res = await fetch("/api/" + _.kebabCase(api_user_role_edit.name), {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (res.status == 201) {
        const data = await res.json()
        toast("success")
        return data
    }

    return null
}

export { fun_user_role_edit }
```
