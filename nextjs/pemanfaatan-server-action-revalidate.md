artikel ini berguna ketika ingin mengupdate halaman tetika ditinggalkan dan kembali lagi lalu memperbarui data secara otomatis

package yang diperlukan adalah mantine

buatlah server action yang berguna sebagai pemanggilan revalidate path


revalidateTools.ts
```ts
"use server";

import { revalidatePath } from "next/cache";

export async function revalidateTools() {
  console.log("revalidate tools");
  revalidatePath("/tools", "layout");
}

```

Page.tsx
```ts
'use client'

... Page() {
 const visibility = useDocumentVisibility()

 useShallowEffect(() => {
        revalidateTools()
    }, [visibility])
...

```

visibiliti akan menditeksi apakah halaman berubah event dari visible atau hide
dengan memanfaatkan kemampuan useShhallowEffect maka setiap kali ada perubahan 
akan mentriger validate path

