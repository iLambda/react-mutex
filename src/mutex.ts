import { MutableRefObject, useCallback, useRef } from 'react';
import { MutexLockedError, MutexAccessRevokedError } from './error';

/* The hiden token symbol property */
const borrow : unique symbol = Symbol();
/* The hidden content of the mutex */
type MutexInternal<T> = {
    /* The value */
    value: T;
    /* The current borrow token that has acquired the resource */
    [borrow]: symbol | null;
}

/**
 * A mutex protecting a resource from simultaneous access.
 * @param T - The type of the underlying resource.
 */
export type Mutex<T> = {
    /** 
     * Lock the mutex, and acquire exclusive read/write access to the underlying resource.
     * @throws If the mutex is already locked, throws `MutexLockedError`.
     * @returns The resource guarded by the mutex.
     */
    acquire: () => MutexResource<T>
    /** 
     * Checks if the mutex is locked.
     * @returns `true` iff the resource can be acquired, else otherwise.
     */
    isAvailable: () => boolean    
}

/**
 * An access to the resource protected by a mutex. 
 * Must be released once the user has finished accessing the resource.
 * @param T - The type of the underlying resource.
 */
export type MutexResource<T> = {
    /** 
     * @returns `true` iff this access to this resource is stale and can no longer be used, 
     * `false` otherwise.
     */
    isReleased: () => boolean;
    /**
     * Releases the resource, and allows other agents to acquire the mutex.
     * @throws `MutexAccessRevokedError` iff this access has already been released.
     */
    release: () => void;
    /**
     * Returns the value stored in the mutex.
     * @throws `MutexAccessRevokedError` iff this access has already been released.
     * @returns The value stored in the mutex
     */
    get() : T;
    /**
     * Mutates the value stored in the mutex.
     * @param value - The new value 
     * @throws `MutexAccessRevokedError` iff this access has already been released.
     */
    set(value: T) : void;

    /** 
     * @internal 
     */
    readonly [borrow]: symbol; 
}

const createMutexResource = <T>(mutexRef: MutableRefObject<MutexInternal<T>>) : MutexResource<T> => {
    /* Generate a borrow token */
    const token = Symbol('mutex:borrow');
    /* Helper to check if view is released */
    const isReleased = () => token !== mutexRef.current[borrow];
    /* Create it */
    return Object.freeze({
        /* The token */
        [borrow]: token,
        /* Is the view released ? */
        isReleased,
        /* Release the mutex */
        release: () => {
            /* Check token is still valid */
            if (isReleased()) {
                throw new MutexAccessRevokedError();
            }
            /* Release */
            mutexRef.current[borrow] = null;
        },
        
        /* Get the value */
        get: () => { 
            /* Check token is still valid */
            if (isReleased()) {
                throw new MutexAccessRevokedError();
            }
            /* Return */
            return mutexRef.current.value;
        },
        /* Set the value */
        set: (value: T) => { 
            /* Check token is still valid */
            if (isReleased()) {
                throw new MutexAccessRevokedError();
            }
            /* Set */
            return void (mutexRef.current.value = value);
        }
    });
};


/**
 * `useMutex` creates a reference containing some data of type `T`, and then 
 * returns a mutex that controls access to said resource.
 * Its initial value is provided by the parameter `initialValue`, and will only
 * be used to initialize the reference, when the component is first mounted.
 * 
 * @param initialValue - The initial value of the resource.
 */
export function useMutex<T>(initialValue: T) : Mutex<T>;
/**
 * `useMutex` creates a reference containing some data of type `T`, and then 
 * returns a mutex that controls access to said resource.
 * Its initial value is computed by calling the user-supplied function `initializer` w
 * ith parameters `params`. This will only be done to initialize the reference, 
 * when the component is first mounted.
 * 
 * @remarks 
 * This version of `useMutex` is useful when the provided initial value is a large object, 
 * or its creation triggers some stateful behavior.
 * 
 * @param initializer - A function that produces the initial value.
 * @param params - The parameter passed to the `initializer` function.
 */
export function useMutex<T, P extends NonNullable<unknown>>(initializer: (params: P) => T, params: [P]) : Mutex<T>;
export function useMutex<T, P extends NonNullable<unknown>>(init: T | ((params: P) => T), params?: [P]) : Mutex<T> {
    /* Get a reference */
    const mutexRef = useRef<MutexInternal<T> | null>(null);
    if (mutexRef.current === null) {
        /* Initialize it */
        mutexRef.current = {
            /* ... with no borrow token */
            [borrow]: null,
            /* ... and compute the base value */ 
            value: params 
                ? (init as (params: P) => T)(...params)
                : (init as T)
        };
    }
    /* Return the mutex */
    return {
        /* Check if the value is available */
        isAvailable: useCallback(() => mutexRef.current![borrow] === null, [mutexRef]),
        /* Acquire the resource */
        acquire: useCallback(() => {
            /* If resource isn't free, error */
            if (mutexRef.current![borrow] !== null) {
                throw new MutexLockedError();
            }
            /* Create the resource view */
            const resourceView = createMutexResource(mutexRef as MutableRefObject<MutexInternal<T>>);
            /* Register the token */
            mutexRef.current![borrow] = resourceView[borrow];
            /* Return the resource*/
            return resourceView;
        }, [mutexRef])
    };
}
