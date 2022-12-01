import BN from "bn.js";
import { Cell, beginCell, Address } from "ton";

// encode contract storage according to save_data() contract method
export function data(params: { marketplaceAddress: Address; nftAddress1: Address; ownerAddress1: Address; nftAddress2: Address; ownerAddress2: Address; flags: number }): Cell {
  return beginCell()
    .storeAddress(params.marketplaceAddress)
    // .storeAddress(params.nftAddress1)
    .storeUint(0x00000000, 2)
    .storeRef(beginCell().storeAddress(params.nftAddress1).storeAddress(params.ownerAddress1).endCell())
    .storeRef(beginCell().storeAddress(params.nftAddress2).storeAddress(params.ownerAddress2).endCell())
    .endCell();
}

// message encoders for all ops (see contracts/imports/constants.fc for consts)

export function ownership_assigned(): Cell {
  return beginCell().storeUint(0x05138d91, 32).storeUint(0, 64).endCell();
}

export function cancel(): Cell {
  return beginCell().storeUint(3, 32).storeUint(0, 64).endCell();
}

// export function withdraw(params: { withdrawAmount: BN }): Cell {
//   return beginCell().storeUint(0x41836980, 32).storeUint(0, 64).storeCoins(params.withdrawAmount).endCell();
// }

// export function transferOwnership(params: { newOwnerAddress: Address }): Cell {
//   return beginCell().storeUint(0x2da38aaf, 32).storeUint(0, 64).storeAddress(params.newOwnerAddress).endCell();
// }
