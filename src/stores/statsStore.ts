import { create } from 'zustand'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { VaultStats } from '@/models/stats/vaultStats'
import { CacheStats } from '@/models/stats/cacheStats'

interface StatsStore {
  cacheStats: CacheStats
  cacheStatsLastUpdated: number | null
  cacheStatsLoading: boolean
  cacheStatsError: string | null

  getVaultStats: (payload: WSCommandPayload<'stats.vault'>) => Promise<VaultStats>
  getCacheStats: (payload: WSCommandPayload<'stats.cache'>) => Promise<CacheStats>

  refreshCacheStats: () => Promise<CacheStats>
  startCacheStatsPolling: (intervalMs?: number) => void
  stopCacheStatsPolling: () => void

  // internal
  _cacheStatsPoller: number | null
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  cacheStats: new CacheStats({}),
  cacheStatsLastUpdated: null,
  cacheStatsLoading: false,
  cacheStatsError: null,

  _cacheStatsPoller: null,

  async getVaultStats(vault_id) {
    const ws = useWebSocketStore.getState()
    await ws.waitForConnection()

    const response = await ws.sendCommand('stats.vault', vault_id)
    return response.stats
  },

  async getCacheStats() {
    const ws = useWebSocketStore.getState()
    await ws.waitForConnection()

    const response = await ws.sendCommand('stats.cache', null)
    return response.stats
  },

  async refreshCacheStats() {
    // prevent dogpiling if multiple components call refresh at once
    if (get().cacheStatsLoading) return get().cacheStats

    set({ cacheStatsLoading: true, cacheStatsError: null })
    try {
      const stats = await get().getCacheStats(null as any) // payload unused; keep signature if you want
      const next = new CacheStats(stats ?? {})
      set({ cacheStats: next, cacheStatsLastUpdated: Date.now(), cacheStatsLoading: false })
      return next
    } catch (e: any) {
      set({ cacheStatsLoading: false, cacheStatsError: e?.message ?? 'Failed to fetch cache stats' })
      return get().cacheStats
    }
  },

  startCacheStatsPolling(intervalMs = 7500) {
    // already polling
    if (get()._cacheStatsPoller) return

    // instant refresh so UI updates immediately
    void get().refreshCacheStats()

    const id = window.setInterval(() => {
      void get().refreshCacheStats()
    }, intervalMs)

    set({ _cacheStatsPoller: id })
  },

  stopCacheStatsPolling() {
    const id = get()._cacheStatsPoller
    if (id) {
      window.clearInterval(id)
      set({ _cacheStatsPoller: null })
    }
  },
}))
