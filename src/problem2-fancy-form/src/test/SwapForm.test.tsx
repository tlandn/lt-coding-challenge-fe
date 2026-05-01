import { render, screen, waitFor } from './test-utils'
import userEvent from '@testing-library/user-event'
import SwapForm from '../components/SwapForm'

const mockPrices = [
  { currency: 'ETH', date: '2023-08-29T07:10:52.000Z', price: 1645.93 },
  { currency: 'BTC', date: '2023-08-29T07:10:52.000Z', price: 26002.82 },
  { currency: 'USDC', date: '2023-08-29T07:10:40.000Z', price: 1 },
  { currency: 'BLUR', date: '2023-08-29T07:10:40.000Z', price: 0.208 },
]

function mockFetchSuccess() {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    json: () => Promise.resolve(mockPrices),
  } as Response)
}

beforeEach(() => {
  mockFetchSuccess()
});

afterEach(() => {
  vi.restoreAllMocks()
})

describe('SwapForm', () => {
  
  it('renders the Swap title', async () => {
    render(<SwapForm />)
    expect(screen.getByText('Swap')).toBeInTheDocument()
    await screen.findByText('Live', {}, { timeout: 5000 })
  })

  it('shows loading state initially', async () => {
    render(<SwapForm />)
    expect(screen.getByText('Loading prices...')).toBeInTheDocument()
    await screen.findByText('Live', {}, { timeout: 5000 })
  })

  it('shows error state when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))
    render(<SwapForm />)
    await waitFor(() => {
      expect(screen.getByText('Failed to load price data. Please try again later.')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('renders token inputs after successful fetch', async () => {
    render(<SwapForm />)
    await waitFor(() => {
      expect(screen.getByText('Amount to send')).toBeInTheDocument()
      expect(screen.getByText('Amount to receive')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('swaps from/to tokens when swap button is clicked', async () => {
    render(<SwapForm />)

    await waitFor(() => {
      expect(screen.getByText('Live')).toBeInTheDocument()
    }, { timeout: 5000 })

    const swapButton = screen.getByRole('button', { name: /swap/i })
    await userEvent.click(swapButton)

    await waitFor(() => {
      expect(screen.getByText('Rate')).toBeInTheDocument()
    })
  })

  it('displays rate when both tokens are selected and prices are loaded', async () => {
    render(<SwapForm />)

    await waitFor(() => {
      expect(screen.getByText(/^1 .+ =/)).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('confirm swap button is disabled when no amount is entered', async () => {
    render(<SwapForm />)

    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: /confirm swap/i })
      expect(confirmBtn).toBeDisabled()
    }, { timeout: 5000 })
  })
})
