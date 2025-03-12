import Header from "../global/Header";

const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
