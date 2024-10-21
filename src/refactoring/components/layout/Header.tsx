interface Props {
  title: string;
  onClick: () => void;
}

export const Header = ({ title, onClick }: Props) => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
        <button onClick={onClick} className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100">
          {title}
        </button>
      </div>
    </nav>
  );
};
