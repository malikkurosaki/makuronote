```js
import { Box, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useShallowEffect } from "@mantine/hooks"
import { useRef, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

let orang = {
    nama: {
        depan: "malik",
        belakang: "kurosaki"
    }
}

let pilihan = "depan"

orang.nama[pilihan as keyof {}] = "makuro"


const Contoh3 = () => {
    const refok = useRef(false)
    const [ok, setok] = useState(false)

    const listData = {
        satu: [
            {
                id: "11",
                name: "1",
                value: "1",
            },
            {
                id: "12",
                name: "2",
                value: "2",
            },
            {
                id: "13",
                name: "3",
                value: "3",
            }
        ],
        dua: [
            {
                id: "21",
                name: "1",
                value: "1",
            },
            {
                id: "22",
                name: "2",
                value: "2",
            },
            {
                id: "23",
                name: "3",
                value: "3",
            }
        ]
    }

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
        {ok && (<DragDropContext onDragEnd={({ source, destination }) => {

        }}>
            {Object.keys(formData.values).map(e => <Box key={e} p={"xs"}>
                <Droppable droppableId={e}>
                    {(prov1) => (<Box {...prov1.droppableProps} ref={prov1.innerRef} >
                        {[...formData.values[e as keyof {}] as any[]].map((v, k) => <Draggable key={v.id} index={k} draggableId={v.id}>
                            {(prov2) => <Box {...prov2.draggableProps} {...prov2.dragHandleProps} ref={prov2.innerRef}>
                                <Box p={"xs"} bg={"blue"}>
                                    <Text c={"white"}>{v.name}</Text>
                                </Box>
                            </Box>}
                        </Draggable>)}
                        {prov1.placeholder}
                    </Box>)}
                </Droppable>
            </Box>)}
        </DragDropContext>)}
    </>)
}

export default Contoh3
```
