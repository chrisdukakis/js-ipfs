import CID from 'cids'
import { Mtime, MtimeLike } from 'ipfs-unixfs'

export type Entry<Content extends AsyncIterable<Uint8Array>|Blob> =
  | FileEntry<Content>
  | DirectoryEntry

export interface BaseEntry {
  path: string
  mode?: number
  mtime?: Mtime
}
export interface FileEntry <Content extends AsyncIterable<Uint8Array>|Blob> extends BaseEntry {
  content?: Content
}

export interface DirectoryEntry extends BaseEntry {
  content?: undefined
}

export type ImportSource =
| AwaitIterable<ToEntry>
| ReadableStream<ToEntry>

export type ToEntry =
  | ToFile
  | ToDirectory
  | ToContent

export interface ToFile extends ToFileMetadata {
  path?: string
  content: ToContent
}

export interface ToDirectory extends ToFileMetadata {
  path: string
  content?: undefined
}

export interface ToFileMetadata {
  mode?: ToMode
  mtime?: MtimeLike
}

/**
 * File content in arbitrary (supported) representation. It is used in input
 * positions and is usually normalized to `Blob` in browser contexts and
 * `AsyncIterable<Uint8Array>` in node.
 */
export type ToContent =
  | string
  | InstanceType<typeof String>
  | ArrayBufferView
  | ArrayBuffer
  | Blob
  | AwaitIterable<Uint8Array>
  | ReadableStream<Uint8Array>

export type ToMode =
  | string
  | number

export interface BaseFile {
  cid: CID
  path: string
  name: string
}

export interface InputFile extends BaseFile {
  unixfs: undefined
}

export interface BrowserImportCandidate {
  path?: string,
  content?: Blob,
  mtime?: Mtime,
  mode?: number
}

/**
 * Represents a value that you can await on, which is either value or a promise
 * of one.
 */
export type Await<T> =
  | T
  | Promise<T>

/**
 * Represents an iterable that can be used in `for await` loops, that is either
 * iterable or an async iterable.
 */
export type AwaitIterable<T> =
  | Iterable<T>
  | AsyncIterable<T>

/**
 * Common options across all cancellable requests.
 */
export interface AbortOptions {
  /**
   * Can be provided to a function that starts a long running task, which will
   * be aborted when signal is triggered.
   */
  signal?: AbortSignal
  /**
   * Can be provided to a function that starts a long running task, which will
   * be aborted after provided timeout (in ms).
   */
  timeout?: number
}

export interface PreloadOptions {
  preload?: boolean
}

export type ToJSON =
  | null
  | string
  | number
  | boolean
  | ToJSON[]
  | { toJSON?: () => ToJSON } & { [key: string]: ToJSON }

/**
 * An IPFS path or CID
 */
export type IPFSPath = CID | string

export interface BufferStore {
  put: (key: Uint8Array, value: Uint8Array) => Promise<void>
  get: (key: Uint8Array) => Promise<Uint8Array>
  stores: any[]
}

export interface Blockstore {
  open: () => Promise<Void>

  /**
   * Query the store
   */
  query: (Query, options?: DatastoreOptions) => AsyncIterable<Block>

  /**
   * Query the store, returning only keys
   */
   queryKeys: (query: KeyQuery, options?: DatastoreOptions) => AsyncIterable<CID>

  /**
   * Get a single block by CID
   */
  get: (cid: CID, options?: DatastoreOptions) => Promise<Block>

  /**
   * Like get, but for more
   */
  getMany: (cids: AwaitIterable<CID>, options?: DatastoreOptions) => AsyncIterable<Block>

  /**
   * Write a single block to the store
   */
  put: (block: Block, options?: DatastoreOptions) => Promise<Block>

  /**
   * Like put, but for more
   */
  putMany: (blocks: AwaitIterable<Block>, options?: DatastoreOptions) => AsyncIterable<Block>

  /**
   * Does the store contain block with this CID?
   */
  has: (cid: CID, options?: DatastoreOptions) => Promise<boolean>

  /**
   * Delete a block from the store
   */
  delete: (cid: CID, options?: DatastoreOptions) => Promise<Void>

  /**
   * Delete a block from the store
   */
  deleteMany: (cids: AwaitIterable<any>, options?: DatastoreOptions) => AsyncIterable<Key>

  /**
   * Close the store
   */
  close: () => Promise<Void>
}
