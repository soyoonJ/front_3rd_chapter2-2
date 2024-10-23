interface Props {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}

export const AddToCartButton = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-1 rounded ${
        !disabled ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
