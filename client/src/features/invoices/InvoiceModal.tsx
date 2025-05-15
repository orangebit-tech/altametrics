import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

interface Props {
  id: string;
  onClose: () => void;
}

interface Invoice {
  id: string;
  vendor_name: string;
  amount: number;
  due_date: string;
  description: string | null;
  paid: boolean;
}

export default function InvoiceModal({ id, onClose }: Props) {
  const { data, isLoading, isError } = useQuery<Invoice>({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const res = await api.get(`/invoices/${id}`);
      return res.data;
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
        >
          ×
        </button>

        {isLoading ? (
          <p className="text-gray-600">Loading...</p>
        ) : isError || !data ? (
          <p className="text-red-500">Failed to load invoice</p>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">{data.vendor_name}</h3>

            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Amount:</strong> ${data.amount.toFixed(2)}
              </p>
              <p>
                <strong>Due Date:</strong>{' '}
                {new Date(data.due_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {data.description || <span className="text-gray-400 italic">No description</span>}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`inline-block px-2 py-1 text-sm font-semibold rounded ${
                    data.paid
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {data.paid ? 'Paid' : 'Unpaid'}
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
