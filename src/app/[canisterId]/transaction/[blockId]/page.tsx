// TransactionPage.tsx
import { getTokenBlock } from "@/services/TokenService";
import { Principal } from "@dfinity/principal";
import { RawBlock, ICRC3Value } from "@/interfaces/Token";

interface Props {
  params: {
    canisterId: string;
    blockId: string;
  };
}

function extractValue(value: ICRC3Value): any {
  if (value.Int !== undefined) return value.Int.toString();
  if (value.Nat !== undefined) return value.Nat.toString();
  if (value.Text !== undefined) return value.Text;
  if (value.Blob !== undefined) return new TextDecoder().decode(value.Blob);
  if (value.Map !== undefined) return value.Map;
  if (value.Array !== undefined) return value.Array.map(extractValue);
  return null;
}

function formatAmount(nat: bigint, decimals = 8): string {
  const raw = nat.toString().padStart(decimals + 1, "0");
  const intPart = raw.slice(0, -decimals);
  const fracPart = raw.slice(-decimals).replace(/0+$/, "");
  return `${intPart}${fracPart ? "." + fracPart : ""}`;
}

function getField(map: ICRC3Value, key: string): ICRC3Value | undefined {
  return map.Map?.find(([k]) => k === key)?.[1];
}

function decodeBlob(blob: Uint8Array): string {
  try {
    return Principal.fromUint8Array(blob).toText();
  } catch {
    return new TextDecoder().decode(blob);
  }
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="w-full grid grid-cols-4 gap-2 p-4 border-b border-white/10">
      <div className="font-medium flex items-center gap-1 text-white/50">
        {label} <span title="More info">ⓘ</span>
      </div>
      <div className="col-span-3">{value}</div>
    </div>
  );
}

function BlockViewer({ block }: { block: RawBlock }) {
  const value = block.block;
  const tx = getField(value, "tx")?.Map;
  const ts = getField(value, "ts")?.Nat;

  const op = tx ? extractValue(getField({ Map: tx }, "op")!) : null;
  const amount = tx ? getField({ Map: tx }, "amt")?.Nat : null;
  const toBlob = tx ? getField({ Map: tx }, "to")?.Array?.[0]?.Blob : undefined;
  const to = toBlob ? decodeBlob(toBlob) : "-";

  return (
    <div className="rounded-lg shadow mt-6 w-full">
      <InfoRow label="Type" value={op || "-"} />
      <InfoRow label="Status" value="-" />
      <InfoRow label="Index" value={block.id.toString()} />
      <InfoRow
        label="Timestamp"
        value={ts ? new Date(Number(ts) / 1_000_000).toUTCString() : "-"}
      />
      <InfoRow label="From" value="-" />
      <InfoRow label="To" value={to} />
      <InfoRow
        label="Amount"
        value={
          amount ? (
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-gray-400 inline-block" />
              {formatAmount(amount)}
            </div>
          ) : (
            "-"
          )
        }
      />
      <InfoRow label="Fee" value="-" />
      <InfoRow label="Memo" value="-" />
    </div>
  );
}

export default async function TransactionPage({ params }: Props) {
  const { canisterId, blockId } = params;
  let blockData: RawBlock | null = null;

  try {
    blockData = await getTokenBlock({
      coinAddress: Principal.fromText(canisterId),
      start: parseInt(blockId),
    });
  } catch (error) {
    console.error("Failed to fetch block data", error);
  }

  return (
    <div className="p-8 w-full flex justify-center">
      <div className="max-w-[1200px] w-full flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
        <p className="text-sm text-gray-500">Canister ID: {canisterId}</p>
        <p className="text-sm text-gray-500 mb-4">Block ID: {blockId}</p>

        {blockData ? (
          <BlockViewer block={blockData} />
        ) : (
          <p className="text-red-500 mt-4">No block data found.</p>
        )}
      </div>
    </div>
  );
}
