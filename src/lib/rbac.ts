import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Role } from "@prisma/client";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export function canAccessBranch(userRole: Role, userBranchId: string | null | undefined, branchId: string) {
  if (userRole === "SUPER_ADMIN" || userRole === "ANALYST") return true;
  return userBranchId === branchId;
}

export function isSuperAdmin(role?: Role) {
  return role === "SUPER_ADMIN";
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new ForbiddenError("Not authenticated");
  return user;
}

export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new ForbiddenError("Insufficient role");
  return user;
}
