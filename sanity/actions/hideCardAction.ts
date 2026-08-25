import { useState } from "react";
import { type DocumentActionComponent, useDocumentOperation } from "sanity";

const CARD_TYPES = new Set([
  "scheduleEvent",
  "airport",
  "hotel",
  "registryLink",
  "weddingPartyMember",
  "galleryPhoto",
  "activity",
  "faqItem",
]);

export const hideCardAction: DocumentActionComponent = (props) => {
  if (!CARD_TYPES.has(props.type)) {
    return null;
  }

  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const doc = (props.draft || props.published) as
    | { showOnWebsite?: boolean }
    | undefined;
  const visible = doc?.showOnWebsite !== false;
  const [working, setWorking] = useState(false);

  return {
    label: visible ? "Hide this card on the website" : "Show this card on the website",
    tone: visible ? "caution" : "positive",
    disabled: working,
    onHandle: () => {
      setWorking(true);
      patch.execute([{ set: { showOnWebsite: !visible } }]);
      publish.execute();
      props.onComplete();
    },
  };
};
