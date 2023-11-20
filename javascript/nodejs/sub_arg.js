function sub_arg(list_prop) {
    const prop = {}
    const _arg = arg.splice(1)

    for (let i in list_prop) {
        const idx = _arg.findIndex((v) => v === list_prop[i])
        if (idx > -1) {
            const val = _arg[idx + 1]
            if (val) {
                prop[_arg[idx]] = val
            } else {
                prop[list_prop[i]] = null
            }
        } else {
            prop[list_prop[i]] = null
        }

    }

    return prop
}
