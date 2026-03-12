// components/common/Card.jsx
export const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="bg-red-700 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};