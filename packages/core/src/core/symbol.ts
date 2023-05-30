export function toSymbol(code: string) {
  const INDEX_LABELS = ['sh', 'sz', 'hs300', 'sz50', 'cyb', 'zxb', 'zx300', 'zh500']
  const INDEX_LIST = {
    'sh': 'sh000001',
    'sz': 'sz399001',
    'hs300': 'sh000300',
    'sz50': 'sh000016',
    'zxb': 'sz399005',
    'cyb': 'sz399006',
    'zx300': 'sz399008'
  }

  if (INDEX_LABELS.includes(code)) {
    return INDEX_LIST[code];
  } else if (code.substr(0, 3) === 'gb_') {
    return code;
  } else {
    if (code.length !== 6) {
      return code;
    } else {
      return 'sh' + code;
    }
  }
}

export function toSymbols(code: string[] | string) {
  let codes: string[] = []
  if (typeof code === 'string') {
    codes = code.split(',');
  } else {
    codes = code;
  }

  return codes.map(toSymbol)
}
