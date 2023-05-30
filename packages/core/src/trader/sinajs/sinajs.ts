import axios, { Method } from 'axios'
import _ from 'lodash'
import { decode } from 'iconv-lite'

import { parseStockData } from './parser'
import { randomHeaders } from '../../core/headers'
import { toSymbols } from '../../core/symbol'

export const SinaJs = {
  fetchStock: async (code: string | string[]) => {
    const symbols = toSymbols(code)
    const url = `https://hq.sinajs.cn/list=${symbols.join(',')}`;

    try {
      const data = await request(url)
      const stocks = data.split(';\n')

      return stocks.filter(Boolean).map(parseStockData)
    } catch (error) { }
  },
  searchStock
}

type ISearchStockResult = {
  name: string
  code: string
  symbol: string
}

function parseSearchStock(line: string): ISearchStockResult {
  const obj: Record<string, string> = {}
  const keys = ["name", "num1", "code", "symbol", "name2", "empty1", "empty2", "num3", "num4", "type"];
  const values = line.split(",")
  keys.forEach((key, i) => {
    obj[key] = values[i]
  });

  return {
    name: obj.name,
    code: obj.code,
    symbol: obj.symbol
  }
}

async function searchStock(keyword: string): Promise<ISearchStockResult[]> {
  const data = await request(`https://suggest3.sinajs.cn/suggest/key=${encodeURIComponent(keyword)}`)
  const lines = _.trimStart(data, 'var suggestvalue="').split(';')

  return lines.filter(Boolean).map((line) => parseSearchStock(line))
}


async function request(url: string, method: Method = 'get') {
  try {
    const res = await axios({
      method,
      url,
      // axios 乱码解决
      responseType: 'arraybuffer',
      transformResponse: [
        (data) => {
          const body = decode(data, 'GB18030');
          return body;
        },
      ],
      headers: {
        ...randomHeaders(),
        Referer: 'http://finance.sina.com.cn/',
      },
    })

    return <string>res.data
  } catch (error) { }
}
