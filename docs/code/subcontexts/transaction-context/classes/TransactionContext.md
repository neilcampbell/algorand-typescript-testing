[**@algorandfoundation/algorand-typescript-testing**](../../../README.md)

***

[@algorandfoundation/algorand-typescript-testing](../../../README.md) / [subcontexts/transaction-context](../README.md) / TransactionContext

# Class: TransactionContext

Defined in: [src/subcontexts/transaction-context.ts:81](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L81)

Manages transaction contexts and groups.

## Constructors

### new TransactionContext()

> **new TransactionContext**(): [`TransactionContext`](TransactionContext.md)

#### Returns

[`TransactionContext`](TransactionContext.md)

## Properties

### groups

> `readonly` **groups**: [`TransactionGroup`](TransactionGroup.md)[] = `[]`

Defined in: [src/subcontexts/transaction-context.ts:82](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L82)

## Accessors

### activeGroup

#### Get Signature

> **get** **activeGroup**(): [`TransactionGroup`](TransactionGroup.md)

Defined in: [src/subcontexts/transaction-context.ts:138](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L138)

Gets the active transaction group.

##### Throws

If there is no active transaction group.

##### Returns

[`TransactionGroup`](TransactionGroup.md)

The active transaction group.

***

### lastActive

#### Get Signature

> **get** **lastActive**(): `Transaction`

Defined in: [src/subcontexts/transaction-context.ts:161](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L161)

Gets the last active transaction.

##### Returns

`Transaction`

The last active transaction.

***

### lastGroup

#### Get Signature

> **get** **lastGroup**(): [`TransactionGroup`](TransactionGroup.md)

Defined in: [src/subcontexts/transaction-context.ts:150](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L150)

Gets the last transaction group.

##### Throws

If there are no transaction groups.

##### Returns

[`TransactionGroup`](TransactionGroup.md)

The last transaction group.

## Methods

### appendLog()

> **appendLog**(`value`): `void`

Defined in: [src/subcontexts/transaction-context.ts:171](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L171)

**`Internal`**

Appends a log to the active transaction.

#### Parameters

##### value

`StubBytesCompat`

The log value.

#### Returns

`void`

#### Throws

If the active transaction is not an application call.

***

### createScope()

> **createScope**(`group`, `activeTransactionIndex`?): `ExecutionScope`

Defined in: [src/subcontexts/transaction-context.ts:91](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L91)

Creates a new execution scope for a group of transactions.

#### Parameters

##### group

(`Transaction` \| [`DeferredAppCall`](DeferredAppCall.md)\<`any`[], `any`\>)[]

The group of transactions or deferred application calls.

##### activeTransactionIndex?

`number`

The index of the active transaction.

#### Returns

`ExecutionScope`

The execution scope.

***

### deferAppCall()

> **deferAppCall**\<`TContract`, `TParams`, `TReturn`\>(`contract`, `method`, `methodName`, ...`args`): [`DeferredAppCall`](DeferredAppCall.md)\<`TParams`, `TReturn`\>

Defined in: [src/subcontexts/transaction-context.ts:187](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L187)

Defers an application call.

#### Type Parameters

• **TContract** *extends* `Contract`

• **TParams** *extends* `unknown`[]

• **TReturn**

#### Parameters

##### contract

`TContract`

The contract.

##### method

(...`args`) => `TReturn`

The method to call.

##### methodName

`FunctionKeys`\<`TContract`\>

The name of the method.

##### args

...`TParams`

The arguments for the method.

#### Returns

[`DeferredAppCall`](DeferredAppCall.md)\<`TParams`, `TReturn`\>

The deferred application call.

***

### ensureScope()

> **ensureScope**(`group`, `activeTransactionIndex`?): `ExecutionScope`

Defined in: [src/subcontexts/transaction-context.ts:122](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L122)

**`Internal`**

Ensures that a scope is created for the given group of transactions.

#### Parameters

##### group

`Transaction`[]

The group of transactions.

##### activeTransactionIndex?

`number`

The index of the active transaction.

#### Returns

`ExecutionScope`

The execution scope.

***

### exportLogs()

> **exportLogs**\<`T`\>(`appId`, ...`decoding`): `DecodedLogs`\<`T`\>

Defined in: [src/subcontexts/transaction-context.ts:205](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/subcontexts/transaction-context.ts#L205)

Exports logs for the given application ID.

#### Type Parameters

• **T** *extends* `LogDecoding`[]

#### Parameters

##### appId

`uint64`

The application ID.

##### decoding

...`T`

The log decoding.

#### Returns

`DecodedLogs`\<`T`\>

The decoded logs.
