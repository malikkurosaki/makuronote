'use client'
import { useMemo, useState } from 'react'
import _ from 'lodash'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { Card, Group, Stack, Title } from '@mantine/core';

export default function Page() {
    const [initial, setInitial] = useState([
        {
            id: 'todo',
            title: 'Todo',
            children: [
                {
                    id: '1',
                    content: '1.1'
                },
                {
                    id: '2',
                    content: '1.2'
                }
            ]
        },
        {
            id: 'progress',
            title: 'Progress',
            children: [
                {
                    id: '3',
                    content: '2.1'
                },
                {
                    id: '4',
                    content: '2.2'
                }
            ]
        }
    ]);

    const onDragEnd = (result: any) => {
        const { destination, source } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const newState = [...initial];
        const sourceListIndex = initial.findIndex((list) => list.id === source.droppableId);
        const destinationListIndex = initial.findIndex((list) => list.id === destination.droppableId);

        const [removed] = newState[sourceListIndex].children.splice(source.index, 1);
        newState[destinationListIndex].children.splice(destination.index, 0, removed);

        setInitial(newState);
    }


    const Board = ({ list, droppableId }: { list: any[], droppableId: string }) => {
        return (
            <Stack>
                <Droppable droppableId={droppableId} direction="vertical">
                    {(provided) => (
                        <Stack ref={provided.innerRef} {...provided.droppableProps} gap={10} p="md">
                            {list.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card bg="grape" w={200} p="md">
                                                {item.content}
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Stack>
                    )}
                </Droppable>
            </Stack>
        );
    }

    return (
        <Group>
            <DragDropContext onDragEnd={onDragEnd}>
                {initial.map((list) => (
                    <Stack key={list.id} p="md" bg={"cyan"} w={300} h={500} style={{
                        overflowY: "auto"
                    }}>
                        <Title>{list.title}</Title>
                        <Board key={list.id} list={list.children} droppableId={list.id} />
                    </Stack>
                ))}
            </DragDropContext>
        </Group>
    );
}
