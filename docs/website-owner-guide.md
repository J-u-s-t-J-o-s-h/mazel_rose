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

1. Open the page or item that contains the image (for example **Home Page** or a **Gallery** photo).
2. Click the image field.
3. Choose **Replace** (or upload a new photo).
4. Adjust the crop/hotspot if shown so faces and important details stay centered.
5. Add a short image description for accessibility.
6. Click **Publish**.

Tips:

- Hero images look best as wide photos (about 2400 × 1400 or larger).
- Wedding-party portraits look best as tall photos (about 1200 × 1600 or larger).
- For the gallery, upload the highest-quality originals you have.

## Adding schedule events

1. Open **Schedule**.
2. Click the button to create a new event.
3. Fill in title, date, times, venue, address, and description.
4. Set **Display order** (lower numbers appear first).
5. Use **Show this on the website** to hide an event without deleting it.
6. Publish.

## Updating hotels

1. Open **Travel → Hotels**.
2. Edit an existing hotel or create a new one.
3. Add booking link, group code, deadline, amenities, and photo.
4. Publish.

## Updating registry links

1. Open **Registry → Registry Links**.
2. Edit the store name, description, and external link.
3. Publish.

## Managing wedding-party members

1. Open **Wedding Party**.
2. Add or edit a person.
3. Upload a portrait, write a short biography, and optional fun fact.
4. Use **Display order** to rearrange the list.
5. Publish.

## Uploading gallery photos

1. Open **Gallery → Photos**.
2. Create a new photo entry for each image.
3. Upload the image, add a caption, and set display order.
4. To temporarily remove a photo from the site, turn off **Show this on the website**.
5. Publish.

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

Turn off **Show this on the website**.

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
