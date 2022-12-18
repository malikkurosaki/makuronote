```js
import { Box, Group, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useShallowEffect } from "@mantine/hooks"
import { useRef, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import _ from "lodash"

interface Sembarang {
    [key: string]: any
}

const listData = {
    satu: [
        {
            id: "11",
            name: "11",
            value: "11",
        },

    ],
    dua: [
        {
            id: "21",
            name: "21",
            value: "21",
        },
        {
            id: "22",
            name: "22",
            value: "22",
        },

    ],
    tiga: [
        {
            id: "31",
            name: "31",
            value: "31",
        },
        {
            id: "32",
            name: "32",
            value: "32",
        },
        {
            id: "33",
            name: "33",
            value: "33",
        }
    ]
}


const Contoh3 = () => {
    const refok = useRef(false)
    const [ok, setok] = useState(false)
    const [showTarget, setShowTarget] = useState(false)


    const formData = useForm({
        initialValues: listData
    })

    useShallowEffect(() => {
        if (!refok.current) {

        } else {
            setok(true)
        }
    }, [])

    return (<>
        <div ref={refok as any}></div>
        {ok && (<DragDropContext
            onDragEnd={({ source, destination }) => {
                if (destination?.droppableId) {
                    const dataSource = formData.values[source.droppableId as keyof {}][source.index]
                    const dataDestination = formData.values[destination!.droppableId as keyof {}][destination!.index]

                    const dataHasil = { ...formData.values }

                    const arrSource: any[] = dataHasil[source.droppableId as keyof {}]
                    const arrDes: any[] = dataHasil[destination!.droppableId as keyof {}]

                    const ell = arrSource.splice(source.index, 1)[0]
                    arrDes.splice(source.index, 0, ell)

                    console.log(dataHasil)
                }

            }}>
            <Group>
                {Object.keys(formData.values).map(e => <Box key={e} p={"xs"} bg={_.sample(["green", "red", "cyan"])} w={200}>
                    <Droppable droppableId={e} >
                        {(prov1) => (<Box {...prov1.droppableProps} ref={prov1.innerRef} >
                            {[...formData.values[e as keyof {}] as any[]].map((v, k) => <Draggable key={v.id} index={k} draggableId={v.id}>
                                {(prov2) => <Box {...prov2.draggableProps} {...prov2.dragHandleProps} ref={prov2.innerRef}>
                                    <Box p={"xs"} bg={"blue"} m={"xs"}>
                                        <Text c={"white"}>{v.name}</Text>
                                    </Box>
                                </Box>}
                            </Draggable>)}
                            {prov1.placeholder}
                        </Box>)}
                    </Droppable>
                </Box>)}
            </Group>
        </DragDropContext>)}
    </>)
}

export default Contoh3
```
