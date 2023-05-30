import { homedir } from 'os'
import Conf from 'conf';
import path from 'path'
import fs from 'fs'

export const conf = new Conf({
  projectName: 'staker',
  configName: 'settings',
})

export const Settings = {
  read() {
    return readSettingsJson()
  },
  write(json: Object) {
    conf.set<any>(json)
    writeSettingsJson(json)
  }
}

export function readSettingsJson() {
  const userHomeDir = homedir()
  const settingsJson = path.join(userHomeDir, '.staker', 'settings.json')
  return JSON.parse(fs.readFileSync(settingsJson, 'utf8'))
}

export function writeSettingsJson(json: Object) {
  const userHomeDir = homedir()
  const settingsJson = path.join(userHomeDir, '.staker', 'settings.json')
  return fs.writeFileSync(settingsJson, JSON.stringify(json, null, 2))
}


export type IWatchOption = {
  name: string
  symbol: string
}

export type IWatchStocks = IWatchOption[]
