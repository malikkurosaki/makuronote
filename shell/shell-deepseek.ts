/* eslint-disable @typescript-eslint/no-explicit-any */
import { spawn } from 'child_process';

// Custom Error Class untuk menangani kesalahan shell
class ShellError extends Error {
  exitCode: number;
  stdout: Buffer;
  stderr: Buffer;

  constructor(message: string, exitCode: number, stdout: Buffer, stderr: Buffer) {
    super(message);
    this.exitCode = exitCode;
    this.stdout = stdout;
    this.stderr = stderr;

    // Memastikan prototype chain tetap valid
    Object.setPrototypeOf(this, ShellError.prototype);
  }
}

// Kelas utama untuk mengelola perintah shell
class ShellCommand {
  static globalThrow = true; // Konfigurasi global untuk throwOnNonZeroExit

  constructor(commandParts: readonly string[], expressions: any[]) {
    this.command = this.buildCommand(commandParts, expressions);
    this.options = {
      quiet: false,
      throwOnNonZeroExit: ShellCommand.globalThrow,
      env: undefined,
      cwd: undefined,
    };
  }

  command: string;
  options: {
    quiet: boolean;
    throwOnNonZeroExit: boolean;
    env: NodeJS.ProcessEnv | undefined;
    cwd: string | undefined;
  };

  // Membangun perintah shell dengan escaping yang aman
  buildCommand(parts: readonly string[], exprs: any[]): string {
    return parts.reduce((acc, part, i) => {
      const expr = i < exprs.length ? exprs[i] : '';
      return acc + part + (expr !== '' ? this.escapeShellArgument(String(expr)) : '');
    }, '');
  }

  // Fungsi internal untuk escaping argumen shell
  escapeShellArgument(arg: string): string {
    if (/[^A-Za-z0-9_/:=-]/.test(arg)) {
      return `'${arg.replace(/'/g, "'\\''")}'`;
    }
    return arg;
  }

  // Menonaktifkan output ke stdout/stderr
  quiet() {
    this.options.quiet = true;
    return this;
  }

  // Menonaktifkan pelemparan kesalahan pada exit code non-zero
  nothrow() {
    this.options.throwOnNonZeroExit = false;
    return this;
  }

  // Mengatur variabel lingkungan
  env(vars: NodeJS.ProcessEnv) {
    this.options.env = { ...process.env, ...vars };
    return this;
  }

  // Mengatur direktori kerja
  cwd(path: string) {
    this.options.cwd = path;
    return this;
  }

  // Menjalankan perintah shell
  async execute(): Promise<{ stdout: Buffer; stderr: Buffer; exitCode: number }> {
    return new Promise((resolve, reject) => {
      const child = spawn(this.command, {
        shell: true,
        env: this.options.env,
        cwd: this.options.cwd,
      });

      let stdout = Buffer.alloc(0);
      let stderr = Buffer.alloc(0);

      child.stdout.on('data', (data) => {
        stdout = Buffer.concat([stdout, data]);
        if (!this.options.quiet) process.stdout.write(data);
      });

      child.stderr.on('data', (data) => {
        stderr = Buffer.concat([stderr, data]);
        if (!this.options.quiet) process.stderr.write(data);
      });

      child.on('close', (code) => {
        const result = { stdout, stderr, exitCode: code || 0 };
        if (code !== 0 && this.options.throwOnNonZeroExit) {
          reject(new ShellError(`Command failed with code ${code}`, code || 0, stdout, stderr));
        } else {
          resolve(result);
        }
      });
    });
  }

  // Mendapatkan output sebagai string
  async text(): Promise<string> {
    this.options.quiet = true;
    const { stdout } = await this.execute();
    return stdout.toString();
  }

  // Mendapatkan output sebagai JSON
  async json(): Promise<any> {
    const text = await this.text();
    return JSON.parse(text);
  }

  // Mendapatkan output baris-per-baris
  async *lines(): AsyncGenerator<string> {
    const text = await this.text();
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      if (line !== '') yield line;
    }
  }

  // Mendapatkan output sebagai Blob
  async blob(): Promise<Blob> {
    const { stdout } = await this.execute();
    return new Blob([stdout]);
  }
}

// Fungsi utilitas untuk membuat instance ShellCommand
export function $(strings: TemplateStringsArray, ...exprs: any[]): ShellCommand {
  const cmd = new ShellCommand(strings.raw, exprs);
  return cmd;
}

// Konfigurasi global untuk mengatur perilaku default
$.throws = (shouldThrow = true) => {
  ShellCommand.globalThrow = shouldThrow;
};
