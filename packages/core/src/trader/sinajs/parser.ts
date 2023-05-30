import { suffix, toFixed } from '../../core/format.js';


export function parseStockData(data: string) {
  if (!data) {
    return null
  }

  const pairs = data.split('="')
  const params: string[] = data.split('="')[1].split(',');

  const item = {
    code: pairs[0].replace('var hq_str_', ''),
    name: params[0],
    open: parseFloat(params[1]),
    close: parseFloat(params[2]),
    price: params[3],
    high: parseFloat(params[4]),
    low: parseFloat(params[5]),
  };

  let yestclose = params[2];
  let price = +params[3]

  // 竞价阶段部分开盘和价格为0.00导致显示 -100%
  try {
    if (Number(item.open) <= 0) {
      price = +yestclose;
    }
  } catch (err) {
    console.error(err);
  }

  const updown = +price - +yestclose
  const percent = +((+updown >= 0 ? '+' : '-') + (Math.abs(+updown) / +yestclose) * 100)

  const result = {
    ...item,
    price,
    percent
  }

  return format(result)
}

type IStock = {
  price: number;
  percent: number;
  name: string;
  open: number;
  close: number;
  high: number;
  low: number;
}

function format(stock: IStock) {
  return {
    ...stock,
    high: toFixed(stock.high),
    low: toFixed(stock.low),
    price: toFixed(stock.price),
    percent: suffix(toFixed(stock.percent), '%')
  }
}
