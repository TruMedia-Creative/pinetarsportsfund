declare module "sql.js" {
  type SqlValue = string | number | null | Uint8Array;

  interface QueryExecResult {
    columns: string[];
    values: SqlValue[][];
  }

  interface Statement {
    bind(params?: (string | number | null | Uint8Array)[]): boolean;
    step(): boolean;
    getAsObject(): Record<string, SqlValue>;
    run(params?: (string | number | null | Uint8Array)[]): void;
    free(): boolean;
  }

  interface Database {
    export(): Uint8Array;
    run(
      sql: string,
      params?: (string | number | null | Uint8Array)[],
    ): Database;
    exec(sql: string): QueryExecResult[];
    prepare(sql: string): Statement;
    close(): void;
  }

  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | null) => Database;
  }

  interface InitSqlJsOptions {
    locateFile?: (filename: string) => string;
  }

  function initSqlJs(config?: InitSqlJsOptions): Promise<SqlJsStatic>;

  export default initSqlJs;
  export type {
    SqlJsStatic,
    Database,
    SqlValue,
    QueryExecResult,
    Statement,
    InitSqlJsOptions,
  };
}
