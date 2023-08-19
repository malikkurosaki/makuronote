```ts
import { prisma } from "@/utils/prisma";
import { unsealData } from "iron-session";
import _ from "lodash";
import { cookies } from 'next/headers';

export async function funCheckCookie() {
    const token = cookies().get('str_token')
    if (!token) return null
    const userToken = JSON.parse(await unsealData(token.value, { password: process.env.PASSWORD as string }))
    const user = await prisma.user.findUnique({
        where: { id: userToken.id as any },
        select: {
            id: true,
            name: true,
            Auth: {
                select: {
                    userId: true,
                    isActive: true
                }
            }
        },

    })

    if(!user?.Auth || !user.Auth.isActive) return null
    
    return _.omit(user, ['Auth'])
}
```
