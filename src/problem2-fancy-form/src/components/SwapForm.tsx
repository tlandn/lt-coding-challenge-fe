import { useState, useEffect, useMemo } from 'react'
import {
  Paper, Text, Button, Group, Stack, Select, NumberInput, Image,
  Loader, Tooltip,
} from '@mantine/core'
import { IconArrowsExchange, IconInfoCircle } from '@tabler/icons-react'

function getIconSrc(symbol: string) {
  return `/tokens/${symbol}.svg`
}

export default function SwapForm() {
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [pricesLoading, setPricesLoading] = useState(true)
  const [rotating, setRotating] = useState(false)
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [fromAmount, setFromAmount] = useState<string>('')

  const [allCurrencies, setAllCurrencies] = useState<string[]>([])

  const fromPrice = prices[fromToken] ?? 0
  const toPrice = prices[toToken] ?? 0
  const rate = fromPrice && toPrice ? fromPrice / toPrice : 0

  const toAmount = useMemo(() => {
    const num = parseFloat(fromAmount)
    if (!fromAmount || isNaN(num) || !rate) return '' as number | ''
    return Number((num * rate).toFixed(6))
  }, [fromAmount, rate])

  useEffect(() => {
    fetch('/prices.json')
      .then(r => r.json())
      .then((data: { currency: string; price: number }[]) => {
        const map: Record<string, number> = {}
        const seen = new Set<string>()
        for (const entry of data) {
          map[entry.currency] = entry.price
          seen.add(entry.currency)
        }
        const currencies = Array.from(seen)
        setPrices(map)
        setAllCurrencies(currencies)
        setFromToken(currencies[0] ?? '')
        setToToken(currencies[1] ?? '')
      })
      .catch(() => {})
      .finally(() => setPricesLoading(false))
  }, [])

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

  const handleSelect = (key: 'from' | 'to', value: string | null) => {
    if (!value) return
    if (key === 'from') {
      setFromToken(value)
      if (value === toToken) setToToken(fromToken)
    } else {
      setToToken(value)
      if (value === fromToken) setFromToken(toToken)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        padding: 20,
      }}
    >
      <Paper
        p={{ base: 'md', sm: 'xl' }}
        radius="xl"
        w="100%"
        maw={480}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Text fw={700} size="xl" c="white">
              Swap
            </Text>
            <Group gap={4}>
              {pricesLoading && <Loader size="xs" color="gray" />}
              <Text size="xs" c="dimmed">
                {pricesLoading ? 'Loading prices...' : 'Live'}
              </Text>
            </Group>
          </Group>

          {/* FROM */}
          <Paper
            p="md"
            radius="lg"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Text size="sm" c="dimmed" mb={8}>
              You pay
            </Text>
            <Group gap="xs" align="flex-end">
              <Select
                data={selectData}
                value={fromToken}
                onChange={v => handleSelect('from', v)}
                w={140}
                comboboxProps={{ withinPortal: false }}
                renderOption={({ option }) => (
                  <Group gap="xs" px={4}>
                    <Image src={getIconSrc(option.value)} w={24} h={24} />
                    <Text size="sm" fw={600}>{option.value}</Text>
                  </Group>
                )}
                styles={{
                  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', height: 48 },
                  dropdown: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' },
                  option: { color: 'white', '&[data-hovered]': { background: 'rgba(255,255,255,0.08)' }, '&[data-selected]': { background: 'rgba(99, 102, 241, 0.3)' } },
                }}
              />
              <div style={{ flex: 1 }}>
                <NumberInput
                  value={fromAmount}
                  onChange={v => setFromAmount(String(v ?? ''))}
                  placeholder="0.0"
                  decimalScale={6}
                  hideControls
                  size="lg"
                  styles={{
                    input: {
                      background: 'transparent', border: 'none', color: 'white',
                      fontSize: 28, fontWeight: 600, height: 48,
                      textAlign: 'right', paddingRight: 0,
                    },
                  }}
                />
              </div>
            </Group>
            {fromPrice > 0 && fromAmount && parseFloat(fromAmount) > 0 && (
              <Text size="xs" c="dimmed" ta="right" mt={4}>
                ~${(parseFloat(fromAmount) * fromPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            )}
          </Paper>

          {/* SWAP */}
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

          {/* TO */}
          <Paper
            p="md"
            radius="lg"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Text size="sm" c="dimmed" mb={8}>
              You receive
            </Text>
            <Group gap="xs" align="flex-end">
              <Select
                data={selectData}
                value={toToken}
                onChange={v => handleSelect('to', v)}
                w={140}
                comboboxProps={{ withinPortal: false }}
                renderOption={({ option }) => (
                  <Group gap="xs" px={4}>
                    <Image src={getIconSrc(option.value)} w={24} h={24} />
                    <Text size="sm" fw={600}>{option.value}</Text>
                  </Group>
                )}
                styles={{
                  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', height: 48 },
                  dropdown: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' },
                  option: { color: 'white', '&[data-hovered]': { background: 'rgba(255,255,255,0.08)' }, '&[data-selected]': { background: 'rgba(99, 102, 241, 0.3)' } },
                }}
              />
              <div style={{ flex: 1 }}>
                <NumberInput
                  value={toAmount}
                  readOnly
                  placeholder="0.0"
                  decimalScale={6}
                  hideControls
                  size="lg"
                  styles={{
                    input: {
                      background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
                      fontSize: 28, fontWeight: 600, height: 48,
                      textAlign: 'right', paddingRight: 0,
                    },
                  }}
                />
              </div>
            </Group>
            {toPrice > 0 && toAmount && (
              <Text size="xs" c="dimmed" ta="right" mt={4}>
                ~${(Number(toAmount) * toPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            )}
          </Paper>

          {/* RATE */}
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
                    1 {fromToken} = {rate < 0.0001 ? rate.toFixed(8) : rate < 1 ? rate.toFixed(6) : rate.toFixed(4)} {toToken}
                  </Text>
                  <Tooltip label="Exchange rate based on live price feed" withArrow>
                    <IconInfoCircle size={14} color="gray" style={{ cursor: 'pointer' }} />
                  </Tooltip>
                </Group>
              </Group>
            </Paper>
          )}

        </Stack>
      </Paper>
    </div>
  )
}
