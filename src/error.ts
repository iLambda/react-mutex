/**
 * Thrown when an access to the mutex's resource is requested, while
 * another one is already valid.
 */
export class MutexLockedError extends Error {
    constructor() { super('Mutex was acquired while already in use.'); }
}

/**
 * Thrown when an access is used after being revoked by `release()`.
 */
export class MutexAccessRevokedError extends Error {
    constructor() { super('A resource view associated to some mutex was accessed after its release.'); }
}