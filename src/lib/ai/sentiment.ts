import type { ReviewTopicName, Sentiment } from "@prisma/client";

// Rule-based fallback classifier. Used whenever OPENAI_API_KEY is not configured
// (e.g. demo mode) and as a fast, zero-cost pre-filter otherwise.

type TopicHit = { topic: ReviewTopicName; sentiment: Sentiment; mentionText: string };

const POSITIVE_WORDS = [
  "delicious", "amazing", "great", "excellent", "love", "loved", "best", "fresh",
  "friendly", "fast", "quick", "clean", "tasty", "perfect", "awesome", "fantastic",
  "good", "nice", "wonderful", "hot", "crispy", "recommend",
];

const NEGATIVE_WORDS = [
  "late", "cold", "rude", "slow", "bad", "worst", "terrible", "dirty", "small",
  "expensive", "burnt", "soggy", "stale", "wrong", "missing", "disappointed",
  "disappointing", "awful", "horrible", "never", "waited", "wait", "delay", "delayed",
];

const TOPIC_KEYWORDS: Record<ReviewTopicName, string[]> = {
  FOOD_QUALITY: ["food quality", "quality", "fresh", "ingredients"],
  TASTE: ["taste", "tasty", "delicious", "flavor", "flavour", "bland"],
  DELIVERY: ["delivery", "delivered", "rider", "courier"],
  DELIVERY_TIME: ["late", "delivery time", "on time", "delayed", "fast delivery", "quick delivery"],
  STAFF: ["staff", "waiter", "employee", "server"],
  CUSTOMER_SERVICE: ["service", "customer service", "behavior", "behaviour", "rude", "polite", "friendly"],
  CLEANLINESS: ["clean", "dirty", "hygiene", "cleanliness"],
  PACKAGING: ["packaging", "package", "box", "spilled", "leaked"],
  PRICE: ["price", "expensive", "cheap", "cost", "overpriced"],
  VALUE: ["value", "worth", "value for money"],
  QUANTITY: ["quantity", "portion", "small portion", "large portion", "size"],
  PIZZA: ["pizza"],
  BURGER: ["burger"],
  PASTA: ["pasta"],
  WINGS: ["wings"],
  SAUCES: ["sauce", "sauces", "dip"],
  OTHER: [],
};

function localSentimentForSnippet(snippet: string): Sentiment {
  const lower = snippet.toLowerCase();
  const hasPositive = POSITIVE_WORDS.some((w) => lower.includes(w));
  const hasNegative = NEGATIVE_WORDS.some((w) => lower.includes(w));
  if (hasPositive && hasNegative) return "MIXED";
  if (hasPositive) return "POSITIVE";
  if (hasNegative) return "NEGATIVE";
  return "NEUTRAL";
}

export function extractTopicsRuleBased(text: string): TopicHit[] {
  const lower = text.toLowerCase();
  const hits: TopicHit[] = [];

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS) as [ReviewTopicName, string[]][]) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        const idx = lower.indexOf(kw);
        const snippet = text.slice(Math.max(0, idx - 30), idx + kw.length + 30);
        hits.push({ topic, sentiment: localSentimentForSnippet(snippet), mentionText: snippet.trim() });
        break;
      }
    }
  }

  return hits;
}

export function classifySentimentRuleBased(text: string | null | undefined, rating: number): Sentiment {
  if (!text || text.trim().length === 0) {
    if (rating >= 4) return "POSITIVE";
    if (rating <= 2) return "NEGATIVE";
    return "NEUTRAL";
  }

  const lower = text.toLowerCase();
  const hasPositive = POSITIVE_WORDS.some((w) => lower.includes(w));
  const hasNegative = NEGATIVE_WORDS.some((w) => lower.includes(w));

  if (hasPositive && hasNegative) return "MIXED";
  if (hasPositive && !hasNegative) return rating <= 2 ? "MIXED" : "POSITIVE";
  if (hasNegative && !hasPositive) return rating >= 4 ? "MIXED" : "NEGATIVE";

  if (rating >= 4) return "POSITIVE";
  if (rating <= 2) return "NEGATIVE";
  return "NEUTRAL";
}

export interface ReviewAnalysisResult {
  sentiment: Sentiment;
  topics: TopicHit[];
  summary: string;
  model: string;
}

export async function analyzeReview(text: string | null | undefined, rating: number): Promise<ReviewAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const result = await analyzeReviewWithOpenAI(text ?? "", rating, apiKey);
      if (result) return result;
    } catch (err) {
      console.error("OpenAI analysis failed, falling back to rule-based:", err);
    }
  }

  return {
    sentiment: classifySentimentRuleBased(text, rating),
    topics: text ? extractTopicsRuleBased(text) : [],
    summary: text ? text.slice(0, 140) : "No written comment.",
    model: "rule-based",
  };
}

async function analyzeReviewWithOpenAI(
  text: string,
  rating: number,
  apiKey: string
): Promise<ReviewAnalysisResult | null> {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey });

  const topicList = Object.keys(TOPIC_KEYWORDS).join(", ");

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You classify restaurant customer reviews. Respond ONLY with strict JSON: " +
          '{"sentiment":"POSITIVE|NEUTRAL|NEGATIVE|MIXED","topics":[{"topic":"<one of: ' +
          topicList +
          '>","sentiment":"POSITIVE|NEUTRAL|NEGATIVE","mentionText":"short quote"}],"summary":"one sentence summary"}',
      },
      { role: "user", content: `Rating: ${rating} stars.\nReview: """${text || "(no text provided)"}"""` },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return null;
  const parsed = JSON.parse(raw);

  return {
    sentiment: parsed.sentiment ?? "NEUTRAL",
    topics: Array.isArray(parsed.topics) ? parsed.topics : [],
    summary: parsed.summary ?? text.slice(0, 140),
    model: "gpt-4o-mini",
  };
}
