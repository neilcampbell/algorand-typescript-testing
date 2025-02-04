[**@algorandfoundation/algorand-typescript-testing**](../../README.md)

***

[@algorandfoundation/algorand-typescript-testing](../../README.md) / [index](../README.md) / encodingUtil

# Variable: encodingUtil

> `const` **encodingUtil**: `object`

Defined in: [src/index.ts:5](https://github.com/algorandfoundation/algorand-typescript-testing/blob/main/src/index.ts#L5)

## Type declaration

### base64ToUint8Array()

> **base64ToUint8Array**: (`value`) => `Uint8Array`

#### Parameters

##### value

`string`

#### Returns

`Uint8Array`

### bigIntToUint8Array()

> **bigIntToUint8Array**: (`val`, `fixedSize`?) => `Uint8Array`

#### Parameters

##### val

`bigint`

##### fixedSize?

`number` | `"dynamic"`

#### Returns

`Uint8Array`

### hexToUint8Array()

> **hexToUint8Array**: (`value`) => `Uint8Array`

#### Parameters

##### value

`string`

#### Returns

`Uint8Array`

### toExternalValue()

> **toExternalValue**: (`val`) => `bigint`(`val`) => `bigint`(`val`) => `Uint8Array`(`val`) => `string` = `internal.primitives.toExternalValue`

#### Parameters

##### val

`uint64`

#### Returns

`bigint`

#### Parameters

##### val

`biguint`

#### Returns

`bigint`

#### Parameters

##### val

`bytes`

#### Returns

`Uint8Array`

#### Parameters

##### val

`string`

#### Returns

`string`

### uint8ArrayToBase64()

> **uint8ArrayToBase64**: (`value`) => `string`

#### Parameters

##### value

`Uint8Array`

#### Returns

`string`

### uint8ArrayToBase64Url()

> **uint8ArrayToBase64Url**: (`value`) => `string`

#### Parameters

##### value

`Uint8Array`

#### Returns

`string`

### uint8ArrayToBigInt()

> **uint8ArrayToBigInt**: (`v`) => `bigint`

#### Parameters

##### v

`Uint8Array`

#### Returns

`bigint`

### uint8ArrayToHex()

> **uint8ArrayToHex**: (`value`) => `string`

#### Parameters

##### value

`Uint8Array`

#### Returns

`string`

### uint8ArrayToUtf8()

> **uint8ArrayToUtf8**: (`value`) => `string`

#### Parameters

##### value

`Uint8Array`

#### Returns

`string`

### utf8ToUint8Array()

> **utf8ToUint8Array**: (`value`) => `Uint8Array`

#### Parameters

##### value

`string`

#### Returns

`Uint8Array`

### uint8ArrayToBase32()

#### Parameters

##### value

`Uint8Array`

#### Returns

`string`
