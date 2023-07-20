### app/api/login/route.ts
```ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sealData } from 'iron-session/edge'

export async function POST(req: NextRequest) {

    const data = await sealData(JSON.stringify({
        isLoggedIn: true,
        id: 1,
        name: "malik",
        email: "malik@gmail"
    }), {
        password: process.env.PASSWORD as string
    })

    cookies().set({
        name: "session",
        value: data,
        maxAge: 60
    })

    console.log("success")

    return NextResponse.json({
        status: "success",
        isLoggedIn: true
    },
    )
}


```

### app/api/logout/route.ts
```ts


import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'


export function GET() {

    cookies().set({
        name: 'session',
        value: '',
        maxAge: 0,
        expires: new Date(Date.now() + 60 * 60 * 24 * 7),
        path: '/',
    })

    // console.log(cookies().get('session'))

    return NextResponse.json({
        isLoggedIn: false,
    })
}

```

### app/api/user/route.ts
```ts

import { sealData, unsealData } from 'iron-session/edge'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export type User = {
    isLoggedIn: boolean
    login: string
    avatarUrl: string,
    token?: string,
    refershToken?: string
}

export async function GET(req: NextRequest) {


    const k = cookies().get('session')?.value


    if (k === undefined) return NextResponse.json({
        isLoggedIn: false
    })

    const data = await unsealData(k as string, {
        password: process.env.PASSWORD as string
    })

    return NextResponse.json(
        k
        , {
            status: 200,
        })
}

```

### app/login/page.tsx
```tsx
import { checkHasLoggedIn } from '@/lib/check_auth';
import { Login } from './login'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export default async function LoginPage() {

    if ((await checkHasLoggedIn())) redirect('/customer/apa')

        return (
            <html lang='en'>
                <body suppressHydrationWarning={true}>
                    <Login />
                </body>
            </html>
        )
}

```

### app/login/login.tsx
```tsx
'use client'
import { Button, Center, Group, Paper, PasswordInput, Stack, TextInput, Title } from "@mantine/core"
import { redirect, useRouter } from "next/navigation"
import { useState } from "react"

export function Login() {

    const route = useRouter()

    const [body, setBody] = useState({
        email: "",
        password: ""
    })

    return (
        <Center h={"100vh"}>
            <Group align='center' >
                <Paper bg={"gray.6"} shadow='sm' p={"xl"}>
                    <Stack p={"xs"} spacing={"lg"}>
                        <Title color='white'>Login</Title>
                        <TextInput value={body.email} placeholder='email' label="email" onChange={(val => val && setBody({
                            ...body,
                            email: val.currentTarget.value
                        }))} />
                        <PasswordInput value={body.password} placeholder='password' label="password" onChange={val => val && setBody({
                            ...body,
                            password: val.currentTarget.value
                        })} />
                        <Button onClick={() => {
                            fetch('/api/login', {
                                method: "POST",
                                headers: { 'Content-Type': "application/json" },
                                body: JSON.stringify(body)
                            }).then(async (val) => {
                                const data = await val.json()
                                if (data.status === "success") {
                                    return route.push('/customer/apa')
                                }
                            }).catch((e) => {
                                console.log(e)
                            })
                        }}>LOGIN</Button>
                    </Stack>
                </Paper>
            </Group>
        </Center>
    )
}
```

### lib/db.ts
```ts

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

```

### lib/check_auth.ts
```ts
import { redirect, useRouter } from 'next/navigation'
import { cookies } from 'next/headers'
export async function checkHasLoggedIn() {
    const data = cookies().get("session")?.value

    const isCookie = data !== undefined && data !== ''

    return isCookie
}
```




