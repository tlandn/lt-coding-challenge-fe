import { render, screen } from './test-utils'
import TokenInput from '../components/TokenInput'

const selectData = [
  { value: 'ETH', label: 'ETH' },
  { value: 'BTC', label: 'BTC' },
  { value: 'USDC', label: 'USDC' },
]

describe('TokenInput', () => {
  it('renders the label', () => {
    render(
      <TokenInput
        label="Amount to send"
        value=""
        onChange={() => {}}
        token="ETH"
        onTokenChange={() => {}}
        selectData={selectData}
        price={0}
      />,
    )
    expect(screen.getByText('Amount to send')).toBeInTheDocument()
  })

  it('shows USD value when price > 0 and value is entered', () => {
    render(
      <TokenInput
        label="Amount to send"
        value="2"
        onChange={() => {}}
        token="ETH"
        onTokenChange={() => {}}
        selectData={selectData}
        price={1000}
      />,
    )
    expect(screen.getByText(/\$2,000\.00/)).toBeInTheDocument()
  })

  it('does not show USD value when price is 0', () => {
    render(
      <TokenInput
        label="Amount to send"
        value="2"
        onChange={() => {}}
        token="ETH"
        onTokenChange={() => {}}
        selectData={selectData}
        price={0}
      />,
    )
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
  })

  it('does not show USD value when value is empty', () => {
    render(
      <TokenInput
        label="Amount to send"
        value=""
        onChange={() => {}}
        token="ETH"
        onTokenChange={() => {}}
        selectData={selectData}
        price={1000}
      />,
    )
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
  })
})
