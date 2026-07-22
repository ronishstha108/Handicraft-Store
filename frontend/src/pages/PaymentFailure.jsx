// frontend/src/pages/PaymentFailure.jsx
import { useSearchParams, useNavigate } from 'react-router-dom';

function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const error = searchParams.get('error') || 'Payment was cancelled or failed';

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
        background: '#ffe8df',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        fontSize: '40px'
      }}>
        ❌
      </div>
      
      <h1 style={{ color: '#241913', marginBottom: '8px' }}>Payment Failed</h1>
      <p style={{ color: '#8d261a', marginBottom: '24px' }}>
        {error}
      </p>
      
      <div style={{
        background: '#f9f6f0',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'left',
        marginBottom: '24px'
      }}>
        <p style={{ color: '#71635b', fontSize: '0.9rem', margin: 0 }}>
          💡 Please try again or use a different payment method.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate(-1)}
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
          ← Go Back
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

export default PaymentFailure;