// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tokenIdlFactory = ({ IDL }: { IDL: any }) => {
  // Account type
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });

  // ICRC3Value recursive type
  const ICRC3Value = IDL.Rec();
  ICRC3Value.fill(
    IDL.Variant({
      Int: IDL.Int,
      Map: IDL.Vec(IDL.Tuple(IDL.Text, ICRC3Value)),
      Nat: IDL.Nat,
      Blob: IDL.Vec(IDL.Nat8),
      Text: IDL.Text,
      Array: IDL.Vec(ICRC3Value),
    })
  );

  // Value type for get_blocks
  const Value = IDL.Rec();
  Value.fill(
    IDL.Variant({
      Int: IDL.Int,
      Map: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
      Nat: IDL.Nat,
      Nat64: IDL.Nat64,
      Blob: IDL.Vec(IDL.Nat8),
      Text: IDL.Text,
      Array: IDL.Vec(Value),
    })
  );

  // Block with ID
  const BlockWithId = IDL.Record({
    id: IDL.Nat,
    block: ICRC3Value,
  });

  // GetBlocksRequest
  const GetBlocksRequest = IDL.Record({
    start: IDL.Nat,
    length: IDL.Nat,
  });

  // Archived blocks for ICRC3
  const ArchivedBlocks = IDL.Rec();
  ArchivedBlocks.fill(
    IDL.Record({
      args: IDL.Vec(GetBlocksRequest),
      callback: IDL.Func(
        [IDL.Vec(GetBlocksRequest)],
        [
          IDL.Record({
            log_length: IDL.Nat,
            blocks: IDL.Vec(BlockWithId),
            archived_blocks: IDL.Vec(ArchivedBlocks),
          }),
        ],
        ["query"]
      ),
    })
  );

  // ICRC3 GetBlocksResult
  const GetBlocksResult = IDL.Record({
    log_length: IDL.Nat,
    blocks: IDL.Vec(BlockWithId),
    archived_blocks: IDL.Vec(ArchivedBlocks),
  });

  // Archived range for get_blocks
  const ArchivedRange = IDL.Record({
    callback: IDL.Func(
      [GetBlocksRequest],
      [
        IDL.Record({
          blocks: IDL.Vec(Value),
        }),
      ],
      ["query"]
    ),
    start: IDL.Nat,
    length: IDL.Nat,
  });

  // GetBlocksResponse for get_blocks
  const GetBlocksResponse = IDL.Record({
    certificate: IDL.Opt(IDL.Vec(IDL.Nat8)),
    first_index: IDL.Nat,
    blocks: IDL.Vec(Value),
    chain_length: IDL.Nat64,
    archived_blocks: IDL.Vec(ArchivedRange),
  });

  // Transaction types
  const Burn = IDL.Record({
    from: Account,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
    spender: IDL.Opt(Account),
  });

  const Mint = IDL.Record({
    to: Account,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
  });

  const Transfer = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    from: Account,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
    spender: IDL.Opt(Account),
  });

  const Approve = IDL.Record({
    fee: IDL.Opt(IDL.Nat),
    from: Account,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
    expected_allowance: IDL.Opt(IDL.Nat),
    expires_at: IDL.Opt(IDL.Nat64),
    spender: Account,
  });

  const Transaction = IDL.Record({
    burn: IDL.Opt(Burn),
    kind: IDL.Text,
    mint: IDL.Opt(Mint),
    approve: IDL.Opt(Approve),
    timestamp: IDL.Nat64,
    transfer: IDL.Opt(Transfer),
  });

  const TransactionRange = IDL.Record({
    transactions: IDL.Vec(Transaction),
  });

  const ArchivedRange_1 = IDL.Record({
    callback: IDL.Func([GetBlocksRequest], [TransactionRange], ["query"]),
    start: IDL.Nat,
    length: IDL.Nat,
  });

  const GetTransactionsResponse = IDL.Record({
    first_index: IDL.Nat,
    log_length: IDL.Nat,
    transactions: IDL.Vec(Transaction),
    archived_transactions: IDL.Vec(ArchivedRange_1),
  });

  // Archive info
  const ArchiveInfo = IDL.Record({
    block_range_end: IDL.Nat,
    canister_id: IDL.Principal,
    block_range_start: IDL.Nat,
  });

  const ICRC3ArchiveInfo = IDL.Record({
    end: IDL.Nat,
    canister_id: IDL.Principal,
    start: IDL.Nat,
  });

  const GetArchivesArgs = IDL.Record({
    from: IDL.Opt(IDL.Principal),
  });

  // Metadata
  const MetadataValue = IDL.Variant({
    Int: IDL.Int,
    Nat: IDL.Nat,
    Blob: IDL.Vec(IDL.Nat8),
    Text: IDL.Text,
  });

  const StandardRecord = IDL.Record({
    url: IDL.Text,
    name: IDL.Text,
  });

  return IDL.Service({
    // ICRC-3 methods
    icrc3_get_blocks: IDL.Func(
      [IDL.Vec(GetBlocksRequest)],
      [GetBlocksResult],
      ["query"]
    ),
    icrc3_get_archives: IDL.Func(
      [GetArchivesArgs],
      [IDL.Vec(ICRC3ArchiveInfo)],
      ["query"]
    ),

    // Legacy get_blocks method
    get_blocks: IDL.Func([GetBlocksRequest], [GetBlocksResponse], ["query"]),
    get_transactions: IDL.Func(
      [GetBlocksRequest],
      [GetTransactionsResponse],
      ["query"]
    ),

    // ICRC-1 methods
    icrc1_name: IDL.Func([], [IDL.Text], ["query"]),
    icrc1_symbol: IDL.Func([], [IDL.Text], ["query"]),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ["query"]),
    icrc1_fee: IDL.Func([], [IDL.Nat], ["query"]),
    icrc1_metadata: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))],
      ["query"]
    ),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], ["query"]),
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ["query"]),
    icrc1_supported_standards: IDL.Func(
      [],
      [IDL.Vec(StandardRecord)],
      ["query"]
    ),

    // Archive methods
    archives: IDL.Func([], [IDL.Vec(ArchiveInfo)], ["query"]),

    // Utility methods
    is_ledger_ready: IDL.Func([], [IDL.Bool], ["query"]),
  });
};
