import chai, { expect } from "chai";
import chaiBN from "chai-bn";
import BN from "bn.js";
chai.use(chaiBN(BN));

import { Address, Cell, Slice } from "ton";
import { SmartContract } from "ton-contract-executor";
import * as main from "../contracts/nft-swap";
import { internalMessage, randomAddress } from "./helpers";

import { hex } from "../build/nft-swap.compiled.json";

describe("Counter tests", () => {
  let contract: SmartContract;

  const marketplaceAddress: Address = randomAddress("marketplace");
  const nftAddress1: Address = randomAddress("nft1");
  const ownerAddress1: Address = randomAddress("owner1"); 
  const nftAddress2: Address = randomAddress("nft2");
  const ownerAddress2: Address = randomAddress("owner2");

  beforeEach(async () => {
    contract = await SmartContract.fromCell(
      Cell.fromBoc(hex)[0], // code cell from build output
      main.data({
        marketplaceAddress: marketplaceAddress,
        nftAddress1: nftAddress1,
        ownerAddress1: ownerAddress1, 
        nftAddress2: nftAddress2,
        ownerAddress2: ownerAddress2,
         flags: 0
      }),
      {debug: true}
    );
    console.log("ok")
  });

  it("should get the meaning of life", async () => {
    const call = await contract.invokeGetMethod("meaning_of_life", []);
    console.log(call.result[0])
    expect(call.result[0]).to.be.bignumber.equal(new BN(42));
  });

  it("should get nft address", async () => {
    const call = await contract.invokeGetMethod("get_nft1", []);
    const call1 = await contract.invokeGetMethod("get_flags", []);
    // expect(call.result[0]).to.be.bignumber.equal(new BN(17));
    console.log(nftAddress1)
    // console.log(call.result[0].readAddress())
    const address = call.result[0].readAddress()
    const flag = call1.result[0]
    console.log({flag})

    //  expect(address).to.be.equal(nftAddress1)
    expect(address.equals(nftAddress1)).to.equal(true);
 
    // const send = await contract.sendInternalMessage( 
    //   internalMessage({
    //     from: randomAddress("notowner"),
    //     body: main.increment(),
    //   })
    // );
    // expect(send.type).to.equal("success");

    // const call2 = await contract.invokeGetMethod("counter", []);
    // expect(call2.result[0]).to.be.bignumber.equal(new BN(18));
  });

  it("should transfer nft", async () => {
    // const call = await contract.invokeGetMethod("meaning_of_life", []);
    // console.log(call.result[0])
    // expect(call.result[0]).to.be.bignumber.equal(new BN(42));

    const send = await contract.sendInternalMessage( 
      internalMessage({
        from: nftAddress1,
        body: main.ownership_assigned(),
        bounce: false,
      })
    );
    console.log(send.logs)
    console.log(send.actionList[2])
    const call1 = await contract.invokeGetMethod("get_flags", []);
    const flag = call1.result[0]
    console.log({flag})
  });
});
