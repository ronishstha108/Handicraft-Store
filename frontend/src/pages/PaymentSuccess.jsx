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
        // Use pidx for Khalti or transactionId for eSewa
        const id = pidx || transactionId;
        if (id) {
          const response = await paymentService.getTransactionStatus(id);
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
        background: '#e8f3ef',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        fontSize: '40px'
      }}>
        ✅
      </div>
      
      <h1 style={{ color: '#241913', marginBottom: '8px' }}>Payment Successful!</h1>
      <p style={{ color: '#71635b', marginBottom: '24px' }}>
        Your order has been confirmed and will be processed shortly.
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
          <span style={{ color: '#2f5140', fontWeight: 'bold' }}>{transaction?.status || 'COMPLETE'}</span>
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