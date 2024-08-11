```ts
function data<T extends readonly string[]>({ listName }: { listName: T }) {
    type Name = T[number];
  
    function getData({ name }: { name: Name }) {
      console.log(name);
    }
  
    return { getData };
  }
  
  const home = data({ listName: ["satu", "dua", "tiga"] as const });
  
  home.getData({ name: "dua" }); // Ini berhasil
  // home.getData({ name: "empat" }); // Ini akan menghasilkan error

```
