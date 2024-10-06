import { getSessionForAdmin } from "@/lib/session";
import { redirect } from 'next/navigation';

const AuthenticatedLayout = ({
    children,
  }: Readonly<{ children: React.ReactNode }>) => {  
    const session = getSessionForAdmin()
    if(!session) {
      redirect("/login-admin")
    }
    return ( 
        <div>{children}</div>
     );
}
 
export default AuthenticatedLayout;