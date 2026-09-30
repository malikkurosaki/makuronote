<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
