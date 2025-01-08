[**@algorandfoundation/algorand-typescript-testing**](../../../README.md)

***

[@algorandfoundation/algorand-typescript-testing](../../../README.md) / [value-generators/avm](../README.md) / AvmValueGenerator

# Class: AvmValueGenerator

Defined in: [src/value-generators/avm.ts:30](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/value-generators/avm.ts#L30)

## Extended by

- [`ValueGenerator`](../../classes/ValueGenerator.md)

## Constructors

### new AvmValueGenerator()

> **new AvmValueGenerator**(): [`AvmValueGenerator`](AvmValueGenerator.md)

#### Returns

[`AvmValueGenerator`](AvmValueGenerator.md)

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
