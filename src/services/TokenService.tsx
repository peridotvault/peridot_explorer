import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { tokenIdlFactory } from "@/blockchains/icp/Token";
import { ICRC3BlockResponse, RawBlock } from "@/interfaces/Token";

export async function getTokenBlock({
  coinAddress,
  start,
}: {
  coinAddress: Principal;
  start: number;
}): Promise<RawBlock | null> {
  try {
    const agent = new HttpAgent({ host: "https://ic0.app" });

    const ledgerActor = Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: coinAddress,
    });

    const result = (await ledgerActor.icrc3_get_blocks([
      { start, length: 1 },
    ])) as ICRC3BlockResponse;

    if (result.blocks.length > 0) {
      return result.blocks[0];
    }

    if (result.archived_blocks.length > 0) {
      const archive = result.archived_blocks[0];
      const archiveCanisterId = Principal.fromText(
        archive.callback[0].toString()
      );
      const archiveActor = Actor.createActor(tokenIdlFactory, {
        agent,
        canisterId: archiveCanisterId,
      });

      const archiveResult = (await archiveActor.icrc3_get_blocks([
        { start, length: 1 },
      ])) as ICRC3BlockResponse;

      console.log("archive : ", archiveResult);

      if (archiveResult.blocks.length > 0) {
        return archiveResult.blocks[0];
      }
    }

    return null;
  } catch (error) {
    console.error("❌ getTokenBlock error:", error);
    return null;
  }
}
