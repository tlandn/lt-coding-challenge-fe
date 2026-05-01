import { Group, Paper, Text, Select, NumberInput, Image } from '@mantine/core'
import '../index.css'

const paperStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
}

const selectStyles = {
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', height: 48 },
  dropdown: { background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' },
  option: { color: 'white' },
}

function numberInputStyles(dimmed: boolean) {
  return {
    input: {
      background: 'transparent', border: 'none', color: dimmed ? 'rgba(255,255,255,0.6)' : 'white',
      fontSize: 28, fontWeight: 600, height: 48,
      textAlign: 'right' as const, paddingRight: 0,
    },
  }
}

function formatUSD(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface TokenInputProps {
  label: string
  value: string | number
  onChange: (v: string) => void
  token: string
  onTokenChange: (value: string | null) => void
  selectData: { value: string; label: string }[]
  price: number
  readOnly?: boolean
  dimmedAmount?: boolean
  loading?: boolean
}

export default function TokenInput({
  label, value, onChange, token, onTokenChange,
  selectData, price, readOnly, dimmedAmount, loading,
}: TokenInputProps) {
  const showUSD = price > 0 && value !== '' && parseFloat(String(value)) > 0

  return (
    <Paper p="md" radius="lg" style={paperStyle}>
      <Text size="sm" c="dimmed" mb={8}>{label}</Text>
      <Group gap="xs" align="flex-end">
        <Select
          data={selectData}
          value={token}
          onChange={onTokenChange}
          w={140}
          comboboxProps={{ withinPortal: false }}
          renderOption={({ option }) => (
            <Group gap="xs" px={4}>
              <Image src={`/tokens/${option.value}.svg`} w={24} h={24} />
              <Text size="sm" fw={600}>{option.value}</Text>
            </Group>
          )}
          styles={selectStyles}
          classNames={{ option: 'select-option' }}
        />
        <div style={{ flex: 1 }}>
          <div className={loading ? 'input-loading' : undefined}>
            <NumberInput
              value={value}
              onChange={v => onChange(String(v ?? ''))}
              placeholder="0.0"
              decimalScale={6}
              hideControls
              readOnly={readOnly}
              size="lg"
              styles={numberInputStyles(!!dimmedAmount && !loading)}
            />
          </div>
        </div>
      </Group>
      {showUSD && !loading && (
        <Text size="xs" c="dimmed" ta="right" mt={4}>
          ~${formatUSD(parseFloat(String(value)) * price)}
        </Text>
      )}
    </Paper>
  )
}
