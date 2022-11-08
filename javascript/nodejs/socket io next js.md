__page/api/socket/index.js__

```js
import { Server } from 'Socket.IO'

const SocketHandler = (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.emit("apa", "apa kabarnya")
        })

    }

    res.end()
}

export default SocketHandler
```

__SocketClient.js__
```js
import { useHookstate } from '@hookstate/core';
import io, { Socket } from 'Socket.IO-client'
import xstate from './xstate';

class SocketClient {
    static socket;

    static handler() {
        fetch('/api/socket').finally(() => {
            const socket = io()

            socket.on('connect', () => {
                console.log('connect')
                // socket.emit('hello')
            })

            // socket.on("apa", data => {
            //     xstate.nama.set(x => x = data)
            //     console.log(data)
            // })

            socket.on('update_dashboard', data => {
                console.log("update dashboard")
            })

            socket.on('disconnect', () => {
                console.log('disconnect')
            })
        })
    }
}

export default SocketClient;
```

__index.js__
```js
// import { AdminLayout } from '@layout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import AdminHome from '../layout/AdminHome/admin_home'
import AdminLayout from '../layout/AdminLayout/AdminLayout'
import SocketClient from '../socket_client'
const prisma = new (require('@prisma/client').PrismaClient)()

function Home({ dashboardHome }) {
    
    useEffect(SocketClient.handler, [])

    return (
        <AdminLayout>
            <AdminHome data={dashboardHome} />
        </AdminLayout>
    )
}

export async function getServerSideProps() {
    let dashboardHome = await prisma.dashboardScore.findMany({
        orderBy: {
            idx: "asc"
        }
    })

    return {
        props: {
            data: "malik",
            dashboardHome
        }
    }
}

export default Home;
```
