```
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

;(async () => {
    //await prisma.$queryRaw `SET IDENTITY_INSERT TigaPutri.dbo.inbox ON`
    const d = await prisma.$executeRaw`SET IDENTITY_INSERT TigaPutri.dbo.inbox ON; insert into 
    dbo.inbox(kode,tgl_entri,penerima, pengirim, tipe_pengirim, pesan, method) 
    values(165034, ${new Date().toISOString()},'wa 6289697338821', '6289697338821', 'Q', 's' , 'Q') ; SET IDENTITY_INSERT TigaPutri.dbo.inbox OFF`
    // const data = await prisma.inbox.create({
    //     data:{
    //         kode: 138,
    //         tgl_entri: new Date().toISOString(),
    //         penerima: 'Tele-1',
    //         pengirim: '275922552',
    //         tipe_pengirim: 'B',
    //         pesan: 's',
    //         method: 'TBOT',
    //         status2: 42
    //       }
    // });
    //await prisma.$queryRaw `SET IDENTITY_INSERT SET IDENTITY_INSERT TigaPutri.dbo.inbox OFF`

    // const data2 = await prisma.inbox.findMany();

    console.log(d);
})();
```

