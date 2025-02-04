[**@algorandfoundation/algorand-typescript-testing**](../../../README.md)

***

[@algorandfoundation/algorand-typescript-testing](../../../README.md) / [subcontexts/transaction-context](../README.md) / TransactionGroup

# Class: TransactionGroup

Defined in: [src/subcontexts/transaction-context.ts:223](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L223)

Represents a group of transactions.

## Constructors

### new TransactionGroup()

> **new TransactionGroup**(`transactions`, `activeTransactionIndex`?): [`TransactionGroup`](TransactionGroup.md)

Defined in: [src/subcontexts/transaction-context.ts:230](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L230)

#### Parameters

##### transactions

`Transaction`[]

##### activeTransactionIndex?

`number`

#### Returns

[`TransactionGroup`](TransactionGroup.md)

## Properties

### activeTransactionIndex

> **activeTransactionIndex**: `number`

Defined in: [src/subcontexts/transaction-context.ts:224](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L224)

***

### constructingItxnGroup

> **constructingItxnGroup**: `InnerTxnFields`[] = `[]`

Defined in: [src/subcontexts/transaction-context.ts:228](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L228)

***

### itxnGroups

> **itxnGroups**: [`ItxnGroup`](ItxnGroup.md)[] = `[]`

Defined in: [src/subcontexts/transaction-context.ts:227](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L227)

***

### latestTimestamp

> **latestTimestamp**: `number`

Defined in: [src/subcontexts/transaction-context.ts:225](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L225)

***

### transactions

> **transactions**: `Transaction`[]

Defined in: [src/subcontexts/transaction-context.ts:226](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L226)

## Accessors

### activeApplicationId

#### Get Signature

> **get** **activeApplicationId**(): `uint64`

Defined in: [src/subcontexts/transaction-context.ts:253](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L253)

Gets the active application ID.

##### Throws

If there are no transactions in the group or the active transaction is not an application call.

##### Returns

`uint64`

The active application ID.

***

### activeTransaction

#### Get Signature

> **get** **activeTransaction**(): `Transaction`

Defined in: [src/subcontexts/transaction-context.ts:244](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L244)

Gets the active transaction.

##### Returns

`Transaction`

The active transaction.

***

### constructingItxn

#### Get Signature

> **get** **constructingItxn**(): `InnerTxnFields`

Defined in: [src/subcontexts/transaction-context.ts:262](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L262)

##### Returns

`InnerTxnFields`

## Methods

### addInnerTransactionGroup()

> **addInnerTransactionGroup**(...`itxns`): `void`

Defined in: [src/subcontexts/transaction-context.ts:301](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L301)

**`Internal`**

Adds a group of inner transactions.

#### Parameters

##### itxns

...`InnerTxn`[]

The inner transactions.

#### Returns

`void`

***

### appendInnerTransactionGroup()

> **appendInnerTransactionGroup**(): `void`

Defined in: [src/subcontexts/transaction-context.ts:326](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L326)

**`Internal`**

Appends a new inner transaction to the current group.

#### Returns

`void`

#### Throws

If there is no inner transaction group being constructed.

***

### beginInnerTransactionGroup()

> **beginInnerTransactionGroup**(): `void`

Defined in: [src/subcontexts/transaction-context.ts:310](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L310)

**`Internal`**

Begins a new inner transaction group.

#### Returns

`void`

#### Throws

If there is already an inner transaction group being constructed or the active transaction is not an application call.

***

### getApplicationTransaction()

> **getApplicationTransaction**(`index`?): `ApplicationTransaction`

Defined in: [src/subcontexts/transaction-context.ts:383](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L383)

Gets an application transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`ApplicationTransaction`

The application transaction.

***

### getAssetConfigTransaction()

> **getAssetConfigTransaction**(`index`?): `AssetConfigTransaction`

Defined in: [src/subcontexts/transaction-context.ts:392](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L392)

Gets an asset configuration transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`AssetConfigTransaction`

The asset configuration transaction.

***

### getAssetFreezeTransaction()

> **getAssetFreezeTransaction**(`index`?): `AssetFreezeTransaction`

Defined in: [src/subcontexts/transaction-context.ts:410](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L410)

Gets an asset freeze transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`AssetFreezeTransaction`

The asset freeze transaction.

***

### getAssetTransferTransaction()

> **getAssetTransferTransaction**(`index`?): `AssetTransferTransaction`

Defined in: [src/subcontexts/transaction-context.ts:401](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L401)

Gets an asset transfer transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`AssetTransferTransaction`

The asset transfer transaction.

***

### getItxnGroup()

> **getItxnGroup**(`index`?): [`ItxnGroup`](ItxnGroup.md)

Defined in: [src/subcontexts/transaction-context.ts:365](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L365)

Gets an inner transaction group by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the group. If not provided, the last group is returned.

#### Returns

[`ItxnGroup`](ItxnGroup.md)

The inner transaction group.

#### Throws

If the index is invalid or there are no previous inner transactions.

***

### getKeyRegistrationTransaction()

> **getKeyRegistrationTransaction**(`index`?): `KeyRegistrationTransaction`

Defined in: [src/subcontexts/transaction-context.ts:419](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L419)

Gets a key registration transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`KeyRegistrationTransaction`

The key registration transaction.

***

### getPaymentTransaction()

> **getPaymentTransaction**(`index`?): `PaymentTransaction`

Defined in: [src/subcontexts/transaction-context.ts:428](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L428)

Gets a payment transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`PaymentTransaction`

The payment transaction.

***

### getScratchSlot()

> **getScratchSlot**(`index`): `bytes` \| `uint64`

Defined in: [src/subcontexts/transaction-context.ts:282](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L282)

Gets the scratch slot of the active transaction.

#### Parameters

##### index

`StubUint64Compat`

The index of the scratch slot.

#### Returns

`bytes` \| `uint64`

The scratch slot value.

***

### getScratchSpace()

> **getScratchSpace**(): (`bytes` \| `uint64`)[]

Defined in: [src/subcontexts/transaction-context.ts:273](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L273)

Gets the scratch space of the active transaction.

#### Returns

(`bytes` \| `uint64`)[]

The scratch space.

***

### getTransaction()

> **getTransaction**(`index`?): `Transaction`

Defined in: [src/subcontexts/transaction-context.ts:437](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L437)

Gets a transaction by index.

#### Parameters

##### index?

`StubUint64Compat`

The index of the transaction.

#### Returns

`Transaction`

The transaction.

***

### lastItxnGroup()

> **lastItxnGroup**(): [`ItxnGroup`](ItxnGroup.md)

Defined in: [src/subcontexts/transaction-context.ts:355](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L355)

Gets the last inner transaction group.

#### Returns

[`ItxnGroup`](ItxnGroup.md)

The last inner transaction group.

***

### patchActiveTransactionFields()

> **patchActiveTransactionFields**(`fields`): `void`

Defined in: [src/subcontexts/transaction-context.ts:290](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L290)

Patches the fields of the active transaction.

#### Parameters

##### fields

`AllTransactionFields`

The fields to patch.

#### Returns

`void`

***

### submitInnerTransactionGroup()

> **submitInnerTransactionGroup**(): `void`

Defined in: [src/subcontexts/transaction-context.ts:338](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L338)

**`Internal`**

Submits the current inner transaction group.

#### Returns

`void`

#### Throws

If there is no inner transaction group being constructed or the group exceeds the maximum size.
