import { redirect } from "next/navigation";
import { TeamManager } from "@/components/studio/TeamManager";
import { canManageTeam } from "@/lib/studio/permissions";
import { listStudioUsers, requireStudioUser } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

export default async function StudioTeamPage() {
  const user = await requireStudioUser("/studio/team");
  if (!canManageTeam(user.role)) {
    redirect("/studio");
  }

  const users = await listStudioUsers().catch(() => []);

  return (
    <div>
      <h1 className="font-serif text-4xl text-wine-black">Team</h1>
      <p className="mt-3 max-w-2xl text-sm text-charcoal/70">
        Owners can add Editors and Reviewers. Passwords are stored as hashes in
        hashed on the server, never in the website source.
      </p>
      <div className="mt-8">
        <TeamManager users={users} currentUserId={user.userId} />
      </div>
    </div>
  );
}
