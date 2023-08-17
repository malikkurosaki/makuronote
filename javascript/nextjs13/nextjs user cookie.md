```tsx
import { prisma } from "@/utils/prisma";
import { unsealData } from "iron-session";
import { cookies } from 'next/headers';
export async function funUserCookie() {
    const token = cookies().get('str_token')
    if (!token) return null
    const userToken = JSON.parse(await unsealData(token.value, { password: process.env.PASSWORD as string }))
    const user = await prisma.user.findUnique({
        where: { id: userToken.id as any }, select: {
            id: true,
            name: true,
            email: true
        }
    })
    if (!user) return null
    return user
}
```
