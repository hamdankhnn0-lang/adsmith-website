// Generates a DRAFT reply only. Nothing here ever posts automatically —
// every draft must be approved by a human manager before it reaches Google.
// Rules (see spec / Google review policy):
//  - professional, short, brand-appropriate, never defensive or argumentative
//  - never blames the customer, never offers inappropriate incentives
//  - never asks the customer to remove/change their review
//  - never exposes private info
export async function generateReplyDraft(params: {
  reviewerName: string | null;
  rating: number;
  comment: string | null;
  branchName: string;
}): Promise<{ draft: string; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const { reviewerName, rating, comment, branchName } = params;

  if (apiKey) {
    try {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: [
              "You write short public replies from Pizza Box Peshawar to Google reviews.",
              "Rules you must always follow:",
              "- Professional, warm, human tone. 2-4 sentences max.",
              "- Never defensive, never argue, never blame the customer.",
              "- For 1-3 star reviews: thank them, apologize sincerely for the specific issue, invite them to contact the branch/management privately to resolve it. Do not ask them to remove or change the review.",
              "- For 4-5 star reviews: thank them warmly, optionally reference something specific they mentioned.",
              "- Never offer discounts, refunds, free items, or other incentives.",
              "- Never expose any private customer information.",
              "- Sign off as 'Pizza Box Peshawar Team'.",
            ].join("\n"),
          },
          {
            role: "user",
            content: `Branch: ${branchName}\nReviewer: ${reviewerName ?? "Guest"}\nRating: ${rating} stars\nReview: """${comment ?? "(no written comment)"}"""`,
          },
        ],
      });
      const draft = completion.choices[0]?.message?.content?.trim();
      if (draft) return { draft, model: "gpt-4o-mini" };
    } catch (err) {
      console.error("OpenAI reply generation failed, falling back to template:", err);
    }
  }

  return { draft: templateReply({ reviewerName, rating, branchName }), model: "template" };
}

function templateReply({
  reviewerName,
  rating,
  branchName,
}: {
  reviewerName: string | null;
  rating: number;
  branchName: string;
}): string {
  const name = reviewerName?.split(" ")[0] || "there";

  if (rating >= 4) {
    return `Hi ${name}, thank you so much for the kind words about our ${branchName} branch! We're thrilled you enjoyed your experience and hope to see you again soon. — Pizza Box Peshawar Team`;
  }

  if (rating === 3) {
    return `Hi ${name}, thank you for your honest feedback about our ${branchName} branch. We'd love to hear more so we can do better — please reach out to us directly so we can make things right. — Pizza Box Peshawar Team`;
  }

  return `Hi ${name}, we're really sorry to hear about your experience at our ${branchName} branch. This isn't the standard we aim for, and we'd like to make it right. Please contact us directly so our team can follow up with you personally. — Pizza Box Peshawar Team`;
}
