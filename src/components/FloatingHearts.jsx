import React from 'react';

const FloatingHearts = () => {
  const hearts = [
    { left: '10%', delay: '0s', duration: '8s', size: '20px' },
    { left: '25%', delay: '2s', duration: '10s', size: '16px' },
    { left: '40%', delay: '4s', duration: '12s', size: '18px' },
    { left: '60%', delay: '1s', duration: '9s', size: '22px' },
    { left: '75%', delay: '3s', duration: '11s', size: '16px' },
    { left: '90%', delay: '5s', duration: '10s', size: '20px' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        .delay-75 { animation-delay: 0.75s; }
        .delay-150 { animation-delay: 1.5s; }
        .delay-300 { animation-delay: 3s; }
      `}</style>
      {hearts.map((heart, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: heart.left,
            bottom: '-50px',
            animation: `float-up ${heart.duration} ${heart.delay} infinite ease-in-out`,
            fontSize: heart.size,
            color: '#fda4af'
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;