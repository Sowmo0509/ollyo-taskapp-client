import Header from "../global/Header";

const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="container p-6 mx-auto">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
