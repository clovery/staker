#!/usr/bin/env node

import { program, Command } from 'commander'
import Staker from '@staker/core'
import Watch, { IWatchOptions } from './commands/watch.js'

program
  .version('v0.0.1')
  .option('-w, --watch [symbols]', 'watch specified symbols.')
  .action(() => {
    const options = program.opts()

    if ('watch' in options) {
      Watch.watch(options['watch'])
    }
  })

program.command('search')
  .argument('<keyword>', 'search stock by keyword.')
  .action((keyword) => {
    Staker.Stock.search(keyword).then((data) => console.log(data))
  })

program
  .command('watch')
  .argument('[symbols]', 'remove symbols from watched list.')
  .option('-i, --interval [interval]', 'set interval to fetch data.')
  .addCommand(
    new Command().name('add')
      .argument('<symbols>', 'add symbols to watch list.')
      .action((symbols) => {
        Watch.add(symbols)
      })
  )
  .addCommand(
    new Command().name('remove')
      .argument('<symbols>', 'remove symbols from watched list.')
      .action((symbols) => {
        Watch.remove(symbols)
      })
  )
  .addCommand(
    new Command().name('list')
      .action(() => {
        Watch.list()
      })
  )
  .action((symbols: string, options: IWatchOptions) => {
    Watch.watch(symbols, options)
  })


program.parse(process.argv)
