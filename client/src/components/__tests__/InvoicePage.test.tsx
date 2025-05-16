import { within } from '@testing-library/react';


jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('../../features/invoices/InvoiceModal', () => ({
  __esModule: true,
  default: ({ id, onClose }: any) => (
    <div data-testid="invoice-modal">
      Invoice Modal Opened for ID: {id}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import InvoicePage from '../../pages/InvoicePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../../api/axios';

const createTestClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderWithClient = (ui: React.ReactNode) =>
  render(<QueryClientProvider client={createTestClient()}>{ui}</QueryClientProvider>);

describe('InvoicePage', () => {
  afterEach(() => jest.clearAllMocks());

  const mockData = {
    data: [
      {
        id: '1',
        vendor_name: 'Acme Corp',
        amount: 1500,
        due_date: '2024-12-31',
        description: 'Consulting',
        paid: true,
      },
    ],
    page: 1,
    totalPages: 2,
  };

  it('shows loading initially', async () => {
    (api.get as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithClient(<InvoicePage />);
    expect(screen.getByText(/loading invoices/i)).toBeInTheDocument();
  });

  it('shows error message on failure', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    renderWithClient(<InvoicePage />);
    expect(await screen.findByText(/failed to load invoices/i)).toBeInTheDocument();
  });

  it('renders invoice table', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
    renderWithClient(<InvoicePage />);
    expect(await screen.findByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('$1500.00')).toBeInTheDocument();
    const row = screen.getByText('Acme Corp').closest('tr');
    expect(within(row!).getByText('Paid')).toBeInTheDocument();  });

  it('opens modal when a row is clicked', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });
    renderWithClient(<InvoicePage />);
    fireEvent.click(await screen.findByText('Acme Corp'));
    expect(await screen.findByTestId('invoice-modal')).toBeInTheDocument();
  });

  it('navigates to next page', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });
    renderWithClient(<InvoicePage />);
    const next = await screen.findByText(/next/i);
    fireEvent.click(next);
    await waitFor(() => {
      expect(api.get).toHaveBeenLastCalledWith('/invoices', expect.objectContaining({
        params: expect.objectContaining({ page: 2 }),
      }));
    });
  });

  it('toggles sort when clicking column header', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });
    renderWithClient(<InvoicePage />);
    const header = await screen.findByText('Due Date');
    fireEvent.click(header); // sort asc
    fireEvent.click(header); // sort desc
    await waitFor(() => {
      expect(api.get).toHaveBeenLastCalledWith('/invoices', expect.objectContaining({
        params: expect.objectContaining({ sortBy: 'due_date', order: 'desc' }),
      }));
    });
  });
});
