import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import Button from '../../components/Button';

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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : isError || !data ? (
          <p className="text-red-600 dark:text-red-400">Failed to load invoice</p>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4">{data.vendor_name}</h3>
            <div className="space-y-4">
              <Item label="Amount" value={`$${data.amount.toFixed(2)}`} />
              <Item
                label="Due Date"
                value={new Date(data.due_date).toLocaleDateString()}
              />
              <Item
                label="Description"
                value={
                  data.description || (
                    <span className="italic text-gray-500 dark:text-gray-400">
                      No description
                    </span>
                  )
                }
              />
              <Item
                label="Status"
                value={
                  <span
                    className={`inline-block px-2 py-1 text-sm font-semibold rounded ${
                      data.paid
                        ? 'bg-green-200 text-green-900'
                        : 'bg-yellow-200 text-yellow-900'
                    }`}
                  >
                    {data.paid ? 'Paid' : 'Unpaid'}
                  </span>
                }
              />
            </div>

            {/* Bottom close button */}
            <div className="text-center mt-6">
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Item({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
