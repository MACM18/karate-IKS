import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StaffManagement from "@/components/admin/StaffManagement";

export default async function StaffManagementPage() {
    const session = await auth();

    // Strict Admin check: Only ADMIN can manage staff. 
    // SENSEI role is excluded from staff management.
    if (!session || session.user.role !== 'ADMIN') {
        redirect("/admin/dashboard");
    }

    const staff = await prisma.user.findMany({
        where: {
            role: {
                in: ['ADMIN', 'SENSEI']
            }
        },
        orderBy: {
            name: 'asc'
        }
    });

    return <StaffManagement staff={staff} />;
}
