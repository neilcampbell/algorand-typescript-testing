[**@algorandfoundation/algorand-typescript-testing**](../../README.md)

***

[@algorandfoundation/algorand-typescript-testing](../../README.md) / [index](../README.md) / TestExecutionContext

# Class: TestExecutionContext

Defined in: [src/test-execution-context.ts:21](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L21)

The `TestExecutionContext` class provides a context for executing tests in an Algorand environment.
It manages various contexts such as contract, ledger, and transaction contexts, and provides utilities
for generating values, managing accounts, and handling logic signatures.

## Implements

- `ExecutionContext`

## Constructors

### new TestExecutionContext()

> **new TestExecutionContext**(`defaultSenderAddress`?): [`TestExecutionContext`](TestExecutionContext.md)

Defined in: [src/test-execution-context.ts:37](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L37)

Creates an instance of `TestExecutionContext`.

#### Parameters

##### defaultSenderAddress?

`bytes`

The default sender address.

#### Returns

[`TestExecutionContext`](TestExecutionContext.md)

## Accessors

### abiMetadata

#### Get Signature

> **get** **abiMetadata**(): `object`

Defined in: [src/test-execution-context.ts:119](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L119)

**`Internal`**

Returns an object containing ABI metadata operations.

##### Returns

`object`

###### captureMethodConfig()

> **captureMethodConfig**: \<`T`\>(`contract`, `methodName`, `config`?) => `void`

###### Type Parameters

• **T** *extends* `Contract`

###### Parameters

###### contract

`T`

###### methodName

`string`

###### config?

`AbiMethodConfig`\<`T`\> | `BareMethodConfig`

###### Returns

`void`

#### Implementation of

`internal.ExecutionContext.abiMetadata`

***

### activeLogicSigArgs

#### Get Signature

> **get** **activeLogicSigArgs**(): `bytes`[]

Defined in: [src/test-execution-context.ts:130](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L130)

Returns the active logic signature arguments.

##### Returns

`bytes`[]

***

### any

#### Get Signature

> **get** **any**(): [`ValueGenerator`](../../value-generators/classes/ValueGenerator.md)

Defined in: [src/test-execution-context.ts:91](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L91)

Returns the value generator.

##### Returns

[`ValueGenerator`](../../value-generators/classes/ValueGenerator.md)

***

### contract

#### Get Signature

> **get** **contract**(): [`ContractContext`](../../subcontexts/contract-context/classes/ContractContext.md)

Defined in: [src/test-execution-context.ts:64](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L64)

Returns the contract context.

##### Returns

[`ContractContext`](../../subcontexts/contract-context/classes/ContractContext.md)

***

### defaultSender

#### Get Signature

> **get** **defaultSender**(): `Account`

Defined in: [src/test-execution-context.ts:100](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L100)

Returns the default sender account.

##### Returns

`Account`

#### Set Signature

> **set** **defaultSender**(`val`): `void`

Defined in: [src/test-execution-context.ts:109](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L109)

Sets the default sender account.

##### Parameters

###### val

The default sender account.

`bytes` | `Account`

##### Returns

`void`

***

### ledger

#### Get Signature

> **get** **ledger**(): [`LedgerContext`](../../subcontexts/ledger-context/classes/LedgerContext.md)

Defined in: [src/test-execution-context.ts:73](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L73)

Returns the ledger context.

##### Returns

[`LedgerContext`](../../subcontexts/ledger-context/classes/LedgerContext.md)

***

### templateVars

#### Get Signature

> **get** **templateVars**(): `Record`\<`string`, `any`\>

Defined in: [src/test-execution-context.ts:139](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L139)

Returns the template variables.

##### Returns

`Record`\<`string`, `any`\>

***

### txn

#### Get Signature

> **get** **txn**(): [`TransactionContext`](../../subcontexts/transaction-context/classes/TransactionContext.md)

Defined in: [src/test-execution-context.ts:82](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L82)

Returns the transaction context.

##### Returns

[`TransactionContext`](../../subcontexts/transaction-context/classes/TransactionContext.md)

## Methods

### executeLogicSig()

> **executeLogicSig**(`logicSig`, ...`args`): `boolean` \| `uint64`

Defined in: [src/test-execution-context.ts:150](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L150)

Executes a logic signature with the given arguments.

#### Parameters

##### logicSig

`LogicSig`

The logic signature to execute.

##### args

...`bytes`[]

The arguments for the logic signature.

#### Returns

`boolean` \| `uint64`

***

### exportLogs()

> **exportLogs**\<`T`\>(`appId`, ...`decoding`): `DecodedLogs`\<`T`\>

Defined in: [src/test-execution-context.ts:55](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L55)

Exports logs for a given application ID and decoding.

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

***

### getCompiledApp()

> **getCompiledApp**(`contract`): `undefined` \| \[`ConstructorFor`\<`BaseContract`\>, `uint64`\]

Defined in: [src/test-execution-context.ts:176](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L176)

Gets a compiled application by contract.

#### Parameters

##### contract

`ConstructorFor`\<`BaseContract`\>

The contract class.

#### Returns

`undefined` \| \[`ConstructorFor`\<`BaseContract`\>, `uint64`\]

***

### getCompiledLogicSig()

> **getCompiledLogicSig**(`logicsig`): `undefined` \| \[`ConstructorFor`\<`LogicSig`\>, `Account`\]

Defined in: [src/test-execution-context.ts:201](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L201)

Gets a compiled logic signature.

#### Parameters

##### logicsig

`ConstructorFor`\<`LogicSig`\>

The logic signature class.

#### Returns

`undefined` \| \[`ConstructorFor`\<`LogicSig`\>, `Account`\]

***

### reset()

> **reset**(): `void`

Defined in: [src/test-execution-context.ts:224](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L224)

Reinitializes the execution context, clearing all state variables and resetting internal components.
Invoked between test cases to ensure isolation.

#### Returns

`void`

***

### setCompiledApp()

> **setCompiledApp**(`c`, `appId`): `void`

Defined in: [src/test-execution-context.ts:186](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L186)

Sets a compiled application.

#### Parameters

##### c

`ConstructorFor`\<`BaseContract`\>

The contract class.

##### appId

`uint64`

The application ID.

#### Returns

`void`

***

### setCompiledLogicSig()

> **setCompiledLogicSig**(`c`, `account`): `void`

Defined in: [src/test-execution-context.ts:211](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L211)

Sets a compiled logic signature.

#### Parameters

##### c

`ConstructorFor`\<`LogicSig`\>

The logic signature class.

##### account

`Account`

The account associated with the logic signature.

#### Returns

`void`

***

### setTemplateVar()

> **setTemplateVar**(`name`, `value`, `prefix`?): `void`

Defined in: [src/test-execution-context.ts:166](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/test-execution-context.ts#L166)

Sets a template variable.

#### Parameters

##### name

`string`

The name of the template variable.

##### value

`any`

The value of the template variable.

##### prefix?

`string`

The prefix for the template variable.

#### Returns

`void`
