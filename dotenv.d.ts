declare module 'dotenv' {
    interface DotenvConfigOptions {
      path?: string;
      encoding?: string;
      debug?: boolean;
    }
  
    interface DotenvParseOptions {
      debug?: boolean;
    }
  
    interface DotenvParseOutput {
      [name: string]: string;
    }
  
    function config(options?: DotenvConfigOptions): { error?: Error; parsed?: DotenvParseOutput };
    function parse(src: string | Buffer, options?: DotenvParseOptions): DotenvParseOutput;
  
    export { config, parse };
  }
  