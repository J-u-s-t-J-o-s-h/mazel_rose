# mazel.rose Website Owner Guide

This guide explains how to update the wedding website without touching code.

## Logging in

1. Go to your website and add `/admin` to the end of the address.  
   Example: `https://your-site.com/admin`
2. Sign in with the Sanity account you were invited to.
3. You will see a sidebar of website sections written in plain English.

## Editing wedding details

1. Open **Wedding Details**.
2. Update names, dates, location, venue, contact email, and footer message.
3. Click **Publish** when you are happy with the changes.

These details appear in the header, footer, countdown, invitation text, and search/social previews.

## Replacing images

1. Open the page or item that contains the image (for example **Home Page** or **Gallery**).
2. Use the **Choose file** button on the photo field (JPEG or PNG). Large camera files are resized automatically.
3. Wait until you see “Photo attached.”
4. Adjust the crop/hotspot if shown so faces stay centered.
5. Add a short image description if asked.
6. Click **Publish**.

Tips:

- Hero images look best as wide photos (about 2400 × 1400 or larger).
- Wedding-party portraits look best as tall photos (about 1200 × 1600 or larger).
- On iPhone, use JPEG. In Camera settings, set Formats to Most Compatible if uploads fail.
- A photo is not on the live site until you click **Publish**.

## Adding, reordering, and removing cards

Schedule, hotels, airports, wedding party, registry links, Things To Do, and FAQs are card lists:

1. Open the list (for example **Schedule** or **Travel → Hotels**).
2. Drag a card to change its order on the website. The new order saves when you drop it.
3. Click **+** to add a new card, fill it in, then **Publish**.
4. To hide a card without deleting it, open it and click **Hide this card on the website**, or turn off **Show this card on the website**.
5. To delete a card for good, open it and use **Delete** in the top-right menu.

## Uploading gallery photos

1. Open **Gallery**.
2. In the **Photos** grid, click **Add item** to create a card, or open an existing card.
3. Upload the JPEG/PNG, add a caption, then **Publish** the Gallery document.
4. Drag cards in the grid to reorder them. Use a card’s menu to remove it.

## Editing FAQs

1. Open **FAQs → Questions and Answers**.
2. Edit a question and answer, or create a new one.
3. Publish.

## Previewing changes

1. In Studio, open the **Presentation** / preview tool (eye icon).
2. The live website opens beside your editing panel.
3. Click text on the preview to jump to that field when available.
4. Draft changes are only visible in preview — guests still see the published site.

If you opened a preview link in a normal browser tab, use **Exit Preview** to return to the public view.

## Publishing changes

1. Make your edits.
2. Click **Publish**.
3. Wait a moment — the public website updates automatically.
4. You do **not** need to ask anyone to redeploy the site.

## Hiding content without deleting it

Turn off **Show this card on the website**, or use **Hide this card on the website**.

This is useful for:

- Temporary hotel options
- Gallery photos you may want later
- FAQ items still being finalized

## RSVP responses

Guest RSVP answers (names, emails, meal choices, messages) are **not** stored in this editor.

They are saved through the website’s secure RSVP system. If you need the guest list responses, ask your developer for access to that system (for example Airtable or Supabase).

You *can* edit RSVP form wording and options under **RSVP → RSVP Form Settings**.

## What to do if something goes wrong

- If the preview looks wrong, click **Exit Preview** and reopen Presentation.
- If a page looks empty after editing, confirm you clicked **Publish**.
- If an image looks cropped oddly, reopen it and adjust the hotspot/crop.
- If you cannot log in, ask the project owner to re-send your Sanity invite.
- If the public site still shows old content after a few minutes, contact your developer and mention the revalidation webhook.

## Recommended habit

Edit → Preview → Publish → Check the live page on your phone.
