/* eslint-disable @typescript-eslint/no-explicit-any */
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

interface ShellOptions {
  env: NodeJS.ProcessEnv;
  cwd: string;
  throwOnError: boolean;
}

interface ShellResult {
  stdout: Buffer;
  stderr: Buffer;
  exitCode: number;
}

class ShellError extends Error {
  constructor(message: string, public exitCode: number, public stdout: Buffer, public stderr: Buffer) {
    super(message);
    this.name = 'ShellError';
  }
}

// Interface untuk tipe kembalian $
interface ShellPromise extends Promise<ShellResult> {
  quiet(): ShellPromise;
  nothrow(): ShellPromise;
  env(newEnv?: Record<string, string>): ShellPromise;
  cwd(newCwd: string): ShellPromise;
  text(): Promise<string>;
  json<T = any>(): Promise<T>;
  lines(): Promise<string[]>;
  buffer(): Promise<Buffer>;
  exec(): Promise<ShellResult>;
}

/**
 * ShellCommand class untuk menangani eksekusi command
 */
class ShellCommand {
  private options: ShellOptions;
  private isQuiet: boolean = false;
  private resultPromise: Promise<ShellResult>;

  constructor(defaultOptions: ShellOptions, strings: TemplateStringsArray, values: any[]) {
    this.options = { ...defaultOptions };
    this.resultPromise = this.execute(strings, values);
  }

  private buildCommand(strings: TemplateStringsArray, values: any[]): string {
    let command = '';
    for (let i = 0; i < strings.length; i++) {
      command += strings[i];
      if (i < values.length) {
        command += this.escapeValue(values[i]);
      }
    }
    return command;
  }

  private escapeValue(value: any): string {
    if (typeof value === 'string') {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return String(value);
  }

  private execute(strings: TemplateStringsArray, values: any[]): Promise<ShellResult> {
    const command = this.buildCommand(strings, values);
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');
      const proc: ChildProcessWithoutNullStreams = spawn(cmd, args, {
        env: this.options.env,
        cwd: this.options.cwd,
        shell: true
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data: Buffer) => {
        stdout += data;
        if (!this.isQuiet) process.stdout.write(data);
      });

      proc.stderr.on('data', (data: Buffer) => {
        stderr += data;
        if (!this.isQuiet) process.stderr.write(data);
      });

      proc.on('close', (exitCode: number | null) => {
        const result: ShellResult = {
          stdout: Buffer.from(stdout),
          stderr: Buffer.from(stderr),
          exitCode: exitCode ?? 1
        };

        if (exitCode !== 0 && this.options.throwOnError) {
          reject(new ShellError(
            `Command failed with exit code ${exitCode}`,
            exitCode ?? 1,
            result.stdout,
            result.stderr
          ));
        } else {
          resolve(result);
        }
      });
    });
  }

  // Method untuk membuat ShellPromise dengan modifikasi
  private createShellPromise(): ShellPromise {
    const promise = this.resultPromise as ShellPromise;
    
    promise.quiet = () => {
      this.isQuiet = true;
      return this.createShellPromise();
    };

    promise.nothrow = () => {
      this.options.throwOnError = false;
      return this.createShellPromise();
    };

    promise.env = (newEnv?: Record<string, string>) => {
      this.options.env = { ...this.options.env, ...newEnv };
      return this.createShellPromise();
    };

    promise.cwd = (newCwd: string) => {
      this.options.cwd = newCwd;
      return this.createShellPromise();
    };

    promise.text = () => {
      this.isQuiet = true;
      return this.resultPromise.then(result => result.stdout.toString());
    };

    promise.json = <T = any>() => {
      this.isQuiet = true;
      return this.resultPromise.then(result => JSON.parse(result.stdout.toString()) as T);
    };

    promise.lines = () => {
      this.isQuiet = true;
      return this.resultPromise.then(result => 
        result.stdout.toString().split('\n').filter(line => line.length > 0)
      );
    };

    promise.buffer = () => {
      this.isQuiet = true;
      return this.resultPromise.then(result => result.stdout);
    };

    promise.exec = () => this.resultPromise;

    return promise;
  }

  // Method publik untuk mendapatkan ShellPromise
  getShellPromise(): ShellPromise {
    return this.createShellPromise();
  }
}

// Konfigurasi default global
const defaultOptions: ShellOptions = {
  env: process.env,
  cwd: process.cwd(),
  throwOnError: true
};

// Fungsi $ sebagai tagged template
export const $ = Object.assign(
  (strings: TemplateStringsArray, ...values: any[]): ShellPromise => {
    const command = new ShellCommand(defaultOptions, strings, values);
    return command.getShellPromise();
  },
  {
    env(newEnv?: Record<string, string>): void {
      if (newEnv === undefined) {
        defaultOptions.env = process.env;
      } else {
        defaultOptions.env = { ...process.env, ...newEnv };
      }
    },
    cwd(newCwd?: string): void {
      defaultOptions.cwd = newCwd || process.cwd();
    },
    throws(value: boolean): void {
      defaultOptions.throwOnError = value;
    },
    nothrow(): void {
      defaultOptions.throwOnError = false;
    }
  }
);
