import { UserButton } from "@clerk/nextjs"
import MobileSidebar from "@/components/mobile-sidebar";
import { getAPILimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const Navbar = async () => {
    const APILimitCount = await getAPILimitCount();
    const isPro = await checkSubscription();

    return (
        <div className="flex items-center p-4">
            <MobileSidebar isPro={isPro} APILimitCount={APILimitCount}/>
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    );
} 

export default Navbar;