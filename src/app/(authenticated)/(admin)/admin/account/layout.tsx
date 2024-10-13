const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between"></div>
      <div className="flex items-center justify-center">{children}</div>
    </>
  );
};

export default Layout;
