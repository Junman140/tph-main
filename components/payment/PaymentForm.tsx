'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaGoogle, FaCcStripe, FaMoneyBillWave } from 'react-icons/fa';

interface PaymentFormProps {
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

export default function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('google');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let paymentData;
      switch (paymentMethod) {
        case 'google':
          paymentData = await handleGooglePay();
          break;
        case 'stripe':
          paymentData = await handleStripe();
          break;
        case 'flutterwave':
          paymentData = await handleFlutterwave();
          break;
        default:
          throw new Error('Invalid payment method');
      }
      onSuccess(paymentData);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGooglePay = async () => {
    // Initialize Google Pay
    const paymentsClient = new google.payments.api.PaymentsClient({
      environment: process.env.NEXT_PUBLIC_GOOGLE_PAY_ENV || 'TEST',
    });

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['VISA', 'MASTERCARD'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: process.env.NEXT_PUBLIC_GOOGLE_PAY_GATEWAY,
            gatewayMerchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID,
          },
        },
      }],
      merchantInfo: {
        merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID,
        merchantName: 'TPH Global',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: amount,
        currencyCode: 'USD',
      },
    };

    const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
    return paymentData;
  };

  const handleStripe = async () => {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(amount) * 100, // Convert to cents
        currency: 'usd',
      }),
    });

    const { clientSecret } = await response.json();
    return { clientSecret };
  };

  const handleFlutterwave = async () => {
    const response = await fetch('/api/create-flutterwave-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        currency: 'NGN',
        email: 'user@example.com', // Replace with actual user email
      }),
    });

    const { data } = await response.json();
    return data;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make a Payment</CardTitle>
        <CardDescription>
          Choose your preferred payment method and enter the amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount">Amount</label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentMethod">Payment Method</label>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">
                  <div className="flex items-center">
                    <FaGoogle className="mr-2" />
                    Google Pay
                  </div>
                </SelectItem>
                <SelectItem value="stripe">
                  <div className="flex items-center">
                    <FaCcStripe className="mr-2" />
                    Stripe
                  </div>
                </SelectItem>
                <SelectItem value="flutterwave">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2" />
                    Flutterwave
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 