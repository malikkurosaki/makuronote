interface ParsedArgs {
    [key: string]: string | boolean | string[] | undefined;
    _: string[];
  }
  
  function parseArgs(argv: string[]): ParsedArgs {
    const args: ParsedArgs = { _: [] }; // Inisialisasi dengan "_" sebagai array kosong
    const rest: string[] = []; // Untuk menyimpan argumen yang tidak terkait opsi
  
    // Mulai dari indeks 2 untuk skip "node" dan nama file script
    const input = argv.slice(2);
  
    for (let i = 0; i < input.length; i++) {
      const arg = input[i];
  
      // Cek apakah argumen adalah opsi (dimulai dengan -- atau -)
      if (arg.startsWith('--')) {
        const key = arg.slice(2); // Hapus "--" dari awal
        let value: string | boolean = true; // Default value adalah true
  
        // Cek apakah ada value setelahnya (jika bukan tanda "--" atau akhir array)
        if (
          i + 1 < input.length &&
          !input[i + 1].startsWith('--') &&
          !input[i + 1].startsWith('-')
        ) {
          value = input[i + 1];
          i++; // Skip ke argumen berikutnya
        }
  
        args[key] = value;
      } else if (arg.startsWith('-')) {
        const key = arg.slice(1); // Hapus "-" dari awal
        let value: string | boolean = true;
  
        if (
          i + 1 < input.length &&
          !input[i + 1].startsWith('--') &&
          !input[i + 1].startsWith('-')
        ) {
          value = input[i + 1];
          i++;
        }
  
        args[key] = value;
      } else {
        // Jika bukan opsi, masukkan ke array rest
        rest.push(arg);
      }
    }
  
    // Tambahkan argumen non-opsi ke properti "_"
    if (rest.length > 0) {
      args['_'] = rest;
    }
  
    return args;
  }
  
  // Contoh penggunaan
  const args = parseArgs(process.argv);
  console.log(args);
