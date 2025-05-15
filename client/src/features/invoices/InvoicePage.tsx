import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import InvoiceModal from './InvoiceModal';

interface Invoice {
  id: string;
  vendor_name: string;
  amount: number;
  due_date: string;
  description: string | null;
  paid: boolean;
}

export default function InvoicePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: invoices, isLoading, isError } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      const res = await api.get('/invoices');
      return res.data;
    },
  });

  if (isLoading)
    return <p className="p-6 text-lg font-medium text-gray-600">Loading invoices...</p>;
  if (isError)
    return <p className="p-6 text-lg font-semibold text-red-500">Failed to load invoices.</p>;

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Invoices</h2>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider max-w-xs">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices!.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedId(inv.id)}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{inv.vendor_name}</td>
                  <td className="px-6 py-4 text-gray-700">${inv.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        inv.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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

        {selectedId && <InvoiceModal id={selectedId} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
    <Footer />
    </>
  );
}
