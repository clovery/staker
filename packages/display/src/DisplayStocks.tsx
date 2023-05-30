import React from 'react'
import dayjs from 'dayjs'
import { render, Text } from 'ink'

import Table from './Table.js'

const CustomCell = (props: React.PropsWithChildren<{}>) => {
  const { children } = props

  return <Text>{children}</Text>
}

type PropTypes = {
  stocks: any[]
}

export const DisplayStocks = (props: PropTypes) => {
  render(
    <>
      <Text>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</Text>
      <Table data={props.stocks} cell={CustomCell} />
    </>
  )
}

export const DisplayStocks2 = (props: PropTypes) => {
  console.clear()
  console.table(props.stocks)
}

export const table = ({ data }: { data: Record<string, any>[] }) => {
  render(
    <Table data={data} />
  )
}
