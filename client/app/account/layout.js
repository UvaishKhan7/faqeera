import AccountSidebar from "@/components/account/AccountSidebar";


export default function AccountLayout({ children }) {
  return (
    <div className="container mx-auto">
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <div className="hidden border-r py-8 bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 sticky top-24">
            <div className="flex-1">
              <AccountSidebar />
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}