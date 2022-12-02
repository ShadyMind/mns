// cSpell:words positionals

declare module 'util' {
    type AnyArgs = Record<string, boolean | string>;

    export type ParseArgs<T> =  {
        [key in keyof T]: {
            type: T[K] extends boolean ? 'boolean' : 'string'
            short?: string;
            multiple?: boolean;
            description?: string;
        };
    };

    type ParseOptions<T extends AnyArgs> = {
        args: string[];
        options: ParseArgs<T>;
        strict?: boolean;
        allowPositionals?: string;
    };

    type ParseResult<T> = {
        positionals: string[];
        values: T;
    };

    export function parseArgs<T extends Record<string, boolean | string>>(options: ParseOptions<T>): ParseResult<T>; 
}