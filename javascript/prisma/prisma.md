### Prisma


### Install

```bash
yarn add @prisma/client
```

### init

```bash
npx prisma init
```

akan terbentuk file .env

```bash
DATABASE_URL="mysql://user:password@localhost:3306/nama_database"
```

setting seperti diatas sesuai dengan databasenya


nanti akan ada folder namanya prisma didalamnya ada file schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

seting seperti diatas


```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int       @id @default(autoincrement())
  userName  String?
  email     String?   @unique
  password  String?
  createdAt DateTime? @default(now())
  updatedAt DateTime? @updatedAt
}


tambahkan model untuk membuat tabel

model SummaryMap {
  id            Int      @id @default(autoincrement())
  tgl           DateTime
  kader         String?
  province      String?
  district      String?
  total         Int?
  mention       Int?
  negative      Int?
  positive      Int?
  neutral       Int?
  comment       Int?
  share         Int?
  data_sampling Int?
  reach         Int?
}
```

lalu ketikkan perintah

```bash
npx prisma db push
```

untuk sync model ke database

lalu ketikkan perintah

```bash
npx prisma generate
```

untuk generate interface


untuk pemamnggilan 

```ts
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()
```

selanjutnya baca di https://www.prisma.io/
