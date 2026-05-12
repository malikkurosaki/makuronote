Pecah jadi file terpisah dan referensikan via @path/to/file.md di CLAUDE.md. Claude Code akan auto-load file yang di-reference. Contoh:

   ## Architecture
   See @docs/ARCHITECTURE.md
   
   ## Agent Specs
   See @docs/AGENTIC_OVERVIEW.md
Ini bikin CLAUDE.md tetap ramping tapi info tetap accessible saat dibutuhkan.

Pindahkan konten reference-heavy (spec lengkap, contoh kode panjang, ADR history) ke file terpisah di docs/ atau .claude/.
Sisakan di CLAUDE.md hanya yang wajib di-load setiap turn: konvensi coding, perintah build/test, aturan komunikasi, struktur folder high-level, dan pointer ke file detail lainnya.
Cek duplikasi — sering ada info yang sama muncul di beberapa section.
