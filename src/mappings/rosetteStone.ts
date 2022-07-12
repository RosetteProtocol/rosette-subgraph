import { ipfs, json, store } from "@graphprotocol/graph-ts";

import {
  EntryUpserted,
  EntryRemoved,
} from "../types/RosetteStone/RosetteStone";

import { loadOrCreateFunction } from "./helpers";

export function handleEntryUpserted(event: EntryUpserted): void {
  let fn = loadOrCreateFunction(
    event.address,
    event.params.scope,
    event.params.sig,
    event.block.timestamp
  );

  const contentId = event.params.cid.toString();
  const data = ipfs.cat(contentId);

  if (data !== null) {
    const fnData = json.fromBytes(data).toObject();
    const abi = fnData.get("abi");
    const notice = fnData.get("notice");
    fn.abi = abi ? abi.toString() : null;
    fn.notice = notice ? notice.toString() : null;
  }

  fn.cid = contentId;
  fn.submitter = event.params.submitter;

  fn.save();
}

export function handleEntryRemoved(event: EntryRemoved): void {
  let fn = loadOrCreateFunction(
    event.address,
    event.params.scope,
    event.params.sig,
    event.block.timestamp
  );

  store.remove("Function", fn.id);
}
