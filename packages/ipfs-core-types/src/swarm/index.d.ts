import type { AbortOptions } from '../utils'
import { API as BitswapAPI } from '../bitswap'
import { API as RepoAPI } from '../repo'
import type CID from 'cids'
import type { Multiaddr } from 'multiaddr'

export interface API<OptionExtension = {}> {
    /**
   * List of known addresses of each peer connected
   */
  addrs: (options?: AbortOptions & OptionExtension) => Promise<AddrsResult[]>

  /**
   * Open a connection to a given address
   */
  connect: (addr: Multiaddr, options?: AbortOptions & OptionExtension) => Promise<void>

  /**
   * Close a connection to a given address
   */
  disconnect: (addr: Multiaddr, options?: AbortOptions & OptionExtension) => Promise<void>

  /**
   * Local addresses this node is listening on
   */
  localAddrs: (options?: AbortOptions & OptionExtension) => Promise<Multiaddr[]>

  /**
   * Return a list of connected peers
   */
  peers: (options?: PeersOptions & OptionExtension) => Promise<PeersResult[]>
}

export interface AddrsResult {
  id: string
  addrs: Multiaddr[]
}

export interface PeersOptions extends AbortOptions {
  direction?: boolean
  streams?: boolean
  verbose?: boolean
  latency?: boolean
}

export interface PeersResult {
  addr: Multiaddr
  peer: string
  latency?: string
  muxer?: string
  streams?: string[]
  direction?: 'inbound' | 'outbound'
}
