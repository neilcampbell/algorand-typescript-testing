import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'
import { ApplicationClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { Account, arc4, bytes, Bytes, internal, op, TransactionType, uint64, Uint64 } from '@algorandfoundation/algorand-typescript'
import { DynamicBytes } from '@algorandfoundation/algorand-typescript/arc4'
import { afterEach, describe, expect, it, test } from 'vitest'
import { TestExecutionContext } from '../src'
import { MIN_TXN_FEE, ZERO_ADDRESS } from '../src/constants'
import { testInvariant } from '../src/errors'
import { Block, gloadBytes, gloadUint64 } from '../src/impl'
import { AccountCls } from '../src/impl/account'
import { InnerTxn } from '../src/impl/itxn'
import { ApplicationTransaction } from '../src/impl/transactions'
import { DeliberateAny } from '../src/typescript-helpers'
import { asBigInt, asNumber, asUint64Cls } from '../src/util'
import { AppExpectingEffects } from './artifacts/created-app-asset/contract.algo'
import {
  ItxnDemoContract,
  ITxnOpsContract,
  StateAcctParamsGetContract,
  StateAppGlobalContract,
  StateAppGlobalExContract,
  StateAppLocalContract,
  StateAppLocalExContract,
  StateAppParamsContract,
  StateAssetHoldingContract,
  StateAssetParamsContract,
} from './artifacts/state-ops/contract.algo'
import acctParamsAppSpecJson from './artifacts/state-ops/data/StateAcctParamsGetContract.arc32.json'
import appGlobalAppSpecJson from './artifacts/state-ops/data/StateAppGlobalContract.arc32.json'
import appGlobalExAppSpecJson from './artifacts/state-ops/data/StateAppGlobalExContract.arc32.json'
import appLocalAppSpecJson from './artifacts/state-ops/data/StateAppLocalContract.arc32.json'
import appLocalExAppSpecJson from './artifacts/state-ops/data/StateAppLocalExContract.arc32.json'
import appParamsAppSpecJson from './artifacts/state-ops/data/StateAppParamsContract.arc32.json'
import assetHoldingAppSpecJson from './artifacts/state-ops/data/StateAssetHoldingContract.arc32.json'
import assetParamsAppSpecJson from './artifacts/state-ops/data/StateAssetParamsContract.arc32.json'
import {
  generateTestAccount,
  generateTestAsset,
  getAlgorandAppClient,
  getAlgorandAppClientWithApp,
  getAvmResult,
  getLocalNetDefaultAccount,
  INITIAL_BALANCE_MICRO_ALGOS,
} from './avm-invoker'
import { asUint8Array } from './util'

describe('State op codes', async () => {
  const ctx = new TestExecutionContext()

  afterEach(async () => {
    ctx.reset()
  })

  describe('AcctParams', async () => {
    const appClient = await getAlgorandAppClient(acctParamsAppSpecJson as AppSpec)
    const dummyAccount = await generateTestAccount()

    test.each([
      ['verify_acct_balance', INITIAL_BALANCE_MICRO_ALGOS + 100_000],
      ['verify_acct_min_balance', 100_000],
      ['verify_acct_auth_addr', ZERO_ADDRESS],
      ['verify_acct_total_num_uint', 0],
      ['verify_acct_total_num_byte_slice', 0],
      ['verify_acct_total_extra_app_pages', 0],
      ['verify_acct_total_apps_created', 0],
      ['verify_acct_total_apps_opted_in', 0],
      ['verify_acct_total_assets_created', 0],
      ['verify_acct_total_assets', 0],
      ['verify_acct_total_boxes', 0],
      ['verify_acct_total_box_bytes', 0],
    ])('%s should return %s', async (methodName, expectedValue) => {
      const mockAccount = ctx.any.account({
        address: dummyAccount,
        balance: Uint64(INITIAL_BALANCE_MICRO_ALGOS + 100000),
        minBalance: Uint64(100000),
        authAddress: Account(ZERO_ADDRESS),
        totalNumUint: Uint64(0),
        totalNumByteSlice: Uint64(0),
        totalExtraAppPages: Uint64(0),
        totalAppsCreated: Uint64(0),
        totalAppsOptedIn: Uint64(0),
        totalAssetsCreated: Uint64(0),
        totalAssets: Uint64(0),
        totalBoxes: Uint64(0),
        totalBoxBytes: Uint64(0),
      })

      const avmResult = await getAvmResult(
        { appClient, sendParams: { fee: AlgoAmount.Algos(1000) } },
        methodName,
        asUint8Array(dummyAccount.bytes),
      )
      testInvariant(avmResult !== undefined, 'There must be an AVM result')
      const mockContract = ctx.contract.create(StateAcctParamsGetContract)
      const mockResult = mockContract[methodName as keyof StateAcctParamsGetContract](mockAccount)

      expect(mockResult).toEqual(avmResult)
      expect(mockResult).toEqual(expectedValue)
    })
  })

  describe('AppParams', async () => {
    const [appClient, app] = await getAlgorandAppClientWithApp(appParamsAppSpecJson as AppSpec)
    const dummyAccount = await getLocalNetDefaultAccount()
    test.each([
      ['verify_app_params_get_approval_program', undefined],
      ['verify_app_params_get_clear_state_program', undefined],
      ['verify_app_params_get_global_num_uint', 0],
      ['verify_app_params_get_global_num_byte_slice', 0],
      ['verify_app_params_get_local_num_uint', 0],
      ['verify_app_params_get_local_num_byte_slice', 0],
      ['verify_app_params_get_extra_program_pages', 0],
      ['verify_app_params_get_creator', 'app.creator'],
      ['verify_app_params_get_address', 'app.address'],
    ])('%s should return %s', async (methodName, expectedValue) => {
      const application = ctx.any.application({
        applicationId: app.appId,
        approvalProgram: Bytes(app.compiledApproval.compiledBase64ToBytes),
        clearStateProgram: Bytes(app.compiledClear.compiledBase64ToBytes),
        globalNumUint: Uint64(0),
        globalNumBytes: Uint64(0),
        localNumUint: Uint64(0),
        localNumBytes: Uint64(0),
        extraProgramPages: Uint64(0),
        creator: Account(Bytes.fromBase32(dummyAccount.addr)),
      })
      const avmResult = await getAvmResult({ appClient, sendParams: { fee: AlgoAmount.Algos(1000) } }, methodName, app.appId)

      const mockContract = ctx.contract.create(StateAppParamsContract)
      const mockResult = mockContract[methodName as keyof StateAppParamsContract](application)

      expect(mockResult).toEqual(avmResult)

      if (expectedValue === 'app.creator') {
        expect(mockResult).toEqual(application.creator)
      } else if (expectedValue === 'app.address') {
        expect(mockResult).toEqual(application.address)
      } else if (expectedValue !== undefined) {
        expect(mockResult).toEqual(expectedValue)
      }
    })
  })

  describe('AssetHolding', async () => {
    const appClient = await getAlgorandAppClient(assetHoldingAppSpecJson as AppSpec)
    const dummyAccount = await getLocalNetDefaultAccount()
    test.each([
      ['verify_asset_holding_get', 100],
      ['verify_asset_frozen_get', false],
    ])('should return the correct field value of the asset holding', async (methodName, expectedValue) => {
      const dummyAsset = await generateTestAsset({
        creator: dummyAccount,
        total: 100,
        decimals: 0,
        frozenByDefault: false,
      })
      const avmResult = await getAvmResult({ appClient }, methodName, dummyAccount.addr, asBigInt(dummyAsset))

      const mockAsset = ctx.any.asset()
      const mockAccount = ctx.any.account({
        optedAssetBalances: new Map([[mockAsset.id, 100]]),
      })
      const mockContract = ctx.contract.create(StateAssetHoldingContract)
      const mockResult = mockContract[methodName as keyof StateAssetHoldingContract](mockAccount, mockAsset)

      if (typeof mockResult === 'boolean') {
        expect(mockResult).toEqual(avmResult)
        expect(mockResult).toEqual(expectedValue)
      } else {
        expect(mockResult.valueOf()).toEqual(avmResult)
        expect(asNumber(mockResult as uint64)).toEqual(expectedValue)
      }
    })
  })

  describe('AssetParams', async () => {
    const appClient = await getAlgorandAppClient(assetParamsAppSpecJson as AppSpec)
    const dummyAccount = await getLocalNetDefaultAccount()

    test.each([
      ['verify_asset_params_get_total', 100n],
      ['verify_asset_params_get_decimals', 0n],
      ['verify_asset_params_get_default_frozen', false],
      ['verify_asset_params_get_unit_name', Bytes('UNIT')],
      ['verify_asset_params_get_name', Bytes('TEST')],
      ['verify_asset_params_get_url', Bytes('https://algorand.co')],
      ['verify_asset_params_get_metadata_hash', Bytes(`test${' '.repeat(28)}`)],
      ['verify_asset_params_get_manager', ZERO_ADDRESS],
      ['verify_asset_params_get_reserve', ZERO_ADDRESS],
      ['verify_asset_params_get_freeze', ZERO_ADDRESS],
      ['verify_asset_params_get_clawback', ZERO_ADDRESS],
      ['verify_asset_params_get_creator', 'creator'],
    ])('should return the correct field value of the asset', async (methodName, expectedValue) => {
      const creator = Account(Bytes.fromBase32(dummyAccount.addr))
      const metadataHash = Bytes(`test${' '.repeat(28)}`)
      const mockAsset = ctx.any.asset({
        total: Uint64(100),
        decimals: Uint64(0),
        name: Bytes('TEST'),
        unitName: Bytes('UNIT'),
        url: Bytes('https://algorand.co'),
        metadataHash: metadataHash,
        creator,
      })

      const dummyAsset = await generateTestAsset({
        creator: dummyAccount,
        total: 100,
        decimals: 0,
        frozenByDefault: false,
        name: 'TEST',
        unit: 'UNIT',
        url: 'https://algorand.co',
        metadataHash: metadataHash.toString(),
      })

      const avmResult = await getAvmResult({ appClient }, methodName, asBigInt(dummyAsset))

      const mockContract = ctx.contract.create(StateAssetParamsContract)
      const mockResult = mockContract[methodName as keyof StateAssetParamsContract](mockAsset)

      expect(mockResult).toEqual(avmResult)
      if (expectedValue === 'creator') {
        expect(mockResult).toEqual(creator)
      } else {
        expect(mockResult).toEqual(expectedValue)
      }
    })
  })

  describe('Global', async () => {
    it('should return the correct global field value', async () => {
      const creator = ctx.any.account()
      const app = ctx.any.application({ creator })
      const txn1 = ctx.any.txn.applicationCall({ appId: app })
      let firstGroupId = Bytes()
      let firstTimestamp = Uint64(0)
      let secondGroupId = Bytes()
      let secondTimestamp = Uint64(0)
      ctx.txn.createScope([txn1]).execute(() => {
        firstGroupId = op.Global.groupId
        firstTimestamp = op.Global.latestTimestamp
        expect(firstGroupId.length.valueOf()).toEqual(32n)
        expect(firstTimestamp.valueOf()).not.toEqual(0n)
        expect(op.Global.groupSize.valueOf()).toEqual(1n)
        expect(op.Global.round.valueOf()).toEqual(1n)
        expect(op.Global.callerApplicationId.valueOf()).toEqual(0n)
        expect(op.Global.creatorAddress).toEqual(creator)
        expect(op.Global.currentApplicationId).toEqual(app)
        expect(op.Global.currentApplicationAddress).toEqual(app.address)
      })
      const txn2 = ctx.any.txn.payment()
      const txn3 = ctx.any.txn.applicationCall()
      const caller = ctx.any.application()
      ctx.ledger.patchGlobalData({ callerApplicationId: caller.id })
      ctx.txn.createScope([txn2, txn3]).execute(() => {
        secondGroupId = op.Global.groupId
        secondTimestamp = op.Global.latestTimestamp
        expect(secondGroupId.length.valueOf()).toEqual(32n)
        expect(secondTimestamp.valueOf()).not.toEqual(0n)
        expect(op.Global.groupSize.valueOf()).toEqual(2n)
        expect(op.Global.round.valueOf()).toEqual(2n)
        expect(op.Global.callerApplicationId.valueOf()).toEqual(caller.id.valueOf())
        expect(op.Global.callerApplicationAddress).toEqual(caller.address)
      })
      expect([...asUint8Array(firstGroupId)]).not.toEqual([...asUint8Array(secondGroupId)])
      expect(firstTimestamp.valueOf()).not.toEqual(secondTimestamp.valueOf())
    })
  })

  describe('gaid', async () => {
    it('should return the correct ID of the asset or application created', async () => {
      const createdAsset = ctx.any.asset()
      const createdApp = ctx.any.application()
      const assetCreateTxn = ctx.any.txn.assetConfig({ createdAsset })
      const appCreateTxn = ctx.any.txn.applicationCall({ createdApp })

      const contract = ctx.contract.create(AppExpectingEffects)
      const [assetId, appId] = contract.create_group(assetCreateTxn, appCreateTxn)

      expect(assetId.valueOf()).toEqual(createdAsset.id.valueOf())
      expect(appId.valueOf()).toEqual(createdApp.id.valueOf())
    })

    it('should be able to pass app call txn as app arg', async () => {
      const appCallTxn = ctx.any.txn.applicationCall({
        appArgs: [Bytes('some_value()uint64')],
        appLogs: [Bytes('this is a log statement')],
      })
      const contract = ctx.contract.create(AppExpectingEffects)
      contract.log_group(appCallTxn)
    })

    // TODO: uncomment when arc4 stubs are implemented
    // it('should be able to pass app call txn as app arg', async () => {
    //   const appCallTxn = ctx.any.txn.applicationCall({
    //     appArgs: [arc4.arc4Signature("some_value()uint64")],
    //     logs: [arc4Prefix.concat(arc4.Uint64(2).bytes)]
    //   })
    //   const contract = ctx.contract.create(AppExpectingEffects)
    //   contract.log_group(appCallTxn)
    // })
  })

  describe('itxn', async () => {
    it('should return the correct field value of the transaction', async () => {
      // arrange
      const contract = ctx.contract.create(ITxnOpsContract)

      // act
      contract.verify_itxn_ops()

      // assert
      const itxnGroup = ctx.txn.lastGroup.getItxnGroup(0)
      const appItxn = itxnGroup.getApplicationInnerTxn(0)
      const paymentItxn = itxnGroup.getPaymentInnerTxn(1)

      // Test application call transaction fields
      expect([...asUint8Array(appItxn.approvalProgram)]).toEqual([...asUint8Array(Bytes.fromHex('068101068101'))])
      expect([...asUint8Array(appItxn.clearStateProgram)]).toEqual([...asUint8Array(Bytes.fromHex('068101'))])
      const approvalPages = Array(asNumber(appItxn.numApprovalProgramPages))
        .fill(0)
        .map((_, i) => [...asUint8Array(appItxn.approvalProgramPages(i))])
      expect(approvalPages).toEqual([[...asUint8Array(appItxn.approvalProgram)]])
      expect(appItxn.onCompletion).toEqual(arc4.OnCompleteAction[arc4.OnCompleteAction['DeleteApplication']])
      expect(asNumber(appItxn.fee)).toEqual(MIN_TXN_FEE)
      expect(appItxn.sender).toEqual(ctx.ledger.getApplicationForContract(contract).address)
      // NOTE: would implementing emulation for this behavior be useful
      // in unit testing context (vs integration tests)?
      // considering we don't emulate balance (transfer, accounting for fees and etc)
      expect(asNumber(appItxn.appId.id)).toEqual(0)
      expect(appItxn.type).toEqual(TransactionType.ApplicationCall)
      expect(appItxn.typeBytes).toEqual(asUint64Cls(TransactionType.ApplicationCall).toBytes())

      // Test payment transaction fields
      expect(paymentItxn.receiver).toEqual(ctx.defaultSender)
      expect(asNumber(paymentItxn.amount)).toEqual(1000)
      expect(paymentItxn.sender).toEqual(ctx.ledger.getApplicationForContract(contract).address)
      expect(paymentItxn.type).toEqual(TransactionType.Payment)
      expect(paymentItxn.typeBytes).toEqual(asUint64Cls(TransactionType.Payment).toBytes())

      // Test common fields for both transactions
      ;[appItxn, paymentItxn].forEach((t: InnerTxn) => {
        expect(t.sender instanceof AccountCls)
        expect((t.fee as unknown) instanceof internal.primitives.Uint64Cls)
        expect((t.firstValid as unknown) instanceof internal.primitives.Uint64Cls)
        expect((t.lastValid as unknown) instanceof internal.primitives.Uint64Cls)
        expect(t.note instanceof internal.primitives.BytesCls)
        expect(t.lease instanceof internal.primitives.BytesCls)
        expect(t.txnId instanceof internal.primitives.BytesCls)
      })

      // Test logs (should be empty for newly created transactions as its a void method)
      expect(asNumber((ctx.txn.lastActive as ApplicationTransaction).numLogs)).toEqual(0)
      expect((ctx.txn.lastActive as ApplicationTransaction).lastLog).toEqual(Bytes(''))

      // Test created_app (should be created for these transactions)
      expect(appItxn.createdApp).toBeTruthy()
    })

    it('should be able to invoke demo contract', async () => {
      const contract = ctx.contract.create(ItxnDemoContract)
      ctx.txn.createScope([ctx.any.txn.applicationCall({ appArgs: [Bytes('test1')] })]).execute(() => {
        contract.approvalProgram()
      })
      ctx.txn.createScope([ctx.any.txn.applicationCall({ appArgs: [Bytes('test2')] })]).execute(() => {
        contract.approvalProgram()
      })
    })
  })

  describe('Scratch', async () => {
    test.each([
      [0, Bytes('test_bytes')],
      [1, Uint64(42)],
      [2, Bytes('test_bytes')],
      [3, Uint64(42)],
      [255, Bytes('max_index')],
    ])('should return the correct field value of the scratch slot', async (index: number, value: bytes | uint64) => {
      ctx.txn.createScope([ctx.any.txn.applicationCall({ scratchSpace: { [index]: value } })]).execute(() => {})

      expect(ctx.txn.lastGroup.getScratchSlot(index)).toEqual(value)

      expect(() => ctx.txn.lastGroup.getScratchSlot(256)).toThrow('invalid scratch slot')
    })
  })

  describe('gloadBytes', async () => {
    it('should return the correct field value of the scratch slot', async () => {
      ctx.txn.createScope([ctx.any.txn.applicationCall({ scratchSpace: [Uint64(0), Bytes('hello'), Bytes('world')] })]).execute(() => {
        const slot1 = gloadBytes(0, 1)
        const slot2 = gloadBytes(0, 2)
        expect(slot1).toStrictEqual('hello')
        expect(slot2).toStrictEqual('world')
      })
    })
    it('should throw error if the scratch slot is not a bytes type', async () => {
      ctx.txn.createScope([ctx.any.txn.applicationCall({ scratchSpace: [Uint64(0), Bytes('hello'), Bytes('world')] })]).execute(() => {
        expect(() => gloadBytes(0, 0)).toThrow('invalid scratch slot type')
      })
    })
    it('should throw error if the scratch slot is out of range', async () => {
      ctx.txn.createScope([ctx.any.txn.applicationCall({ scratchSpace: [Uint64(0), Bytes('hello'), Bytes('world')] })]).execute(() => {
        expect(() => gloadBytes(0, 256)).toThrow('invalid scratch slot')
      })
    })
  })

  describe('gloadUint64', async () => {
    it('should return the correct field value of the scratch slot', async () => {
      ctx.txn.createScope([ctx.any.txn.applicationCall({ scratchSpace: [Uint64(7), Uint64(42), Bytes('world')] })]).execute(() => {
        const slot0 = gloadUint64(0, 0)
        const slot1 = gloadUint64(0, 1)
        expect(slot0).toStrictEqual(7n)
        expect(slot1).toStrictEqual(42n)
      })
    })
    it('should throw error if the scratch slot is not a uint64 type', async () => {
      ctx.txn.createScope([ctx.any.txn.applicationCall({ scratchSpace: [Uint64(7), Uint64(42), Bytes('world')] })]).execute(() => {
        expect(() => gloadUint64(0, 2)).toThrow('invalid scratch slot type')
      })
    })
    it('should throw error if the scratch slot is out of range', async () => {
      ctx.txn.createScope([ctx.any.txn.applicationCall({ scratchSpace: [Uint64(7), Uint64(42), Bytes('world')] })]).execute(() => {
        expect(() => gloadUint64(0, 256)).toThrow('invalid scratch slot')
      })
    })
  })

  describe('Block', async () => {
    it('should return the correct field value of the block', async () => {
      const index = 42
      const seed = 123
      const timestamp = 1234567890
      ctx.ledger.setBlock(index, seed, timestamp)
      const seedResult = op.btoi(Block.blkSeed(Uint64(index)))
      const timestampResult = Block.blkTimestamp(Uint64(index))

      expect(seedResult).toEqual(Uint64(seed))
      expect(timestampResult).toEqual(Uint64(timestamp))
    })
    it('should throw error if the block is not set', async () => {
      const index = 42
      expect(() => Block.blkSeed(Uint64(index))).toThrow('Block 42 not set')
      expect(() => Block.blkTimestamp(Uint64(index))).toThrow('Block 42 not set')
    })
  })

  describe('AppGlobal', async () => {
    const appClient = await getAlgorandAppClient(appGlobalAppSpecJson as AppSpec)
    const [_exAppClient, exApp] = await getAlgorandAppClientWithApp(appGlobalExAppSpecJson as AppSpec)
    it('should be able to put, get and delete app global state', async () => {
      const bytesKey = 'global_bytes'
      const uint64Key = 'global_uint64'
      const bytesValue = 'test_bytes'
      const uint64Value = 42

      // put
      await getAvmResult({ appClient }, 'verify_put_bytes', asUint8Array(bytesKey), asUint8Array(bytesValue))
      await getAvmResult({ appClient }, 'verify_put_uint64', asUint8Array(uint64Key), uint64Value)

      const contract = ctx.contract.create(StateAppGlobalContract)
      contract.verify_put_bytes(Bytes(bytesKey), Bytes(bytesValue))
      contract.verify_put_uint64(Bytes(uint64Key), Uint64(uint64Value))

      // get
      const bytesAvmResult = await getAvmResult({ appClient }, 'verify_get_bytes', asUint8Array(bytesKey))
      const uint64AvmResult = await getAvmResult({ appClient }, 'verify_get_uint64', asUint8Array(uint64Key))

      const bytesResult = contract.verify_get_bytes(Bytes(bytesKey))
      const uint64Result = contract.verify_get_uint64(Bytes(uint64Key))
      expect(bytesResult).toEqual(bytesAvmResult)
      expect(asBigInt(uint64Result)).toEqual(uint64AvmResult)

      // delete
      await getAvmResult({ appClient }, 'verify_delete', asUint8Array(bytesKey))
      await getAvmResult({ appClient }, 'verify_delete', asUint8Array(uint64Key))
      contract.verify_delete(Bytes(bytesKey))
      contract.verify_delete(Bytes(uint64Key))

      await expect(() => getAvmResult({ appClient }, 'verify_get_bytes', asUint8Array(bytesKey))).rejects.toThrow()
      expect(() => contract.verify_get_bytes(Bytes(bytesKey))).toThrow('value is not set')

      const uint64AvmResult2 = await getAvmResult({ appClient }, 'verify_get_uint64', asUint8Array(uint64Key))
      const uint64Result2 = contract.verify_get_uint64(Bytes(uint64Key))
      expect(asBigInt(uint64Result2)).toEqual(uint64AvmResult2)
    })

    it('should be able to use _ex methods to get state of another app', async () => {
      const key = 'global_bytes_explicit'
      const secondContract = ctx.contract.create(StateAppGlobalExContract)
      const secondApp = ctx.ledger.getApplicationForContract(secondContract)
      expect(secondApp.globalNumUint.valueOf()).toEqual(2)
      expect(secondApp.globalNumBytes.valueOf()).toEqual(4)

      const bytesAvmResult = await getAvmResult({ appClient }, 'verify_get_ex_bytes', exApp.appId, asUint8Array(key))

      const contract = ctx.contract.create(StateAppGlobalContract)
      const bytesResult = contract.verify_get_ex_bytes(secondApp, Bytes(key))

      expect(bytesResult).toEqual(bytesAvmResult)
    })

    test.each(['global_arc4_bytes_explicit', 'global_arc4_bytes'])(
      'should be able to use _ex methods to get arc4 state values of another app',
      async (key) => {
        const secondContract = ctx.contract.create(StateAppGlobalExContract)
        const secondApp = ctx.ledger.getApplicationForContract(secondContract)
        expect(secondApp.globalNumUint.valueOf()).toEqual(2)
        expect(secondApp.globalNumBytes.valueOf()).toEqual(4)

        const bytesAvmResult = await getAvmResult({ appClient }, 'verify_get_ex_bytes', exApp.appId, asUint8Array(key))

        const contract = ctx.contract.create(StateAppGlobalContract)
        const bytesResult = contract.verify_get_ex_bytes(secondApp, Bytes(key))

        expect(bytesResult).toEqual(bytesAvmResult)
      },
    )
  })

  describe('AppLocal', async () => {
    const appClient = await getAlgorandAppClient(appLocalAppSpecJson as AppSpec)
    const [exAppClient, exApp] = await getAlgorandAppClientWithApp(appLocalExAppSpecJson as AppSpec)
    await tryOptIn(appClient)
    await tryOptIn(exAppClient)

    it('should be able to put, get and delete app local state', async () => {
      const localNetAccount = await getLocalNetDefaultAccount()
      const account = Account(Bytes.fromBase32(localNetAccount.addr))
      const bytesKey = 'local_bytes'
      const uint64Key = 'local_uint64'
      const bytesValue = 'test_bytes'
      const uint64Value = 42

      // put
      await getAvmResult({ appClient }, 'verify_put_bytes', localNetAccount.addr, asUint8Array(bytesKey), asUint8Array(bytesValue))
      await getAvmResult({ appClient }, 'verify_put_uint64', localNetAccount.addr, asUint8Array(uint64Key), uint64Value)

      const contract = ctx.contract.create(StateAppLocalContract)
      contract.verify_put_bytes(account, Bytes(bytesKey), Bytes(bytesValue))
      contract.verify_put_uint64(account, Bytes(uint64Key), Uint64(uint64Value))

      // get
      const bytesAvmResult = await getAvmResult({ appClient }, 'verify_get_bytes', localNetAccount.addr, asUint8Array(bytesKey))
      const uint64AvmResult = await getAvmResult({ appClient }, 'verify_get_uint64', localNetAccount.addr, asUint8Array(uint64Key))

      const bytesResult = contract.verify_get_bytes(account, Bytes(bytesKey))
      const uint64Result = contract.verify_get_uint64(account, Bytes(uint64Key))
      expect(bytesResult).toEqual(bytesAvmResult)
      expect(asBigInt(uint64Result)).toEqual(uint64AvmResult)

      // delete
      await getAvmResult({ appClient }, 'verify_delete', localNetAccount.addr, asUint8Array(bytesKey))
      await getAvmResult({ appClient }, 'verify_delete', localNetAccount.addr, asUint8Array(uint64Key))
      contract.verify_delete(account, Bytes(bytesKey))
      contract.verify_delete(account, Bytes(uint64Key))

      await expect(() => getAvmResult({ appClient }, 'verify_get_bytes', localNetAccount.addr, asUint8Array(bytesKey))).rejects.toThrow()
      expect(() => contract.verify_get_bytes(account, Bytes(bytesKey))).toThrow('value is not set')

      const uint64AvmResult2 = await getAvmResult({ appClient }, 'verify_get_uint64', localNetAccount.addr, asUint8Array(uint64Key))
      const uint64Result2 = contract.verify_get_uint64(account, Bytes(uint64Key))
      expect(asBigInt(uint64Result2)).toEqual(uint64AvmResult2)
    })

    it('should be able to use _ex methods to get state of another app', async () => {
      const key = 'local_bytes'
      const localNetAccount = await getLocalNetDefaultAccount()
      const account = Account(Bytes.fromBase32(localNetAccount.addr))
      const secondContract = ctx.contract.create(StateAppLocalExContract)
      const secondApp = ctx.ledger.getApplicationForContract(secondContract)
      expect(secondApp.localNumUint.valueOf()).toEqual(1)
      expect(secondApp.localNumBytes.valueOf()).toEqual(2)

      const bytesAvmResult = await getAvmResult({ appClient }, 'verify_get_ex_bytes', localNetAccount.addr, exApp.appId, asUint8Array(key))

      const contract = ctx.contract.create(StateAppLocalContract)
      secondContract.localBytes(account).value = Bytes('dummy_bytes_from_external_contract')
      const bytesResult = contract.verify_get_ex_bytes(account, secondApp, Bytes(key))

      expect(bytesResult).toEqual(bytesAvmResult)
    })

    it('should be able to use _ex methods to get arc4 state values of another app', async () => {
      const key = 'local_arc4_bytes'
      const localNetAccount = await getLocalNetDefaultAccount()
      const account = Account(Bytes.fromBase32(localNetAccount.addr))
      const secondContract = ctx.contract.create(StateAppLocalExContract)
      const secondApp = ctx.ledger.getApplicationForContract(secondContract)
      expect(secondApp.localNumUint.valueOf()).toEqual(1)
      expect(secondApp.localNumBytes.valueOf()).toEqual(2)

      const bytesAvmResult = await getAvmResult({ appClient }, 'verify_get_ex_bytes', localNetAccount.addr, exApp.appId, asUint8Array(key))

      const contract = ctx.contract.create(StateAppLocalContract)
      secondContract.localArc4Bytes(account).value = new DynamicBytes('dummy_arc4_bytes')
      const bytesResult = contract.verify_get_ex_bytes(account, secondApp, Bytes(key))

      expect(bytesResult).toEqual(bytesAvmResult)
    })
  })
})
const tryOptIn = async (client: ApplicationClient) => {
  try {
    await client.optIn({ method: 'opt_in', methodArgs: [] })
  } catch (e) {
    if (!(e as DeliberateAny).message.includes('has already opted in to app')) {
      throw e
    }
    // ignore error if account has already opted in
  }
}
