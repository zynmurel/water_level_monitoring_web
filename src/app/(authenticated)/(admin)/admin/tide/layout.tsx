const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold tracking-tight">Tide Chart</h3>
          <p className="text-sm text-muted-foreground">
            {"Filter and view tide chart's information."}
          </p>
        </div>
      </div>
      <div className="flex" x-chunk="dashboard-02-chunk-1">
        {children}
      </div>
    </>
  );
};

export default Layout;
