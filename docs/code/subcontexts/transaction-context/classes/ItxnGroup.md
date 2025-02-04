[**@algorandfoundation/algorand-typescript-testing**](../../../README.md)

***

[@algorandfoundation/algorand-typescript-testing](../../../README.md) / [subcontexts/transaction-context](../README.md) / ItxnGroup

# Class: ItxnGroup

Defined in: [src/subcontexts/transaction-context.ts:474](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L474)

Represents a group of inner transactions.

## Constructors

### new ItxnGroup()

> **new ItxnGroup**(`itxns`): [`ItxnGroup`](ItxnGroup.md)

Defined in: [src/subcontexts/transaction-context.ts:476](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L476)

#### Parameters

##### itxns

`InnerTxn`[]

#### Returns

[`ItxnGroup`](ItxnGroup.md)

## Properties

### itxns

> **itxns**: `InnerTxn`[] = `[]`

Defined in: [src/subcontexts/transaction-context.ts:475](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L475)

## Methods

### getApplicationInnerTxn()

> **getApplicationInnerTxn**(`index`?): `ApplicationInnerTxn`

Defined in: [src/subcontexts/transaction-context.ts:485](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L485)

Gets an application inner transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`ApplicationInnerTxn`

The application inner transaction.

***

### getAssetConfigInnerTxn()

> **getAssetConfigInnerTxn**(`index`?): `AssetConfigInnerTxn`

Defined in: [src/subcontexts/transaction-context.ts:494](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L494)

Gets an asset configuration inner transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`AssetConfigInnerTxn`

The asset configuration inner transaction.

***

### getAssetFreezeInnerTxn()

> **getAssetFreezeInnerTxn**(`index`?): `AssetFreezeInnerTxn`

Defined in: [src/subcontexts/transaction-context.ts:512](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L512)

Gets an asset freeze inner transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`AssetFreezeInnerTxn`

The asset freeze inner transaction.

***

### getAssetTransferInnerTxn()

> **getAssetTransferInnerTxn**(`index`?): `AssetTransferInnerTxn`

Defined in: [src/subcontexts/transaction-context.ts:503](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L503)

Gets an asset transfer inner transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`AssetTransferInnerTxn`

The asset transfer inner transaction.

***

### getInnerTxn()

> **getInnerTxn**(`index`?): `InnerTxn`

Defined in: [src/subcontexts/transaction-context.ts:539](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L539)

Gets an inner transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`InnerTxn`

The inner transaction.

***

### getKeyRegistrationInnerTxn()

> **getKeyRegistrationInnerTxn**(`index`?): `KeyRegistrationInnerTxn`

Defined in: [src/subcontexts/transaction-context.ts:521](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L521)

Gets a key registration inner transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`KeyRegistrationInnerTxn`

The key registration inner transaction.

***

### getPaymentInnerTxn()

> **getPaymentInnerTxn**(`index`?): `PaymentInnerTxn`

Defined in: [src/subcontexts/transaction-context.ts:530](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L530)

Gets a payment inner transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`PaymentInnerTxn`

The payment inner transaction.
