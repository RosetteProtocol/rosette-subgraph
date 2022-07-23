import { store } from "@graphprotocol/graph-ts";

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
