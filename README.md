# useMutex

A set of react hooks that allows for a mutually exclusive access to a resource.

## Documentation

### Hooks

<a name="functionsusemutexmd"></a>

* **useMutex**<`T`\>(`initialValue`): [`Mutex`](#typesmutexmd)<`T`\>

  `useMutex` creates a reference containing some data of type `T`, and then 
returns a mutex that controls access to said resource.
Its initial value is provided by the parameter `initialValue`, and will only
be used to initialize the reference, when the component is first mounted.

  | Name | Type | Description |
  | :------ | :------ | :------ |
  | `initialValue` | `T` | The initial value of the resource. |


* **useMutex**<`T`, `P`\>(`initializer`, `params`): [`Mutex`](#typesmutexmd)<`T`\>

  `useMutex` creates a reference containing some data of type `T`, and then 
returns a mutex that controls access to said resource.
Its initial value is computed by calling the user-supplied function `initializer` w
ith parameters `params`. This will only be done to initialize the reference, 
when the component is first mounted.

  > This version of `useMutex` is useful when the provided initial value is a large object, 
or its creation triggers some stateful behavior.

  | Name | Type | Description |
  | :------ | :------ | :------ |
  | `initializer` | (`params`: `P`) => `T` | A function that produces the initial value. |
  | `params` | [`P`] | The parameter passed to the `initializer` function. |


### Types

<a name="typesmutexmd"></a>
#### **Mutex**<`T`\>

A mutex protecting a resource from simultaneous access.

| Name | Type | Description |
| :------ | :------ | :------ |
| `acquire` | ()&nbsp;=>&nbsp;[`MutexResource`](#typesmutexresourcemd)<`T`\> | Lock the mutex, and acquire exclusive read/write access to the underlying resource.  If the mutex is already locked, throws `MutexLockedError`. |
| `isAvailable` | ()&nbsp;=>&nbsp;`boolean` | If the mutex is already locked, throws `MutexLockedError`.

<a name="typesmutexresourcemd"></a>

#### **MutexResource**<`T`\>

An access to the resource protected by a mutex. 
Must be released once the user has finished accessing the resource.

| Name | Type | Description |
| :------ | :------ | :------ |
| `isReleased` | () => `boolean` |
| `release` | () => `void` | Releases the resource, and allows other agents to acquire the mutex. Throws `MutexAccessRevokedError` iff this access has already been released.
| `get` | () => `T` | Returns the value stored in the mutex. Throws `MutexAccessRevokedError` iff this access has already been released.
| `set` | (`value`: `T`) => `void` | Mutates the value stored in the mutex. Throws `MutexAccessRevokedError` iff this access has already been released.
