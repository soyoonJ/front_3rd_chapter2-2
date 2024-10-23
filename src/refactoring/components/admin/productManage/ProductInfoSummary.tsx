interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

export const ProductInfoSummary = ({ children, onClick }: Props) => {
  return (
    <button data-testid="toggle-button" onClick={onClick} className="w-full text-left font-semibold">
      {children}
    </button>
  );
};
