<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

pada nextjs 13 dan seterusnaya ada penambahan kemampuan untuk server action
salah satu keguanaannya adalah bisa melakukan pemamnggilan data tanpa api

LoadListData.ts
```
import prisma from "@/lib/db/prisma";

export async function LoadListPrompt({ children }: { children: (list: any[]) => React.ReactNode }) {
    const listPromp = await prisma.promptEnginer.findMany()
    return <>{children(listPromp)}</>;
}
```

Page.tsx
```tsx
<LoadListPrompt>
    {(list) => <SideNav listData={list} />}
</LoadListPrompt>
```
