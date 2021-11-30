```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "windows"]
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
