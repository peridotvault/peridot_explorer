export interface ICRC3BlockResponse {
  log_length: bigint;
  blocks: RawBlock[];
  archived_blocks: ArchivedBlocks[];
}

export interface RawBlock {
  id: bigint;
  block: ICRC3Value;
}

export interface ICRC3Value {
  Int?: bigint;
  Map?: Array<[string, ICRC3Value]>;
  Nat?: bigint;
  Blob?: Uint8Array;
  Text?: string;
  Array?: ICRC3Value[];
}

interface ArchivedBlocks {
  args: { start: bigint; length: bigint }[];
  callback: [string, string];
}

export interface GetBlocksResponse {
  certificate?: Uint8Array;
  first_index: bigint;
  blocks: Value[];
  chain_length: bigint;
  archived_blocks: ArchivedRange[];
}

export interface Value {
  Int?: bigint;
  Map?: Array<[string, Value]>;
  Nat?: bigint;
  Nat64?: bigint;
  Blob?: Uint8Array;
  Text?: string;
  Array?: Value[];
}

interface ArchivedRange {
  callback: (request: {
    start: bigint;
    length: bigint;
  }) => Promise<{ blocks: Value[] }>;
  start: bigint;
  length: bigint;
}
