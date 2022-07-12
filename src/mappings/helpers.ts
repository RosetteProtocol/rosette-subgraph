import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { RosetteStone, Function, Contract } from "../types/schema";

export function joinID(pieces: Array<string>): string {
  return pieces.join("-");
}

export function loadOrCreateRosette(address: Address): RosetteStone {
  let stone = RosetteStone.load(address.toHexString());

  if (stone == null) {
    stone = new RosetteStone(address.toHexString());
    stone.address = address;
    stone.save();
  }

  return stone as RosetteStone;
}

export function loadOrCreateContract(
  rosetteAddress: Address,
  scope: Bytes
): Contract {
  let id = scope.toHexString();
  let contract = Contract.load(id);

  if (contract == null) {
    contract = new Contract(id);

    let stone = loadOrCreateRosette(rosetteAddress);

    contract.rosetteStone = stone.id;
    contract.scope = scope;
    contract.save();
  }

  return contract as Contract;
}

export function loadOrCreateFunction(
  rosetteAddress: Address,
  scope: Bytes,
  sig: Bytes,
  timestamp: BigInt
): Function {
  let id = joinID([scope.toHexString(), sig.toHexString()]);

  let fn = Function.load(id);

  if (fn == null) {
    fn = new Function(id);

    let contract = loadOrCreateContract(rosetteAddress, scope);

    fn.contract = contract.id;
    fn.upsertAt = timestamp.toI32();
    fn.sigHash = sig;
    fn.cid = "";
    fn.submitter = Bytes.empty();

    fn.save();
  }

  return fn as Function;
}
