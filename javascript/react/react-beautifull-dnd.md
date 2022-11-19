
### task.tsx
```js
import { Box, Card, Flex, Group, NavLink, Paper, ScrollArea, Title } from "@mantine/core";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable, DroppableProvidedProps, DropResult } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

const itemsFromBackend = [
  { id: "1", content: "First task" },
  { id: "2", content: "Second task" },
  { id: "3", content: "Third task" },
  { id: "4", content: "Fourth task" },
  { id: "5", content: "Fifth task" }
];

const columnsFromBackend = {
  ["1"]: {
    name: "Requested",
    items: itemsFromBackend
  },
  ["2"]: {
    name: "To do",
    items: []
  },
  ["3"]: {
    name: "In Progress",
    items: []
  },
  ["4"]: {
    name: "Review",
    items: []
  },
  ["5"]: {
    name: "Done",
    items: []
  }
};

const onDragEnd = (result: any, columns: any, setColumns: any) => {
  if (!result.destination) return;
  const { source, destination } = result;

  console.log(JSON.stringify(columns, null, 2))

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};



export default function MyTask() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return <>
    <Flex h={100 + "vh"}>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column], index) => {
          return <Box h={100 + "%"} key={columnId} p={"xs"}>
            <Title order={4}>{column.name}</Title>
            <Droppable droppableId={columnId} key={columnId} >
              {(provided, snapshot) => <Paper
                withBorder
                // bg={"gray.1"}
                p={"xs"}
                h={100 + "%"}
                w={300}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {column.items.map((item, index) =>
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  >
                    {
                      (provided, snapshot) =>
                        <Box
                          mb={"xs"}
                          bg={"gray.0"}
                          p={"xs"}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.content}
                        </Box>}
                  </Draggable>
                )}
                {provided.placeholder}
              </Paper>}
            </Droppable>
          </Box>
        })}
      </DragDropContext>
    </Flex>
  </>
}




// function App() {
//   const [columns, setColumns] = useState(columnsFromBackend);
//   return (
//     <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
//       <DragDropContext
//         onDragEnd={result => onDragEnd(result, columns, setColumns)}
//       >
//         {Object.entries(columns).map(([columnId, column], index) => {
//           return (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center"
//               }}
//               key={columnId}
//             >
//               <h2>{column.name}</h2>
//               <div style={{ margin: 8 }}>
//                 <Droppable droppableId={columnId} key={columnId}>
//                   {(provided, snapshot) => {
//                     return (
//                       <div
//                         {...provided.droppableProps}
//                         ref={provided.innerRef}
//                         style={{
//                           background: snapshot.isDraggingOver
//                             ? "lightblue"
//                             : "lightgrey",
//                           padding: 4,
//                           width: 250,
//                           minHeight: 500
//                         }}
//                       >
//                         {column.items.map((item, index) => {
//                           return (
//                             <Draggable
//                               key={item.id}
//                               draggableId={item.id}
//                               index={index}
//                             >
//                               {(provided, snapshot) => {
//                                 return (
//                                   <div
//                                     ref={provided.innerRef}
//                                     {...provided.draggableProps}
//                                     {...provided.dragHandleProps}
//                                     style={{
//                                       userSelect: "none",
//                                       padding: 16,
//                                       margin: "0 0 8px 0",
//                                       minHeight: "50px",
//                                       backgroundColor: snapshot.isDragging
//                                         ? "#263B4A"
//                                         : "#456C86",
//                                       color: "white",
//                                       ...provided.draggableProps.style
//                                     }}
//                                   >
//                                     {item.content}
//                                   </div>
//                                 );
//                               }}
//                             </Draggable>
//                           );
//                         })}
//                         {provided.placeholder}
//                       </div>
//                     );
//                   }}
//                 </Droppable>
//               </div>
//             </div>
//           );
//         })}
//       </DragDropContext>
//     </div>
//   );
// }

// export default App;
```

### document.tsx
```js
import { createGetInitialProps } from '@mantine/next';
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd'

// const getInitialProps = createGetInitialProps();
type Prop = {}

export default class _Document extends Document<Prop>{
  // static getInitialProps = getInitialProps;

  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    resetServerContext();
    return { ...initialProps }

  }
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

```

### next.config.js
```json
/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```
