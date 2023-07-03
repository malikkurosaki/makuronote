### _app.tsx

```tsx
import fetchJson from "@/lib/fetchJson";
import { MantineProvider } from "@mantine/core";
import { AppProps } from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";

export default function App(props: AppProps) {
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

### pages/login.tsx

```tsx
import React, { useState } from 'react'
import useUser from '@/lib/useUser'
import Layout from '@/components/Layout'
import Form from '@/components/Form'
import fetchJson, { FetchError } from '@/lib/fetchJson'

export default function Login() {
  // here we just check if user is already logged in and redirect to profile
  const { mutateUser } = useUser({
    redirectTo: '/profile-sg',
    redirectIfFound: true,
  })

  const [errorMsg, setErrorMsg] = useState('')

  return (
    <Layout>
      <div className="login">
        <Form
          errorMessage={errorMsg}
          onSubmit={async function handleSubmit(event) {
            event.preventDefault()

            const body = {
              username: event.currentTarget.username.value,
            }

            try {
              mutateUser(
                await fetchJson('/api/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                })
              )
            } catch (error) {
              if (error instanceof FetchError) {
                setErrorMsg(error.data.message)
              } else {
                console.error('An unexpected error happened:', error)
              }
            }
          }}
        />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  )
}
```

### pages/login-sg.tsx

```tsx
import React from 'react'
import Layout from '@/components/Layout'
import useUser from '@/lib/useUser'
import useEvents from '@/lib/useEvents'

// Make sure to check https://nextjs.org/docs/basic-features/layouts for more info on how to use layouts
export default function SgProfile() {
  const { user } = useUser({
    redirectTo: '/login',
  })
  const { events } = useEvents(user)

  return (
    <Layout>
      <h1>Your GitHub profile</h1>
      <h2>
        This page uses{' '}
        <a href="https://nextjs.org/docs/basic-features/pages#static-generation-recommended">
          Static Generation (SG)
        </a>{' '}
        and the <a href="/api/user">/api/user</a> route (using{' '}
        <a href="https://github.com/vercel/swr">vercel/SWR</a>)
      </h2>
      {user && (
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

import { Octokit } from 'octokit'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
const octokit = new Octokit()

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username } = await req.body

  try {
    const {
      data: { login, avatar_url },
    } = await octokit.rest.users.getByUsername({ username })

    const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User

    console.log(user)
    req.session.user = user
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

### pages/api/user.ts

```ts
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export type User = {
  isLoggedIn: boolean
  login: string
  avatarUrl: string
}

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
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
    secure: process.env.NODE_ENV === 'production',
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

### .env

```env
# SESSION SECRET
SESSION_SECRET="1234567890"
```

### .env.development / .env.production

```env
SECRET_COOKIE_PASSWORD=2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8
```



