import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useState } from 'react';
import InvoiceModal from '../features/invoices/InvoiceModal';

interface Invoice {
  id: string;
  vendor_name: string;
  amount: number;
  due_date: string;
  description: string | null;
  paid: boolean;
}

export default function InvoicePage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'vendor_name' | 'amount' | 'due_date' | 'paid'>('due_date');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoices', page, sortBy, order],
    queryFn: async () => {
      const res = await api.get('/invoices', {
        params: { page, limit, sortBy, order },
      });
      return res.data;
    },
  });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  if (isLoading)
    return <p className="p-6 text-gray-600 dark:text-gray-400">Loading invoices...</p>;

  if (isError)
    return <p className="p-6 text-red-600 dark:text-red-400">Failed to load invoices.</p>;

  return (
    <div className="bg-white max-w-7xl dark:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6">Invoices</h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {[
                { label: 'Vendor', key: 'vendor_name' },
                { label: 'Amount', key: 'amount' },
                { label: 'Due Date', key: 'due_date' },
                { label: 'Paid', key: 'paid' },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as typeof sortBy)}
                  className="px-6 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider cursor-pointer select-none"
                >
                  {label}
                  {sortBy === key && <span className="ml-1">{order === 'asc' ? '↑' : '↓'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.data.map((inv: Invoice) => (
              <tr
                key={inv.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => setSelectedId(inv.id)}
              >
                <td className="px-6 py-4 font-medium">{inv.vendor_name}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-200">${inv.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {new Date(inv.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      inv.paid
                        ? 'bg-green-100 text-green-800 dark:bg-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200'
                    }`}
                  >
                    {inv.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-gray-700 dark:text-gray-400">
          Page {data.page} of {data.totalPages}
        </span>
        <button
          onClick={() => setPage((p) => (p < data.totalPages ? p + 1 : p))}
          disabled={page === data.totalPages}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {selectedId && <InvoiceModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
