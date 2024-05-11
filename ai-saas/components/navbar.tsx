import { UserButton } from "@clerk/nextjs"
import MobileSidebar from "@/components/mobile-sidebar";
import { getAPILimitCount } from "@/lib/api-limit";

const Navbar = async () => {
    const APILimitCount = await getAPILimitCount();

    return (
        <div className="flex items-center p-4">
            <MobileSidebar APILimitCount={APILimitCount}/>
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    );
}

export default Navbar;