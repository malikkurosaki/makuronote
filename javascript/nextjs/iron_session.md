install 

```bash
yarn add iron-session
```


### pages/login.tsx
```tsx
import React, { useState } from 'react'
import useUser from '@/lib/use_user'
import Layout from '@/components/Layout'
import Form from '@/components/Form'
import fetchJson, { FetchError } from '@/lib/fetch_json'
import { Button, Center, Group, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core'

export default function Login(props: any) {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: '/profile-sg',
    redirectIfFound: true,
  })

  const [body, setBody] = useState({
    email: "",
    password: ""
  })

  return (
    <Layout>
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
                  mutateUser(await val.json())
                }).catch((e) => {
                  console.log(e)
                })
              }}>LOGIN</Button>
            </Stack>
          </Paper>
        </Group>
      </Center>
    </Layout>
  )
}
```

### pages/profile-sg.tsx
```tsx
import React from 'react'
import Layout from '@/components/Layout'
import useUser from '@/lib/use_user'
import useEvents from '@/lib/use_events'

// Make sure to check https://nextjs.org/docs/basic-features/layouts for more info on how to use layouts
export default function SgProfile(props: any) {
    const { user } = useUser({
        redirectTo: '/login',
    })
    const { events } = useEvents(user)

    return (
        <Layout>
            {user && (
                <>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </>
            )}

            {events !== undefined && (
                <p>
                    Number of GitHub events for user: <b>{events.length}</b>.{' '}
                    {events.length > 0 && (
                        <>
                            Last event type: <b>{events[0].type}</b>
                        </>
                    )}
                </p>
            )}
        </Layout>
    )
}
```

### pages/profile-ssr.tsx
```tsx
import React from 'react'
import Layout from '@/components/Layout'
import { withIronSessionSsr } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { User } from '@/pages/api/user'

import { InferGetServerSidePropsType } from 'next'

export default function SsrProfile({
    user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Layout>
            <h1>Your GitHub profile</h1>
            <h2>
                This page uses{' '}
                <a href="https://nextjs.org/docs/basic-features/pages#server-side-rendering">
                    Server-side Rendering (SSR)
                </a>{' '}
                and{' '}
                <a href="https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props">
                    getServerSideProps
                </a>
            </h2>

            {user?.isLoggedIn && (
                <>
                    <p style={{ fontStyle: 'italic' }}>
                        Public data, from{' '}
                        <a href={`https://github.com/${user.login}`}>
                            https://github.com/{user.login}
                        </a>
                        , reduced to `login` and `avatar_url`.
                    </p>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </>
            )}
        </Layout>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
}) {
    const user = req.session.user

    if (user === undefined) {
        res.setHeader('location', '/login')
        res.statusCode = 302
        res.end()
        return {
            props: {
                user: { isLoggedIn: false, login: '', avatarUrl: '' } as User,
            },
        }
    }

    return {
        props: { user: req.session.user },
    }
},
    sessionOptions)
```

### pages/_app.tsx
```tsx
import fetchJson from "@/lib/fetch_json";
import { MantineProvider } from "@mantine/core";
import { AppProps } from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";

export default function App(props: any) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <SWRConfig
          value={{
            fetcher: fetchJson,
            onError: (err) => {
              console.error(err)
            },
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </MantineProvider>
    </>
  );
}

```

### pages/api/events.ts
```ts
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { Octokit } from 'octokit'

import type { Endpoints } from '@octokit/types'
import { NextApiRequest, NextApiResponse } from 'next'

export type Events =
    Endpoints['GET /users/{username}/events']['response']['data']

const octokit = new Octokit()

async function eventsRoute(req: NextApiRequest, res: NextApiResponse<Events>) {
    const user = req.session.user

    if (!user || user.isLoggedIn === false) {
        res.status(401).end()
        return
    }

    try {
        const { data: events } =
            await octokit.rest.activity.listPublicEventsForUser({
                username: user.login,
            })

        res.json(events)
    } catch (error) {
        res.status(200).json([])
    }
}

export default withIronSessionApiRoute(eventsRoute, sessionOptions)
```

### pages/api/login.ts
```ts
import type { User } from './user'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/db'

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = await req.body

  try {
   
    const data = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!data) {
      throw new Error('User not found')
    }

    if (data.password !== password) {
      throw new Error('Wrong password')
    }

    const user = { isLoggedIn: true, login: data.email, avatarUrl: "" } as User

    
    console.log(user)
    req.session.user = user
    req.session.user.token  = "ini_token_123"
    req.session.user.refershToken = "ini_refresh_token_123"


    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)
