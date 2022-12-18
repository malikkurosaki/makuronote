```js
import { Box, Card, Group, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useShallowEffect } from "@mantine/hooks"
import { useRef, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import _ from "lodash"
import { v4 } from "uuid"

interface Sembarang {
    [key: string]: any
}

const listSumber = [
    {
        id: "11",
        name: "11",
        value: "11",
    }
]

const listData = {
    satu: [
        {
            id: v4(),
            name: "11",
            value: "11",
        },

    ],
    dua: [
        {
            id: v4(),
            name: "21",
            value: "21",
        },
        {
            id: v4(),
            name: "22",
            value: "22",
        },

    ],
    tiga: [
        {
            id: v4(),
            name: "31",
            value: "31",
        },
        {
            id: v4(),
            name: "32",
            value: "32",
        },
        {
            id: v4(),
            name: "33",
            value: "33",
        }
    ]
}


const Contoh3 = () => {
    const refok = useRef(false)
    const [ok, setok] = useState(false)

    const formData = useForm<Sembarang>();
    const [diangkat, setDiangkat] = useState(false)

    useShallowEffect(() => {
        if (!refok.current) {

        } else {
            setok(true)
        }
    }, [])

    useShallowEffect(() => {
        formData.setValues(listData as any)
    }, [])

    return (<>
        <div ref={refok as any}></div>
        {ok && (<DragDropContext
            onDragStart={(a, b) => {
                setDiangkat(true)
            }}
            onDragEnd={({ source, destination }) => {
                setDiangkat(false)

                if(destination && destination.droppableId == "sumber" ){
                    return
                }


                if (destination?.droppableId) {
                    const dataHasil = { ...listData }
                    const arrSource: any[] = dataHasil[source.droppableId as keyof {}]
                    const arrDes: any[] = dataHasil[destination!.droppableId as keyof {}]

                    if (source.droppableId === "sumber" ) {
                        const sumberData = {
                            id: v4(),
                            name: v4(),
                            value: "ini dimana",
                        }

                        if (!arrDes.map(e => e.id).includes(source.droppableId)) {
                            arrDes.splice(destination.index, 0, sumberData)
                        }

                        return
                    }


                    if (source.droppableId === destination.droppableId) {

                        const [ell] = arrSource.splice(source.index, 1)
                        arrDes.splice(destination.index, 0, ell)
                    } else {

                        const [ell] = arrSource.splice(source.index, 1)
                        arrDes.splice(source.index, 0, ell)

                        console.log(dataHasil)
                    }
                }

            }}>
            <Box w={200} h={200} p={"xs"} bg={"violet"}>
                <Droppable droppableId={"sumber"} >
                    {(prov0) => <Box key={"sumber1"} {...prov0.droppableProps} ref={prov0.innerRef}>
                        <Draggable index={0} draggableId={"20a"}>
                            {(prov00) => <Box {...prov00.draggableProps} {...prov00.dragHandleProps} ref={prov00.innerRef}>
                                <Card bg={"gray.0"} p={"xs"} shadow={diangkat ? "md" : ""}>
                                    <Text>ini dimana</Text>
                                </Card>
                            </Box>}
                        </Draggable>
                        {prov0.placeholder}
                    </Box>
                    }
                </Droppable>
            </Box>
            <Group>
                {Object.keys(listData).map(e => <Box
                    key={e}
                    p={"xs"}
                    h={500}
                    bg={"cyan"}
                    w={200}>
                    <Droppable droppableId={e} >
                        {(prov1) => (<Box {...prov1.droppableProps} ref={prov1.innerRef} >

                            {[...listData[e as keyof {}] as any[]].map((v, k) => <Draggable
                                key={v.id}
                                index={k}
                                draggableId={v.id}>
                                {(prov2) => <Box {...prov2.draggableProps} {...prov2.dragHandleProps} ref={prov2.innerRef}>
                                    <Box
                                        p={"xs"}
                                        bg={"gray"}
                                        m={"xs"}>
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
