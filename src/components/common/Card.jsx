export default function Card({ children, className = "" }) {
  return (
    <div className={`card p-4 shadow-sm border-0 ${className}`}>
      {children}
    </div>
  );
}
