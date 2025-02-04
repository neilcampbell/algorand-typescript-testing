[**@algorandfoundation/algorand-typescript-testing**](../../README.md)

***

[@algorandfoundation/algorand-typescript-testing](../../README.md) / [value-generators](../README.md) / ValueGenerator

# Class: ValueGenerator

Defined in: [src/value-generators/index.ts:5](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/index.ts#L5)

## Extends

- [`AvmValueGenerator`](../avm/classes/AvmValueGenerator.md)

## Constructors

### new ValueGenerator()

> **new ValueGenerator**(): [`ValueGenerator`](ValueGenerator.md)

Defined in: [src/value-generators/index.ts:9](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/index.ts#L9)

#### Returns

[`ValueGenerator`](ValueGenerator.md)

#### Overrides

[`AvmValueGenerator`](../avm/classes/AvmValueGenerator.md).[`constructor`](../avm/classes/AvmValueGenerator.md#constructors)

## Properties

### arc4

> **arc4**: [`Arc4ValueGenerator`](../arc4/classes/Arc4ValueGenerator.md)

Defined in: [src/value-generators/index.ts:7](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/index.ts#L7)

***

### txn

> **txn**: [`TxnValueGenerator`](../txn/classes/TxnValueGenerator.md)

Defined in: [src/value-generators/index.ts:6](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/index.ts#L6)

## Methods

### account()

> **account**(`input`?): `Account`

Defined in: [src/value-generators/avm.ts:94](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/avm.ts#L94)

Generates a random account with the specified context data.

#### Parameters

##### input?

`AccountContextData`

The context data for the account.

#### Returns

`Account`

- A random account.

#### Inherited from

[`AvmValueGenerator`](../avm/classes/AvmValueGenerator.md).[`account`](../avm/classes/AvmValueGenerator.md#account)

***

### application()

> **application**(`input`?): `Application`

Defined in: [src/value-generators/avm.ts:152](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/avm.ts#L152)

Generates a random application with the specified context data.

#### Parameters

##### input?

`ApplicationContextData`

The context data for the application.

#### Returns

`Application`

- A random application.

#### Inherited from

[`AvmValueGenerator`](../avm/classes/AvmValueGenerator.md).[`application`](../avm/classes/AvmValueGenerator.md#application)

***

### asset()

> **asset**(`input`?): `Asset`

Defined in: [src/value-generators/avm.ts:132](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/avm.ts#L132)

Generates a random asset with the specified context data.

#### Parameters

##### input?

`AssetContextData`

The context data for the asset.

#### Returns

`Asset`

- A random asset.

#### Inherited from

[`AvmValueGenerator`](../avm/classes/AvmValueGenerator.md).[`asset`](../avm/classes/AvmValueGenerator.md#asset)

***

### biguint()

> **biguint**(`minValue`?): `biguint`

Defined in: [src/value-generators/avm.ts:57](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/avm.ts#L57)

Generates a random biguint value within the specified range.

#### Parameters

##### minValue?

`StubBigUintCompat` = `0n`

The minimum value (inclusive).

#### Returns

`biguint`

- A random biguint value.

#### Inherited from

[`AvmValueGenerator`](../avm/classes/AvmValueGenerator.md).[`biguint`](../avm/classes/AvmValueGenerator.md#biguint)

***

### bytes()

> **bytes**(`length`?): `bytes`

Defined in: [src/value-generators/avm.ts:71](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/avm.ts#L71)

Generates a random bytes of the specified length.

#### Parameters

##### length?

`number` = `MAX_BYTES_SIZE`

The length of the bytes.

#### Returns

`bytes`

- A random bytes.

#### Inherited from

[`AvmValueGenerator`](../avm/classes/AvmValueGenerator.md).[`bytes`](../avm/classes/AvmValueGenerator.md#bytes)

***

### string()

> **string**(`length`?): `string`

Defined in: [src/value-generators/avm.ts:80](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/avm.ts#L80)

Generates a random string of the specified length.

#### Parameters

##### length?

`number` = `11`

The length of the string.

#### Returns

`string`

- A random string.

#### Inherited from

[`AvmValueGenerator`](../avm/classes/AvmValueGenerator.md).[`string`](../avm/classes/AvmValueGenerator.md#string)

***

### uint64()

> **uint64**(`minValue`?, `maxValue`?): `uint64`

Defined in: [src/value-generators/avm.ts:37](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/avm.ts#L37)

Generates a random uint64 value within the specified range.

#### Parameters

##### minValue?

`StubUint64Compat` = `0n`

The minimum value (inclusive).

##### maxValue?

`StubUint64Compat` = `MAX_UINT64`

The maximum value (inclusive).

#### Returns

`uint64`

- A random uint64 value.

#### Inherited from

[`AvmValueGenerator`](../avm/classes/AvmValueGenerator.md).[`uint64`](../avm/classes/AvmValueGenerator.md#uint64)
