/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { exec } from 'child_process';

/**
 * Interface for shell command execution result
 */
interface ShellResult {
  stdout: Buffer;
  stderr: Buffer;
  exitCode: number;
}

/**
 * Interface for shell error
 */
interface ShellError extends Error {
  stdout: Buffer;
  stderr: Buffer;
  exitCode: number;
  command: string;
}

/**
 * Type for values that can be used in shell commands
 */
type ShellValue = string | number | boolean | null | undefined | Buffer | Blob | Response | ArrayBuffer;

/**
 * A simple implementation inspired by Bun Shell to run shell commands with TypeScript
 */
class ShellCommand {
  private command: string;
  private _shouldThrow: boolean = true;
  private _quietMode: boolean = false;
  private _envVars: NodeJS.ProcessEnv = process.env;
  private _workingDir: string = process.cwd();

  constructor(strings: TemplateStringsArray, values: ShellValue[]) {
    this.command = this._buildCommand(strings, values);
  }

  private _buildCommand(strings: TemplateStringsArray, values: ShellValue[]): string {
    // Escape values to prevent shell injection
    const escapedValues = values.map(value => {
      if (value === null || value === undefined) {
        return '';
      }
      
      // Handle special objects
      if (value instanceof Buffer || value instanceof ArrayBuffer) {
        return `"${this._bufferToString(value).replace(/(["\s'$`\\])/g, '\\$1')}"`;
      }
      
      if (value instanceof Blob || value instanceof Response) {
        // In a real implementation, these would be handled properly
        // This is just a placeholder for demonstration
        return `"[Object data]"`;
      }
      
      return String(value).replace(/(["\s'$`\\])/g, '\\$1');
    });

    let result = '';
    for (let i = 0; i < strings.length; i++) {
      result += strings[i];
      if (i < escapedValues.length) {
        result += escapedValues[i];
      }
    }
    return result;
  }

  private _bufferToString(buffer: Buffer | ArrayBuffer): string {
    if (buffer instanceof Buffer) {
      return buffer.toString();
    }
    return new TextDecoder().decode(buffer);
  }

  /**
   * Prevent throwing on non-zero exit codes
   */
  nothrow(): ShellCommand {
    this._shouldThrow = false;
    return this;
  }

  /**
   * Set whether to throw on non-zero exit codes
   */
  throws(shouldThrow: boolean = true): ShellCommand {
    this._shouldThrow = shouldThrow;
    return this;
  }

  /**
   * Prevent printing to stdout
   */
  quiet(): ShellCommand {
    this._quietMode = true;
    return this;
  }

  /**
   * Set environment variables for this command
   */
  env(variables?: NodeJS.ProcessEnv): ShellCommand {
    this._envVars = variables || process.env;
    return this;
  }

  /**
   * Set working directory for this command
   */
  cwd(directory: string): ShellCommand {
    this._workingDir = directory;
    return this;
  }

  /**
   * Execute the command and return result as text
   */
  async text(): Promise<string> {
    this.quiet();
    const { stdout } = await this._execute();
    return stdout.toString();
  }

  /**
   * Execute the command and parse result as JSON
   */
  async json<T = any>(): Promise<T> {
    const text = await this.text();
    return JSON.parse(text) as T;
  }

  /**
   * Execute the command and return result as a Blob
   */
  async blob(): Promise<Blob> {
    this.quiet();
    const { stdout } = await this._execute();
    return new Blob([stdout], { type: 'text/plain' });
  }

  /**
   * Execute the command and iterate through lines
   */
  async *lines(): AsyncGenerator<string, void, unknown> {
    const text = await this.text();
    const lines = text.split('\n');
    
    // Remove last empty line if exists
    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }
    
    for (const line of lines) {
      yield line;
    }
  }

  /**
   * Execute the shell command
   */
  private async _execute(): Promise<ShellResult> {
    return new Promise<ShellResult>((resolve, reject) => {
      const options = {
        env: this._envVars,
        cwd: this._workingDir
      };
      
      exec(this.command, options, (error, stdout, stderr) => {
        const result: ShellResult = {
          stdout: Buffer.from(stdout),
          stderr: Buffer.from(stderr),
          exitCode: error ? error.code || 1 : 0
        };
        
        if (!this._quietMode) {
          process.stdout.write(stdout);
          process.stderr.write(stderr);
        }
        
        if (error && this._shouldThrow) {
          const shellError = new Error(`Command failed with exit code ${result.exitCode}`) as ShellError;
          shellError.stdout = result.stdout;
          shellError.stderr = result.stderr;
          shellError.exitCode = result.exitCode;
          shellError.command = this.command;
          reject(shellError);
          return;
        }
        
        resolve(result);
      });
    });
  }
  
  /**
   * Default behavior when awaited directly
   */
  then<TResult1 = ShellResult, TResult2 = never>(
    onfulfilled?: ((value: ShellResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this._execute().then(onfulfilled, onrejected);
  }
}

/**
 * Shell function interface with global configuration methods
 */
interface ShellFunction {
  (strings: TemplateStringsArray, ...values: ShellValue[]): ShellCommand;
  env(variables?: NodeJS.ProcessEnv): ShellFunction;
  cwd(directory: string): ShellFunction;
  nothrow(): ShellFunction;
  throws(shouldThrow?: boolean): ShellFunction;
}

/**
 * Main shell function that returns a ShellCommand instance
 */
const $ = function(strings: TemplateStringsArray, ...values: ShellValue[]): ShellCommand {
  return new ShellCommand(strings, values);
} as ShellFunction;

// Default configuration
let defaultShouldThrow = true;
let defaultEnvVars = process.env;
let defaultWorkingDir = process.cwd();

// Add global configuration methods
$.env = function(variables?: NodeJS.ProcessEnv): ShellFunction {
  defaultEnvVars = variables || process.env;
  return $;
};

$.cwd = function(directory: string): ShellFunction {
  defaultWorkingDir = directory;
  return $;
};

$.nothrow = function(): ShellFunction {
  defaultShouldThrow = false;
  return $;
};

$.throws = function(shouldThrow: boolean = true): ShellFunction {
  defaultShouldThrow = shouldThrow;
  return $;
};

// Use 'export type' for interfaces and types when isolatedModules is enabled
export { $ };
export { ShellCommand };
export type { ShellResult, ShellError };
