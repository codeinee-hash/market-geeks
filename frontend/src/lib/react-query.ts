import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 минут данные считаются абсолютно свежими
        gcTime: 10 * 60 * 1000,    // 10 минут сохранять данные в кэше памяти
        refetchOnWindowFocus: false, // не спамить запросами при смене фокуса вкладки
        refetchOnMount: true,       // если данные свежие (< 5 мин) — мгновенно из кэша без запроса. Если инвалидированы (stale) — фоновое обновление.
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // На сервере всегда создаем новый инстанс
    return makeQueryClient()
  } else {
    // На клиенте создаем один инстанс и переиспользуем его
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
