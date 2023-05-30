import { SinaJs } from '../trader/sinajs/sinajs'

export const Stock = {
  get: SinaJs.fetchStock,
  search: SinaJs.searchStock
}
