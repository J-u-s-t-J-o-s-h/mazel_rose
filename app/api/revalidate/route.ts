import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = {
  _type?: string;
  _id?: string;
};

/**
 * Sanity webhook revalidation endpoint.
 *
 * Configure in Sanity Manage → API → Webhooks:
 * - URL: https://YOUR_DOMAIN/api/revalidate
 * - Dataset: production
 * - Trigger on: Create, Update, Delete
 * - Filter: _type in ["weddingDetails","homePage","scheduleEvent","travelOverview","airport","hotel","registryIntro","registryLink","weddingPartyMember","gallerySettings","galleryPhoto","localGuideIntro","activity","faqPage","faqItem","rsvpFormSettings"]
 * - Projection: {_type,_id}
 * - Secret: same value as SANITY_REVALIDATE_SECRET
 * - HTTP method: POST
 */
export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "Missing SANITY_REVALIDATE_SECRET" },
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      request,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    const type = body?._type;
    if (!type) {
      return NextResponse.json({ message: "Missing _type" }, { status: 400 });
    }

    // Tag strategy mirrors document types used by queries
    revalidateTag(type, "max");
    revalidateTag("sanity", "max");

    return NextResponse.json({
      revalidated: true,
      type,
      id: body?._id,
      now: Date.now(),
    });
  } catch (error) {
    console.error("[revalidate]", error);
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 },
    );
  }
}