```

### pages/api/logout.ts

```ts
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import type { User } from '@/pages/api/user'

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    req.session.destroy()
    res.json({ isLoggedIn: false, login: '', avatarUrl: '' })
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)
```

### pages/aapi/user.ts

```ts
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export type User = {
  isLoggedIn: boolean
  login: string
  avatarUrl: string,
  token?: string,
  refershToken?: string
}

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {

  console.log(JSON.stringify(sessionOptions, null, 2))
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    })
  } else {
    res.json({
      isLoggedIn: false,
      login: '',
      avatarUrl: '',
    })
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions)
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

### lib/fetch_json.ts

```ts
export class FetchError extends Error {
    response: Response
    data: {
        message: string
    }
    constructor({
        message,
        response,
        data,
    }: {
        message: string
        response: Response
        data: {
            message: string
        }
    }) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError)
        }

        this.name = 'FetchError'
        this.response = response
        this.data = data ?? { message: message }
    }
}

export default async function fetchJson<JSON = unknown>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON> {
    const response = await fetch(input, init)

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json()

    // response.ok is true when res.status is 2xx
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
    if (response.ok) {
        return data
    }

    throw new FetchError({
        message: response.statusText,
        response,
        data,
    })
}

```

### lib/session.ts

```ts
// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session'
import type { User } from '@/pages/api/user'

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'iron-session/examples/next.js',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    expires: new Date(Date.now() + 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
}


// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user?: User
  }
}
```

### lib/use_events.ts

```ts
import useSWR from 'swr'
import type { User } from '@/pages/api/user'
import type { Events } from '@/pages/api/events'

export default function useEvents(user: User | undefined) {
  // We do a request to /api/events only if the user is logged in
  const { data: events } = useSWR<Events>(
    user?.isLoggedIn ? `/api/events` : null
  )

  return { events }
}
```

### lib/use_user.ts

```ts
import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { User } from '@/pages/api/user'

export default function useUser({
    redirectTo = '',
    redirectIfFound = false,
} = {}) {
    const { data: user, mutate: mutateUser } = useSWR<User>('/api/user')

    useEffect(() => {
        // if no redirect needed, just return (example: already on /dashboard)
        // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
        if (!redirectTo || !user) return

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.isLoggedIn)
        ) {
            Router.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo])

    return { user, mutateUser }
}

```

### components/form.tsx

```tsx
import { FormEvent } from 'react'

export default function Form({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        <span>Type your GitHub username</span>
        <input type="text" name="username" required />
      </label>

      <button type="submit">Login</button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <style jsx>{`
        form,
        label {
          display: flex;
          flex-flow: column;
        }
        label > span {
          font-weight: 600;
        }
        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .error {
          color: brown;
          margin: 1rem 0 0;
        }
      `}</style>
    </form>
  )
}

```

### components/header.tsx

```tsx
import Link from 'next/link'
import useUser from '@/lib/use_user'
import { useRouter } from 'next/router'
import fetchJson from '@/lib/fetch_json'
import { Box, Flex, Image, UnstyledButton } from '@mantine/core'
import { MdAccountCircle } from 'react-icons/md'

export default function Header() {
    const { user, mutateUser } = useUser()
    const router = useRouter()

    return (
        <>
            {/* {JSON.stringify(user)} */}
            <Flex bg={"dark"} p={"xs"} gap={"md"} align={"center"}>
                <Box c={"white"}>
                    <Link href="/" legacyBehavior >
                        <UnstyledButton c={"white"}>Home</UnstyledButton>
                    </Link>
                </Box>
                
                {user?.isLoggedIn === true && (<>
                    <Link
                        href="/api/logout"
                        onClick={async (e) => {
                            e.preventDefault()
                            mutateUser(
                                await fetchJson('/api/logout', { method: 'POST' }),
                                false
                            )
                            router.push('/login')
                        }}
                    >
                        <UnstyledButton c='white'> Logout</UnstyledButton>
                    </Link>
                </>)}
            </Flex>
        </>
    )
}

```

### components/layout.tsx

```tsx
import Head from 'next/head'
import Header from '@/components/Header'
import useUser from '@/lib/use_user'

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, mutateUser } = useUser()
    return (
        <>
            {user?.isLoggedIn === true && <>
                <Header />
            </>}

            {children}
        </>
    )
}
```


