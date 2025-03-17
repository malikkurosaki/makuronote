/* eslint-disable @typescript-eslint/no-explicit-any */

interface ShellOutput {
  stdout: Buffer;
  stderr: Buffer;
  exitCode: number;
  text: (encoding?: BufferEncoding) => string;
  json: () => any;
  arrayBuffer: () => ArrayBufferLike;
  blob: () => Blob;
  bytes: () => Uint8Array;
}

// Definisi class ShellError
class ShellError extends Error implements ShellOutput {
  readonly stdout: Buffer;
  readonly stderr: Buffer;
  readonly exitCode: number;

  constructor(
    message: string,
    stdout: Buffer,
    stderr: Buffer,
    exitCode: number
  ) {
    super(message);
    this.stdout = stdout;
    this.stderr = stderr;
    this.exitCode = exitCode;
  }

  text(encoding: BufferEncoding = "utf8"): string {
    return this.stdout.toString(encoding);
  }

  json(): any {
    return JSON.parse(this.stdout.toString("utf8"));
  }

  arrayBuffer(): ArrayBufferLike {
    return this.stdout.buffer.slice(
      this.stdout.byteOffset,
      this.stdout.byteOffset + this.stdout.byteLength
    );
  }

  blob(): Blob {
    return new Blob([this.stdout]);
  }

  bytes(): Uint8Array {
    return new Uint8Array(this.stdout);
  }
}

// Definisi class ShellPromise
class ShellPromise extends Promise<ShellOutput> {
  private _cwd: string = process.cwd();
  private _env: NodeJS.ProcessEnv = { ...process.env };
  private _quiet: boolean = false;
  private _throwOnError: boolean = true;
  private _stdin: WritableStream | undefined;

  get stdin(): WritableStream {
    if (!this._stdin) {
      this._stdin = new WritableStream();
    }
    return this._stdin;
  }

  cwd(newCwd: string): this {
    this._cwd = newCwd;
    return this;
  }

  env(newEnv: NodeJS.ProcessEnv): this {
    this._env = newEnv ? { ...newEnv } : ({} as NodeJS.ProcessEnv);
    return this;
  }

  quiet(): this {
    this._quiet = true;
    return this;
  }

  async *lines(): AsyncIterable<string> {
    this.quiet();
    const output = await this;
    const text = output.text();
    for (const line of text.split("\n")) {
      if (line) yield line;
    }
  }

  text(encoding: BufferEncoding = "utf8"): Promise<string> {
    this.quiet();
    return this.then((output) => output.text(encoding));
  }

  json(): Promise<any> {
    this.quiet();
    return this.then((output) => output.json());
  }

  arrayBuffer(): Promise<ArrayBufferLike> {
    this.quiet();
    return this.then((output) => output.arrayBuffer());
  }

  blob(): Promise<Blob> {
    this.quiet();
    return this.then((output) => output.blob());
  }

  nothrow(): this {
    this._throwOnError = false;
    return this;
  }

  throws(shouldThrow: boolean): this {
    this._throwOnError = shouldThrow;
    return this;
  }
}

// Definisi interface untuk Shell
interface Shell {
  $: (strings: TemplateStringsArray, ...expressions: any[]) => ShellPromise;
  braces: (pattern: string) => string[];
  escape: (input: string) => string;
  env: (newEnv?: NodeJS.ProcessEnv) => Shell;
  cwd: (newCwd?: string) => Shell;
  nothrow: () => Shell;
  throws: (shouldThrow: boolean) => Shell;
  readonly ShellError: typeof ShellError;
  readonly ShellPromise: typeof ShellPromise;
}

// Implementasi Shell
class ShellImpl implements Shell {
  private _defaultCwd: string = process.cwd();
  private _defaultEnv: NodeJS.ProcessEnv = { ...process.env };
  private _defaultThrowOnError: boolean = true;

  readonly ShellError = ShellError;
  readonly ShellPromise = ShellPromise;

  $(strings: TemplateStringsArray, ...expressions: any[]): ShellPromise {
    const command = this.buildCommand(strings, expressions);

    return new ShellPromise(async (resolve, reject) => {
      try {
        const { stdout, stderr, exitCode } = await this.executeCommand(command);

        const output: ShellOutput = {
          stdout,
          stderr,
          exitCode,
          text: (encoding = "utf8") => stdout.toString(encoding),
          json: () => JSON.parse(stdout.toString("utf8")),
          arrayBuffer: () =>
            stdout.buffer.slice(
              stdout.byteOffset,
              stdout.byteOffset + stdout.byteLength
            ),
          bytes: () => new Uint8Array(stdout),
          blob: () => new Blob([stdout]),
        };

        if (exitCode !== 0 && this._defaultThrowOnError) {
          throw new ShellError(
            `Command failed with exit code ${exitCode}`,
            stdout,
            stderr,
            exitCode
          );
        }

        resolve(output);
      } catch (error) {
        reject(error);
      }
    })
      .env(this._defaultEnv)
      .cwd(this._defaultCwd);
  }

  private buildCommand(
    strings: TemplateStringsArray,
    expressions: any[]
  ): string {
    return strings.reduce((acc, str, i) => {
      const expr = expressions[i] !== undefined ? String(expressions[i]) : "";
      return acc + str + expr;
    }, "");
  }

  private async executeCommand(command: string): Promise<{
    stdout: Buffer;
    stderr: Buffer;
    exitCode: number;
  }> {
    const { exec } = await import("child_process");
    return new Promise((resolve) => {
      exec(
        command,
        {
          cwd: this._defaultCwd,
          env: this._defaultEnv,
        },
        (error, stdout, stderr) => {
          if (error) {
            resolve({
              stdout: Buffer.from(stdout),
              stderr: Buffer.from(stderr),
              exitCode: error.code || 1,
            });
          } else {
            resolve({
              stdout: Buffer.from(stdout),
              stderr: Buffer.from(stderr),
              exitCode: 0,
            });
          }
        }
      );
    });
  }

  braces(pattern: string): string[] {
    return [pattern]; // Implementasi sederhana
  }

  escape(input: string): string {
    return input.replace(/([\\$`"])/g, "\\$1");
  }

  env(newEnv?: NodeJS.ProcessEnv): this {
    this._defaultEnv = newEnv ? { ...newEnv } : { ...process.env };
    return this;
  }

  cwd(newCwd?: string): this {
    this._defaultCwd = newCwd || process.cwd();
    return this;
  }

  nothrow(): this {
    this._defaultThrowOnError = false;
    return this;
  }

  throws(shouldThrow: boolean): this {
    this._defaultThrowOnError = shouldThrow;
    return this;
  }
}

const $ = new ShellImpl();
export { $ };
