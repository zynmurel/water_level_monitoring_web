const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <>
      <div className="flex" x-chunk="dashboard-02-chunk-1">
        {children}
      </div>
    </>
  );
};

export default Layout;
