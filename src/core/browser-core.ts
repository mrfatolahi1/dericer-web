/**
 * Browser-specific core bootstrap for Dericer.
 *
 * This module:
 * - creates a TimePort using the browser's current time
 * - creates an IndexedDB-based StoragePort
 * - builds a CoreApi instance using dericer-core's createCore(...)
 */

import {type CoreApi, createCore, type ISODateTimeString, type TimePort,} from "dericer-core";
import {createIndexedDbStorage} from "../storage/browser/indexeddb-storage";

/**
 * Simple TimePort implementation using the browser's system clock.
 */
class BrowserTimePort implements TimePort {
    now(): ISODateTimeString {
        return new Date().toISOString() as ISODateTimeString;
    }
}

/**
 * Create and initialize the core for the browser environment.
 *
 * This includes setting up IndexedDB-backed storage and the time provider.
 */
export async function createBrowserCore(): Promise<CoreApi> {
    const storage = await createIndexedDbStorage();
    const time = new BrowserTimePort();

    return createCore({
        storage,
        time,
    });
}
