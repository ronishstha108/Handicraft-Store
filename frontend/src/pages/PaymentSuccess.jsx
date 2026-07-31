// frontend/src/pages/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const status = searchParams.get('status');
  const pidx = searchParams.get('pidx');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (pidx) {
          // pidx present: this is a real Khalti redirect. Call lookup so the
          // backend verifies with Khalti and updates the order accordingly.
          const response = await paymentService.lookupKhaltiPayment(pidx);
          if (response.success) {
            setTransaction(response.data);
          }
        } else if (transactionId) {
          const response = await paymentService.getTransactionStatus(transactionId);
          if (response.success) {
            setTransaction(response.data);
          }
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'success' && !transactionId && !pidx) {
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [transactionId, pidx, status]);

  const rawStatus = transaction?.status; // Khalti's own status string, e.g. 'Completed', 'User canceled', 'Expired', 'Pending'
  const isSuccess = rawStatus === 'Completed' || (!rawStatus && status === 'success');
  const isPending = rawStatus === 'Pending' || rawStatus === 'Initiated';
  const isFailed = !isSuccess && !isPending;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f6eadb',
          borderTop: '3px solid #b85c38',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#71635b' }}>Verifying your payment...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '60px auto',
      padding: '40px',
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        background: isSuccess ? '#e8f3ef' : isPending ? '#fff8e7' : '#ffe8df',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        fontSize: '40px'
      }}>
        {isSuccess ? '✅' : isPending ? '⏳' : '❌'}
      </div>
      
      <h1 style={{ color: '#241913', marginBottom: '8px' }}>
        {isSuccess ? 'Payment Successful!' : isPending ? 'Payment Pending' : 'Payment Not Completed'}
      </h1>
      <p style={{ color: '#71635b', marginBottom: '24px' }}>
        {isSuccess
          ? 'Your order has been confirmed and will be processed shortly.'
          : isPending
          ? "We're still waiting for confirmation from Khalti. Check your order status again shortly."
          : 'Your payment was cancelled or did not go through, so this order has been cancelled and any reserved stock has been released.'}
      </p>
      
      <div style={{
        background: '#f9f6f0',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'left',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span style={{ color: '#71635b' }}>Order ID:</span>
          <strong style={{ color: '#241913' }}>#{orderId || 'N/A'}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span style={{ color: '#71635b' }}>Transaction ID:</span>
          <strong style={{ color: '#241913' }}>{transactionId || pidx || 'N/A'}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
          <span style={{ color: '#71635b' }}>Status:</span>
          <span style={{
            color: isSuccess ? '#2f5140' : isPending ? '#8a6d1d' : '#8d261a',
            fontWeight: 'bold'
          }}>
            {rawStatus || 'COMPLETE'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate('/orders')}
          style={{
            flex: 1,
            padding: '12px',
            background: '#b85c38',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          View My Orders
        </button>
        <button
          onClick={() => navigate('/shop')}
          style={{
            flex: 1,
            padding: '12px',
            background: 'white',
            color: '#b85c38',
            border: '2px solid #b85c38',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;