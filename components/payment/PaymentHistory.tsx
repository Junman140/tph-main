'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  method: string;
  date: Date;
  description?: string;
}

export default function PaymentHistory({ userId }: { userId: string }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsRef = collection(db, 'payments');
        const q = query(
          paymentsRef,
          where('userId', '==', userId),
          orderBy('date', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const paymentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(),
        })) as Payment[];

        setPayments(paymentData);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{format(payment.date, 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  {payment.currency} {payment.amount.toFixed(2)}
                </TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell className={getStatusColor(payment.status)}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </TableCell>
                <TableCell>{payment.description || '-'}</TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No payment history found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 