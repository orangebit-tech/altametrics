jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

import { render, screen, fireEvent } from '@testing-library/react';
import InvoiceModal from '../../features/invoices/InvoiceModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../api/axios';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // don't retry failed queries in tests
      },
    },
  });

const renderWithClient = (ui: React.ReactNode) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('InvoiceModal', () => {
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading initially', () => {
    (api.get as jest.Mock).mockReturnValue(new Promise(() => {})); // never resolves
    renderWithClient(<InvoiceModal id="1" onClose={onClose} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows invoice data after successful fetch', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        id: '1',
        vendor_name: 'Acme Corp',
        amount: 199.99,
        due_date: '2024-12-31',
        description: 'Website development',
        paid: true,
      },
    });

    renderWithClient(<InvoiceModal id="1" onClose={onClose} />);

    expect(await screen.findByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('$199.99')).toBeInTheDocument();
    expect(screen.getByText(new Date('2024-12-31').toLocaleDateString())).toBeInTheDocument();
    expect(screen.getByText('Website development')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Failed'));

    renderWithClient(<InvoiceModal id="1" onClose={onClose} />);
    expect(await screen.findByText(/failed to load invoice/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
        data: {
            id: '1',
            vendor_name: 'Acme Corp',
            amount: 199.99,
            due_date: '2024-12-31',
            description: 'Website development',
            paid: true,
        },
    });

    renderWithClient(<InvoiceModal id="1" onClose={onClose} />);
    const button = await screen.findByRole('button', { name: /close/i });
    fireEvent.click(button);
    expect(onClose).toHaveBeenCalled();
  });
});
