import { AccountForm } from "@/components/studio/AccountForm";
import { requireStudioUser } from "@/lib/studio/users";

export const dynamic = "force-dynamic";

export default async function StudioAccountPage() {
  const user = await requireStudioUser("/studio/account");

  return (
    <div>
      <h1 className="font-serif text-4xl text-wine-black">Account</h1>
      <p className="mt-3 text-sm text-charcoal/70">
        Signed in as {user.name} ({user.email}) · {user.role}
      </p>
      <div className="mt-8">
        <AccountForm />
      </div>
    </div>
  );
}
