import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getAPILimitCount } from "@/lib/api-limit";

const DashboardLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const APILimitCount = await getAPILimitCount();

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar APILimitCount={APILimitCount}/>
            </div>
            <main className="md:pl-72">
                <Navbar/>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;