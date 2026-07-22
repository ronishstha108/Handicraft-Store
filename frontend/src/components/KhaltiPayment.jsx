// frontend/src/components/KhaltiPayment.jsx
import { useState } from 'react';
import { paymentService } from '../services/paymentService';

function KhaltiPayment({ orderId, totalAmount, customerInfo, onSuccess, onFailure }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await paymentService.initializeKhaltiPayment(
        orderId,
        totalAmount,
        customerInfo
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Payment initialization failed');
      }

      const { payment_url } = response.data;

      // Redirect to Khalti payment page
      paymentService.redirectToKhalti(payment_url);

    } catch (error) {
      console.error('Khalti payment error:', error);
      setError(error.message);
      setIsProcessing(false);
      
      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        style={{
          width: '100%',
          padding: '14px',
          background: isProcessing ? '#999' : '#5C2D91',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if (!isProcessing) {
            e.target.style.background = '#7B3FAF';
          }
        }}
        onMouseLeave={(e) => {
          if (!isProcessing) {
            e.target.style.background = '#5C2D91';
          }
        }}
      >
        {isProcessing ? (
          <>
            <span style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              marginRight: '10px',
              verticalAlign: 'middle'
            }}></span>
            Processing...
          </>
        ) : (
          `💰 Pay with Khalti • Rs. ${totalAmount.toLocaleString('en-IN')}`
        )}
      </button>

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: '#ffe8df',
          borderRadius: '8px',
          color: '#8d261a',
          fontSize: '0.9rem'
        }}>
          ❌ {error}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default KhaltiPayment;