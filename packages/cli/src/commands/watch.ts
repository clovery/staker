import _ from 'lodash'
import * as emoji from 'node-emoji'
import checkbox from '@inquirer/checkbox';
import Staker from '@staker/core'
import * as StakerDisplay from '@staker/display'
import { DisplayStocks } from '@staker/display'

import { IWatchStocks, conf } from '../settings.js'

let timer: NodeJS.Timeout

function displayStocks(symbols: string | string[], options: IWatchOptions = DefaultWatchOptions) {
  clearTimeout(timer)

  Staker.Stock.get(symbols).then((data) => {
    const pickedData = _.map(data, _.partialRight(_.pick, ['name', 'price', 'percent', 'low', 'high']));

    if (Array.isArray(pickedData) && pickedData.length > 0) {
      DisplayStocks({ stocks: pickedData })
    }
  })

  timer = setTimeout(() => displayStocks(symbols, options), options.interval * 1000)
}

export type IWatchOptions = {
  interval: number
}

const DefaultWatchOptions: IWatchOptions = {
  interval: 1
}

export default {
  watch(watch: string | string[], options: IWatchOptions = DefaultWatchOptions) {
    let symbols = watch
    if ((typeof watch === 'boolean' && watch === true) || !watch) {
      symbols = (conf.get('watch.stocks') as IWatchStocks).map((stock: any) => stock['symbol']) as string[]
    }

    if (_.isEmpty(symbols)) {
      console.log(`${emoji.get('mag')} 没有可观测的股票代号!`)
      process.exit(1)
    }

    displayStocks(symbols, options)
  },

  list() {
    StakerDisplay.table({ data: conf.get('watch.stocks') as Record<string, any>[] })
  },

  async add(symbols: string) {
    const stocks = await Staker.Stock.search(symbols)
    const confWatchStocks: IWatchStocks = (conf.get('watch.stocks') || []) as IWatchStocks
    let willStoreWatchStocks: IWatchStocks = []

    if (_.isEmpty(stocks)) {
      console.log(`${emoji.get('mag')} 搜索到相关股票!`)
      process.exit(1)
    }

    if (stocks.length > 1) {
      willStoreWatchStocks = await checkbox({
        message: 'Select stocks to watch',
        choices: stocks.map((stock) => {
          return {
            name: `${stock.name} (${stock.symbol})`,
            value: {
              name: stock.name,
              symbol: stock.symbol
            }
          }
        })
      })
      if (_.isEmpty(willStoreWatchStocks)) {
        console.log(`${emoji.get('mag')} 没有选择股票!`)
        process.exit(1)
      }
    } else {
      const stock = stocks[0]
      if (stock) {
        willStoreWatchStocks = [{
          name: stock.name,
          symbol: stock.symbol
        }]
      }
    }

    willStoreWatchStocks = _.uniqBy(confWatchStocks.concat(willStoreWatchStocks), 'symbol')

    conf.set('watch.stocks', willStoreWatchStocks)
    console.log(emoji.get('white_check_mark'), '添加成功!')
  },

  remove(symbols: string) {
    const watchStocks = conf.get('watch.stocks') as IWatchStocks

    const nextWatchStocks = watchStocks.filter((stock) => {
      return !(symbols.includes(stock.symbol) || symbols.includes(stock.name))
    })

    conf.set('watch.stocks', nextWatchStocks)
  }
}
