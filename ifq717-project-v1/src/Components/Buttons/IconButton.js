// small button can re-use with any icon (functionality on send will be separate)

export default function IconButton({ icon: Icon, children, ...props }) {
  return (
    <a
      {...props}
      style={{
        backgroundColor: 'var(--background-color)',
        color: 'var(--primary-color)',
        border: `1px solid var(--primary-color)`,
        padding: '0.25rem 0.25rem',
        borderRadius: '0.25rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'white';
        e.target.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'var(--background-color)';
        e.target.style.boxShadow = '0 1px 1px rgba(0, 0, 0, 0.05)';
      }}
    >
      {Icon && <Icon />}
      {children}
    </a>
  );
}