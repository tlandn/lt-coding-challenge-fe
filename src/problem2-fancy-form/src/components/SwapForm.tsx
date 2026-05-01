import { useState, useEffect, useMemo } from 'react'
import {
  Paper, Text, Button, Group, Stack, Loader, Tooltip,
} from '@mantine/core'
import { IconArrowsExchange, IconInfoCircle, IconCheck } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import TokenInput from './TokenInput'
import { formatRate } from '../utils/formatRate'

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
}

export default function SwapForm() {
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [pricesLoading, setPricesLoading] = useState(true)
  const [pricesError, setPricesError] = useState(false)
  const [rotating, setRotating] = useState(false)
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [fromAmount, setFromAmount] = useState('')

  const [allCurrencies, setAllCurrencies] = useState<string[]>([])

  const fromPrice = prices[fromToken] ?? 0
  const toPrice = prices[toToken] ?? 0
  const rate = fromPrice && toPrice ? fromPrice / toPrice : 0

  const [calculating, setCalculating] = useState(false)

  const toAmount = useMemo(() => {
    const num = parseFloat(fromAmount)
    if (!fromAmount || isNaN(num) || !rate) return ''
    return Number((num * rate).toFixed(6))
  }, [fromAmount, rate])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}prices.json`)
      .then(r => r.json())
      .then((data: { currency: string; price: number }[]) => {
        const map: Record<string, number> = {}
        for (const entry of data) {
          map[entry.currency] = entry.price
        }
        const currencies = Object.keys(map)
        setPrices(map)
        setAllCurrencies(currencies)
        setFromToken(currencies[0] ?? '')
        setToToken(currencies[1] ?? '')
      })
      .catch(() => setPricesError(true))
      .finally(() => {
        const delay = 600 + Math.random() * 600
        setTimeout(() => setPricesLoading(false), delay)
      })
  }, [])

  useEffect(() => {
    if (!fromAmount || isNaN(parseFloat(fromAmount)) || !rate) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalculating(true)
    const timer = setTimeout(() => setCalculating(false), 300 + Math.random() * 200)
    return () => clearTimeout(timer)
  }, [fromAmount, rate])

  const selectData = useMemo(
    () => allCurrencies.map(s => ({ value: s, label: s })),
    [allCurrencies],
  )

  const handleSwap = () => {
    setRotating(true)
    setTimeout(() => setRotating(false), 400)
    setFromToken(toToken)
    setToToken(fromToken)
  }

  const handleFromTokenChange = (value: string | null) => {
    if (!value) return
    setFromToken(value)
  }

  const handleToTokenChange = (value: string | null) => {
    if (!value) return
    setToToken(value)
  }

  return (
    <div className="page-wrapper">
      <Paper
        p={{ base: 'md', sm: 'xl' }}
        radius="xl"
        w="100%"
        maw={480}
        style={cardStyle}
      >
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Text fw={700} size="xl" c="white">Swap</Text>
            <Group gap={4}>
              {pricesLoading && <Loader size="xs" color="gray" />}
              <Text size="xs" c="dimmed">
                {pricesLoading ? 'Loading prices...' : pricesError ? 'Error' : 'Live'}
              </Text>
            </Group>
          </Group>

          {pricesError && (
            <Text c="red" size="sm">Failed to load price data. Please try again later.</Text>
          )}

          <TokenInput
            label="Amount to send"
            value={fromAmount}
            onChange={setFromAmount}
            token={fromToken}
            onTokenChange={handleFromTokenChange}
            selectData={selectData}
            price={fromPrice}
          />

          <Group justify="center" style={{ margin: '-12px 0' }}>
            <Button
              variant="subtle" size="sm" radius="xl" p={8}
              onClick={handleSwap}
              style={{
                background: 'rgba(99, 102, 241, 0.2)',
                border: '4px solid rgba(15, 12, 41, 1)',
                cursor: 'pointer',
              }}
            >
              <IconArrowsExchange
                size={22} color="#818cf8"
                style={{
                  transform: rotating ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.4s ease',
                }}
              />
            </Button>
          </Group>

          <TokenInput
            label="Amount to receive"
            value={toAmount}
            onChange={() => { }}
            token={toToken}
            onTokenChange={handleToTokenChange}
            selectData={selectData}
            price={toPrice}
            readOnly
            dimmedAmount
            loading={calculating}
          />

          {rate > 0 && (
            <Paper
              p="sm"
              radius="lg"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Rate</Text>
                <Group gap={4}>
                  <Text size="sm" c="white">
                    1 {fromToken} = {formatRate(rate)} {toToken}
                  </Text>
                  <Tooltip label="Exchange rate based on live price feed" withArrow>
                    <IconInfoCircle size={14} color="gray" style={{ cursor: 'pointer' }} />
                  </Tooltip>
                </Group>
              </Group>
            </Paper>
          )}

          <Button
            fullWidth
            size="lg"
            radius="lg"
            disabled={!fromAmount || parseFloat(fromAmount) <= 0 || !rate || calculating}
            onClick={() => notifications.show({
              title: 'Swap executed',
              message: `${fromAmount} ${fromToken} → ${toAmount} ${toToken}`,
              color: 'green',
              icon: <IconCheck size={18} />,
              autoClose: 5000,
            })}
            styles={{
              root: {
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                height: 48,
                fontSize: 16,
                fontWeight: 700,
              },
            }}
          >
            CONFIRM SWAP
          </Button>
        </Stack>
      </Paper>
    </div>
  )
}
