'use client'
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logoutAdmin } from "@/lib/api-helper/auth";

const LogoutButton = () => {
    return ( 
        <DropdownMenuItem onClick={()=>logoutAdmin()}>Logout</DropdownMenuItem> );
}
 
export default LogoutButton;