// Gemini AI Integration Service for MarkNCode AI Ad Studio
// Powered by Google Gemini API (gemini-flash-latest, gemini-3.8-flash)

export const GEMINI_API_KEY =
  process.env.REACT_APP_GEMINI_API_KEY || '';

export type BusinessType = string;
export type PricePoint = 'economic' | 'mid' | 'luxury';
export type LocationScope = 'radius_5_10km' | 'city' | 'country';
export type CustomerType = 'b2c' | 'b2b';
export type DesiredObjective = 'Messages' | 'Sales' | 'Leads' | 'Engagement' | 'Traffic' | 'LocalAwareness' | 'Undecided';
export type WebsitePixelStatus = 'no_website' | 'ready_pixel' | 'website_no_pixel';
export type CreativeAssetFormat = 'vertical_video' | 'graphic_images' | 'motion_graphics' | 'no_creative_need_help';
export type SalesClosingMethod = 'instant_chat' | 'telesales' | 'direct_online_checkout' | 'delayed_chat';
export type TargetGender = 'all' | 'men' | 'women';

export interface BusinessConsultationPayload {
  businessType: BusinessType;
  businessTypeName: string;
  productOrServiceName: string;
  sellingPrice: number;
  costOrMargin: number;
  dailyBudget: number;
  totalBudget: number;
  campaignDays: number;
  platform: string;
  country: string;

  // Granular targeting inputs requested by user:
  pricePoint: PricePoint;
  painPoint: string;
  locationScope: LocationScope;
  customerType: CustomerType;

  // NEW: User chosen ad objective & granular operational inputs:
  userDesiredObjective: DesiredObjective;
  websiteAndPixelStatus: WebsitePixelStatus;
  creativeAssetFormat: CreativeAssetFormat;
  salesClosingMethod: SalesClosingMethod;
  uniqueSellingProposition: string;
  targetGender: TargetGender;

  // Specific questions by business:
  specifics: Record<string, any>;

  // Operational details:
  responseSpeed: string;
  hasNoOffer: boolean;
  offerType: string;
  customOfferText?: string;
  industryGuaranteeType: string;
  creativeAssetType: string;
}

export interface RightWrongItem {
  topic: string;
  userChoice: string;
  isCorrect: boolean;
  statusText: string;
  theWrong: string;
  theRight: string;
  impactScore: string;
}

export interface AbTestAngle {
  name: string;
  angleType: 'fomo_urgency' | 'rational_roi';
  hook: string;
  primaryText: string;
  ctaButton: string;
  psychologySecret: string;
}

export interface TroubleshootingItem {
  kpiProblem: string;
  diagnosis: string;
  actionToTake: string;
}

export interface RoiCalculatorMetrics {
  totalBudget: number;
  campaignDays: number;
  dailyBudget: number;
  estimatedCPA: number;
  estimatedConversions: number;
  expectedRevenue: number;
  expectedGrossProfit: number;
  expectedNetProfit: number;
  expectedROAS: number;
}

export interface ObjectiveStrategyDetail {
  objectiveName: string;
  whyUseThis: string;
  executionIdea: string;
  creativeFormat: string;
  closingOrConversionTactic: string;
  recommendedBudgetMin: string;
}

export interface ChatClosingScript {
  firstWelcomeMessage: string;
  qualifyingQuestion: string;
  objectionHandlingExpensive: string;
  closingCallToAction: string;
}

export interface CampaignObjectiveAdvisor {
  recommendedObjective: 'Sales' | 'Leads' | 'Messages' | 'Engagement' | 'LocalAwareness';
  objectiveArabicTitle: string;
  verdictReason: string;

  // User Choice vs AI Recommendation Deep Analysis:
  userSelectedObjective?: string;
  userSelectedObjectiveArabicTitle?: string;
  isUserChoiceOptimal?: boolean;
  userChoiceAnalysisVerdict?: string;
  whyAiRecommendationIsBetter?: string;
  alternativeExecutionTacticForUserChoice?: string;

  ifSalesStrategy: ObjectiveStrategyDetail;
  ifMessagesStrategy: ObjectiveStrategyDetail;
  ifLeadsStrategy: ObjectiveStrategyDetail;
  chatClosingScript: ChatClosingScript;
}

export interface GeneratedGeminiCampaign {
  score: number;
  feasibilityVerdict: string;
  estimatedResults: string;
  rightWrongAudits: RightWrongItem[];
  correctedGrandSlamOffer: string;
  viralHooks: string[];
  videoScript: {
    hookSeconds: string;
    painPointSeconds: string;
    solutionSeconds: string;
    offerSeconds: string;
    ctaSeconds: string;
  };
  adCopies: {
    type: string;
    headline: string;
    primaryText: string;
    ctaButton: string;
  }[];
  targeting: {
    strategyType: string;
    ageRange: string;
    gender: string;
    locations: string;
    radiusTargeting: string;
    interests: string[];
    lateralInterests: string[];
    behaviors: string[];
    exclusions: string[];
    placements: string[];
    industrySecret: string;
  };
  policyRules: {
    bannedWords: string[];
    criticalPitfalls: string[];
    approvedPractices: string[];
    algorithmSecret: string;
  };
  budgetBlueprint: {
    phase1: string;
    phase2: string;
    whenToKill: string;
    whenToScale: string;
  };
  budgetFunnelAllocation: {
    coldTestingPercent: number;
    coldTestingDaily: number;
    retargetingPercent: number;
    retargetingDaily: number;
    retargetingAdvice: string;
  };
  abTestAngles: {
    angleA: AbTestAngle;
    angleB: AbTestAngle;
  };
  troubleshootingGuide: TroubleshootingItem[];
  roiCalculations: RoiCalculatorMetrics;
  objectiveAdvisor?: CampaignObjectiveAdvisor;
  customAiAdvice: string;
  isLiveGemini?: boolean;
}

const CANDIDATE_MODELS = [
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
];

async function callGeminiApiWithFallback(prompt: string, apiKey: string): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text;
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        lastError = new Error(errorData.error?.message || `HTTP ${response.status} from ${model}`);
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

/**
 * Detects keyboard mashing, repeated characters, unpronounceable blobs,
 * or non-word gibberish in Arabic or Latin text.
 */
export function detectGibberish(text: string): { isGibberish: boolean; reason: string } {
  const clean = text.trim();
  if (!clean) return { isGibberish: false, reason: '' };

  // 1. Must contain at least some letters (Arabic or Latin)
  const hasLetters = /[a-zA-Z\u0600-\u06FF]/.test(clean);
  if (!hasLetters) {
    return {
      isGibberish: true,
      reason: 'المدخل لا يحتوي على أي حروف أو كلمات حقيقية، بل أرقام أو رموز فقط!',
    };
  }

  // Split into tokens
  const tokens = clean.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    const isArabic = /[\u0600-\u06FF]/.test(token);
    const maxAllowedLen = isArabic ? 12 : 16;

    // 2. Abnormally long single token without spaces (>12 Arabic or >16 Latin)
    if (token.length > maxAllowedLen) {
      return {
        isGibberish: true,
        reason: `الكلمة "${token.slice(0, 14)}..." طويلة بشكل غير طبيعي وبدون فواصل (${token.length} حرفاً)، وهي عبارة عن حروف عشوائية غير مفهومة!`,
      };
    }

    // 3. Repeated identical characters (3 or more times consecutively: e.g. سسس, ههههه, aaaa, zzzz)
    if (/(.)\1{2,}/.test(token)) {
      return {
        isGibberish: true,
        reason: `الكلمة "${token}" تحتوي على تكرار عشوائي لنفس الحرف!`,
      };
    }

    // 4. Repeated 2-character syllable 3 or more times (e.g. ساساساسا, بلابلابلا, asdfasdf)
    if (/(.{2})\1{2,}/.test(token)) {
      return {
        isGibberish: true,
        reason: `الكلمة "${token}" عبارة عن مقاطع مكررة عشوائياً وليست اسماً حقيقياً.`,
      };
    }

    // 5. Very low character variety in a word (e.g. 5+ chars with only 1 or 2 distinct letters)
    if (token.length >= 5) {
      const uniqueChars = new Set(token.split('')).size;
      if (uniqueChars <= 2) {
        return {
          isGibberish: true,
          reason: `الكلمة "${token}" تتكون من حرف أو حرفين مكررين فقط!`,
        };
      }
    }

    // 6. Arabic keyboard row sweeps / mashing patterns
    const arabicKeyboardMashPatterns = [
      /[شسيب]{4,}/i,
      /[سبشسي]{4,}/i,
      /[كمنتال]{4,}/i,
      /[ضصثقف]{4,}/i,
      /[فغعهخ]{4,}/i,
      /[خحجد]{4,}/i,
      /[يسمنى]{4,}/i,
      /[مشسنب]{4,}/i,
      /[ئءؤرل]{4,}/i,
      /[ىةوزظ]{4,}/i,
      /[تنمك]{4,}/i,
      /[لاتن]{4,}/i,
    ];
    for (const pattern of arabicKeyboardMashPatterns) {
      if (pattern.test(token)) {
        return {
          isGibberish: true,
          reason: 'تم اكتشاف حروف عشوائية ناتجة عن خبط الكيبورد (Keyboard Mash)!',
        };
      }
    }

    // 7. English keyboard row sweeps & unpronounceable consonants
    const englishKeyboardMashPatterns = [
      /(asdf|sdfg|dfgh|fghj|ghjk|hjkl)/i,
      /(qwer|wert|erty|rtyu|tyui|yuio|uiop)/i,
      /(zxcv|xcvb|cvbn|vbnm)/i,
      /[bcdfghjklmnpqrstvwxyz]{5,}/i,
    ];
    for (const pattern of englishKeyboardMashPatterns) {
      if (pattern.test(token)) {
        return {
          isGibberish: true,
          reason: 'حروف عشوائية إنجليزية غير مفهومة ناتجة عن خبط الكيبورد!',
        };
      }
    }

    // 8. Latin token without any vowel if length >= 4
    if (!isArabic && token.length >= 4 && !/[aeiouy]/i.test(token)) {
      return {
        isGibberish: true,
        reason: `الكلمة "${token}" لا تحتوي على أي حروف متحركة (حروف عشوائية)!`,
      };
    }
  }

  // 9. All tokens are identical (e.g. "منتج منتج منتج")
  if (tokens.length >= 2) {
    const uniqueTokens = new Set(tokens.map((t) => t.toLowerCase()));
    if (uniqueTokens.size === 1) {
      return {
        isGibberish: true,
        reason: `تكرار نفس الكلمة ("${tokens[0]}") لا يعبر عن تفاصيل منتج أو خدمة حقيقية!`,
      };
    }
  }

  return { isGibberish: false, reason: '' };
}

/**
 * Generate full marketing and ad strategy using Google Gemini
 */
export async function generateAdCampaignWithGemini(
  payload: BusinessConsultationPayload
): Promise<GeneratedGeminiCampaign> {
  const gibberishCheck = detectGibberish(payload.productOrServiceName);
  if (gibberishCheck.isGibberish) {
    throw new Error(
      `المدخل [${payload.productOrServiceName}] غير مفهوم أو عبارة عن حروف عشوائية (${gibberishCheck.reason})! أنا عايز اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص.`
    );
  }

  const pricePointLabel =
    payload.pricePoint === 'luxury'
      ? 'فاخر / مرتفع القيمة (Luxury / High-Ticket)'
      : payload.pricePoint === 'economic'
      ? 'اقتصادي / شعبي (Economic / Budget)'
      : 'متوسط القيمة (Mid-range)';

  const locationScopeLabel =
    payload.locationScope === 'radius_5_10km'
      ? 'محيط محلي 5 إلى 10 كم حول المقر (Local Radius)'
      : payload.locationScope === 'city'
      ? 'مدينة أو محافظة محددة بالكامل'
      : 'دولة كاملة أو شحن لكافة المحافظات';

  const customerTypeLabel =
    payload.customerType === 'b2b'
      ? 'B2B (بيع لشركات وأصحاب أعمال ومؤسسات)'
      : 'B2C (بيع لأفراد ومستهلكين نهائيين)';

  const userDesiredObjectiveLabel =
    payload.userDesiredObjective === 'Messages'
      ? 'إعلانات رسائل ومحادثات واتساب وانستجرام (Messages / WhatsApp)'
      : payload.userDesiredObjective === 'Sales'
      ? 'إعلانات مبيعات وتحويلات متجر إلكتروني (Sales / Conversions)'
      : payload.userDesiredObjective === 'Leads'
      ? 'إعلانات استمارات وتجميع بيانات العملاء (Leads / Instant Forms)'
      : payload.userDesiredObjective === 'Engagement'
      ? 'إعلانات تفاعل وبوستات ورواج للمحتوى (Engagement)'
      : payload.userDesiredObjective === 'Traffic'
      ? 'إعلانات زيارات ونقرات للموقع (Traffic / Clicks)'
      : payload.userDesiredObjective === 'LocalAwareness'
      ? 'إعلانات انتشار ووعي محلي حول المقر (Local Reach)'
      : 'لم يحدد بعد - يطلب من الذكاء الاصطناعي تحديد الأفضل بالكامل';

  const websitePixelLabel =
    payload.websiteAndPixelStatus === 'ready_pixel'
      ? 'متجر إلكتروني مربوط ببيكسل ميتا نشط وجاهز'
      : payload.websiteAndPixelStatus === 'website_no_pixel'
      ? 'يوجد موقع ولكن بدون بيكسل أو قيد الإنشاء'
      : 'لا يوجد موقع إلكتروني (يعتمد على الشات والواتساب والتليفون فقط)';

  const creativeAssetLabel =
    payload.creativeAssetFormat === 'vertical_video'
      ? 'فيديو ريلز/تيك توك مصور حقيقي للمنتج أو الطبيب'
      : payload.creativeAssetFormat === 'graphic_images'
      ? 'تصاميم وصور فوتوشوب وإعلانات جرافيك'
      : payload.creativeAssetFormat === 'motion_graphics'
      ? 'فيديو موشن جرافيك وأنيميشن ثلاثي الأبعاد'
      : 'لا يملك محتوى حالياً (يحتاج أفكار للتصوير بالموبايل)';

  const salesClosingLabel =
    payload.salesClosingMethod === 'instant_chat'
      ? 'رد فوري على الشات في أقل من 15 دقيقة'
      : payload.salesClosingMethod === 'telesales'
      ? 'مبيعات هاتفية وكول سنتر مباشر (Telesales)'
      : payload.salesClosingMethod === 'direct_online_checkout'
      ? 'دفع أونلاين مباشر بالفيزا على الموقع دون شات'
      : 'رد يدوي متأخر نسبياً (خلال ساعات)';

  const targetGenderLabel =
    payload.targetGender === 'women'
      ? 'نساء فقط (Women)'
      : payload.targetGender === 'men'
      ? 'رجال فقط (Men)'
      : 'الجميع (رجال ونساء)';

  const uspLabel = payload.uniqueSellingProposition || 'توفير أعلى جودة وقيمة وسعر تنافسي مع ضمان معتمد';

  const prompt = `
أنت خبير ميديا باير ومستشار تسويق رقمي أول في منصة ووكالة MarkNCode.
قاعدة صارمة: لا تذكر أبداً أي إشارة إلى Google أو Gemini؛ أنت دائماً محرك وخبير الذكاء الاصطناعي والميديا بايينج الحصري لـ MarkNCode.
بناءً على منتج [${payload.productOrServiceName}] ذو السعر [${pricePointLabel}] الذي يحل مشكلة [${payload.painPoint}] في منطقة [${locationScopeLabel}] مع طبيعة عميل [${customerTypeLabel}]، أعطني:
1. ثلاثة اهتمامات (Interests) دقيقة لوضعها في مدير إعلانات ميتا (Meta Ads Manager).
2. سلوكيات شرائية (Behaviors) تناسب الفئة السعرية.
3. الفئة العمرية الأنسب (Age Range).

المعطيات التفصيلية للحملة:
- اسم المنتج / الخدمة: ${payload.productOrServiceName} (${payload.businessTypeName})
- الفئة السعرية للمنتج: ${pricePointLabel}
- المشكلة الرئيسية التي يحلها لعميله (Pain Point): ${payload.painPoint}
- النطاق الجغرافي: ${locationScopeLabel}
- طبيعة العميل المستهدف: ${customerTypeLabel}
- الجنس المستهدف: ${targetGenderLabel}
- الهدف الإعلاني الذي اختاره العميل بنفسه: ${userDesiredObjectiveLabel}
- جاهزية الموقع والبيكسل: ${websitePixelLabel}
- نوع المحتوى الإعلاني المتاح: ${creativeAssetLabel}
- الميزة التنافسية الكبرى وسر التفوق (USP): ${uspLabel}
- طريقة إتمام المبيعات وسرعة الرد: ${salesClosingLabel}
- سعر البيع للجمهور: ${payload.sellingPrice} ج.م / عملة محلية
- هامش الربح التقريبي: ${payload.costOrMargin} ج.م
- إجمالي الميزانية المخصصة: ${payload.totalBudget} ج.م على مدار ${payload.campaignDays} يوم (بمعدل ${payload.dailyBudget} ج.م يومياً)
- المنصة المستهدفة: ${payload.platform}
- الدولة / السوق: ${payload.country}
- حالة العروض: ${payload.hasNoOffer ? 'العميل لا يملك عروضاً حالياً (أسعاره ثابتة ومبيديش خصومات - قم بتأليف عرض قيمة لا يقاوم Grand Slam Value-Add Offer بدون حرق أسعار)' : `نوع العرض الحالي: ${payload.offerType} (${payload.customOfferText || ''})`}
- الضمان وبناء الطمأنينة: ${payload.industryGuaranteeType}
- سرعة الرد والمتابعة: ${payload.responseSpeed}
- تفاصيل إضافية:
${JSON.stringify(payload.specifics, null, 2)}

التعليمات الصارمة للإخراج:
1. **استخراج اهتمامات متقاطعة (Lateral Interests)** بناءً على المشكلة الرئيسية التي يحلها المنتج بدلاً من الاستهداف المباشر الساذج.
2. **سلوكيات شرائية (Behaviors)** ملائمة للفئة السعرية (${pricePointLabel})؛ للمنتجات الفاخرة اقترح (أحدث أجهزة iPhone، المتسوقون المنفقون، المسافرون الدائمون).
3. **مولد استراتيجية الميزانية (Budget Allocator)**: قسّم الميزانية اليومية (${payload.dailyBudget} ج.م) بين اختبار الجمهور البارد (Cold Audience بنسبة 70% مثلاً) وإعادة الاستهداف (Retargeting بنسبة 30%).
4. **اختبار أ/ب التلقائي (A/B Testing Auto-Generator)**: ولّد دائماً زاويتين تسويقيتين متمايزتين لنفس المنتج (الزاوية A: عاطفة وفوات فرصة FOMO، والزاوية B: منفعة عقلانية ومنطق وجودة ROI).
5. **سكريبت ريلز/تيك توك مقسم بالثواني**: (0-3 ثوانٍ هوك بصري وصوتي يوقف التمرير، 4-10 ثوانٍ استثارة الألم وعرض المشكلة، 11-18 ثانية التحول والحل، 19-24 ثانية العرض، 25-30 ثانية الدعوة للإجراء).
6. **دليل حل المشكلات وقراءة النتائج (Troubleshooting Guide)**: حلول ملموسة لمشاكل الميديا باير (إذا كان CPC مرتفعاً قم بتغيير الصورة، إذا كان عدد النقرات كبيراً ولكن لا توجد مبيعات راجع صفحة الهبوط أو السعر، إذا كان التكرار Frequency > 2.5 بدّل الجمهور).
7. **حاسبة العائد والميزانية (ROI & Budget Calculator)**: حساب تكلفة الاستحواذ التقديرية (CPA)، وعدد المبيعات المتوقعة، وصافي الربح المتوقع، والـ ROAS.
8. **فحص الصح والغلط**: فحص مدة الحملة، الميزانية، وهندسة عرض قيمة (Grand Slam Offer) في حال غياب العروض.
9. **مستشار اختيار الهدف الإعلاني الأنسب ومقارنة اختيار المستخدم (User Choice vs AI Recommendation Deep Analysis)**:
- العميل اختار بنفسه هدف: [${userDesiredObjectiveLabel}].
- حدد (isUserChoiceOptimal): هل اختياره مناسب بالفعل ومطابق لأفضل ممارسات السوق واقتصاديات بيزنسه، أم يحمل مخاطرة عالية وهدر للميزانية؟
- في (userChoiceAnalysisVerdict): فصّل تحليل اختيار المستخدم؛ اذكر صراحة: إذا اختار Sales وميزانيته منخفضة أو ليس لديه موقع وبيكسل، وضّح له كارثة الـ Learning Phase ولماذا سيحرق فلوسه. وإذا اختار Messages لمنتج رخيص جداً أو عقار، وضّح له إيجابيات وسلبيات ذلك. وإذا اختار Traffic أو Engagement، حذّره بحزم من أن النقرات لا تجلب مبيعات.
- في (recommendedObjective): حدد الهدف الذي تراه أنت كخبير MarkNCode أنه الأحسن والأوفر له (recommendedObjective: 'Sales' أو 'Messages' أو 'Leads' أو 'Engagement').
- في (whyAiRecommendationIsBetter): اشرح بالأرقام والمنطق التسويقي لماذا توصيتك ستوفر عليه آلاف الجنيهات وتحقق أعلى معدل تحويل وأقل تكلفة رسالة/مبيعة.
- في (alternativeExecutionTacticForUserChoice): إذا كان العميل مصراً على تطبيق اختياره، أعطه أفضل خطة تكتيكية لتنفيذه بأقل خسائر ممكنة.
- إذا كان الهدف Sales: بيّن الفكرة الإعلانية وشكل صفحة الهبوط وتكتيك التحويل السريع.
- إذا كان الهدف Messages: بيّن الفكرة الإعلانية وضع "سكريبت شات تقفيل البيعة في واتساب (Chat Closing Script)" ويشمل: رسالة الترحيب الأولى، سؤال الفلترة الذكي، الرد على اعتراض "السعر غالي"، وتكتيك تقفيل الديل CTA!
- إذا كان الهدف Leads: بيّن الفكرة الإعلانية وأسئلة الفورم لفلترة الفضوليين.
10. **التعامل الصارم مع وضوح وتفصيل المنتج (Strict Product Specificity Rule)**:
- العميل يطلب صراحة: "أنا عايز اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص".
- إذا كان اسم المنتج أو المجال مختصراً أو عاماً، يجب عليك فوراً تحديد صنف وتخصص دقيق للمنتج وميزته التنافسية، وتوجيه تنبيه للمستخدم.
- صمّم كل الاستهداف والسكريبتات وزوايا أ/ب لهذا المنتج المفصل بالمللي دون أي كلام عام أو إنشائي مكرر!
11. **رفض الحروف العشوائية وخبط الكيبورد (Rejection of Gibberish & Non-words)**:
- إذا كان اسم المنتج أو المجال عبارة عن حروف عشوائية غير مفهومة (مثل "سبشسيىمىليسمنىلسيمنىممشسنب" أو "asdfghjk" أو خبط كيبورد بدون كلمات حقيقية)، إياك وتأليف استهداف أو التظاهر بفهم منتج وهمي!
- يجب عليك في (feasibilityVerdict) و (rightWrongAudits) التصريح بحزم: "المدخل المكتوب عبارة عن حروف عشوائية غير مفهومة ولا تمثل أي منتج أو خدمة حقيقية. القاعدة الصارمة: أنا عايز اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص."

أخرج النتيجة بصيغة JSON حصراً بدون أي نصوص تمهيدية:
\`\`\`json
{
  "score": 85,
  "feasibilityVerdict": "تشخيص عام للميزانية والجدوى الاقتصادية",
  "estimatedResults": "أرقام تقديرية للمبيعات/الليدات خلال مدة الحملة",
  "rightWrongAudits": [
    {
      "topic": "الموضوع",
      "userChoice": "ما اختاره المستخدم",
      "isCorrect": false,
      "statusText": "❌ تنبيه خطأ",
      "theWrong": "لماذا سيفشل",
      "theRight": "الصواب الإلزامي",
      "impactScore": "-20 نقطة"
    }
  ],
  "correctedGrandSlamOffer": "صياغة عرض مغري لا يقاوم بدون حرق الأسعار",
  "viralHooks": ["هوك 1", "هوك 2", "هوك 3"],
  "videoScript": {
    "hookSeconds": "🎬 (0 - 3 ثوانٍ)...",
    "painPointSeconds": "😩 (4 - 10 ثوانٍ)...",
    "solutionSeconds": "💡 (11 - 18 ثانية)...",
    "offerSeconds": "🎁 (19 - 24 ثانية)...",
    "ctaSeconds": "👉 (25 - 30 ثانية)..."
  },
  "adCopies": [
    {
      "type": "🔥 إعلان العرض المباشر",
      "headline": "العنوان",
      "primaryText": "النص الإعلاني",
      "ctaButton": "احجز / اطلب الآن"
    }
  ],
  "targeting": {
    "strategyType": "اسم الاستراتيجية",
    "ageRange": "الفئة العمرية",
    "gender": "النوع",
    "locations": "المناطق",
    "radiusTargeting": "النطاق الجغرافي",
    "interests": ["اهتمام مباشر 1", "اهتمام مباشر 2"],
    "lateralInterests": ["اهتمام متقاطع 1 مبني على المشكلة", "اهتمام متقاطع 2"],
    "behaviors": ["سلوك شرائي 1 بناءً على الفئة السعرية", "سلوك 2"],
    "exclusions": ["استبعاد 1", "استبعاد 2"],
    "placements": ["Instagram Reels (9:16)", "TikTok Feed"],
    "industrySecret": "سر الاستهداف لعام 2026"
  },
  "budgetFunnelAllocation": {
    "coldTestingPercent": 70,
    "coldTestingDaily": 350,
    "retargetingPercent": 30,
    "retargetingDaily": 150,
    "retargetingAdvice": "شرح توجيه ميزانية إعادة الاستهداف لزوار الصفحة والمتفاعلين مع الإعلان"
  },
  "abTestAngles": {
    "angleA": {
      "name": "زاوية الخوف من فوات الفرصة والشعور بالعاطفة (FOMO & Emotion)",
      "angleType": "fomo_urgency",
      "hook": "الخطاف العاطفي السريع",
      "primaryText": "نص الإعلان الذي يعتمد على الندرة والسرعة",
      "ctaButton": "احصل على نسختك قبل النفاد",
      "psychologySecret": "السر النفسي لهذه الزاوية"
    },
    "angleB": {
      "name": "زاوية المنطق والعائد والجودة بالأرقام (Rational & ROI)",
      "angleType": "rational_roi",
      "hook": "الخطاف المنطقي المعتمد على الأرقام",
      "primaryText": "نص الإعلان المعتمد على الجودة والمقارنة والضمان",
      "ctaButton": "اطلب بضمان استرجاع كامل",
      "psychologySecret": "السر النفسي لهذه الزاوية"
    }
  },
  "troubleshootingGuide": [
    {
      "kpiProblem": "سعر النقرة (CPC) مرتفع جداً",
      "diagnosis": "الهوك أول 3 ثوانٍ أو صورة الإعلان غير جاذبة ولا تثير فضول الشريحة المستهدفة",
      "actionToTake": "غيّر أول 3 ثوانٍ من الفيديو واستخدم هوك بصري صادم أو سؤال مباشر يمس مشكلتهم"
    },
    {
      "kpiProblem": "عدد النقرات كبير ولكن لا توجد رسائل أو مبيعات",
      "diagnosis": "احتكاك في صفحة الهبوط، أو سعر غير معلن، أو بطء في سرعة فتح المحادثة",
      "actionToTake": "راجع وضوح العرض في الصفحة وفعّل الرد التلقائي السريع على واتساب في أقل من دقيقة"
    },
    {
      "kpiProblem": "ارتفاع معدل التكرار (Frequency > 2.5) مع انخفاض النتائج",
      "diagnosis": "تشبع الجمهور الإعلاني (Ad Fatigue) وصغر حجم الشريحة المستهدفة",
      "actionToTake": "وسّع النطاق الجغرافي أو أطلق زاوية فيديو إعلانية جديدة تماماً لتجديد دماء الحملة"
    }
  ],
  "roiCalculations": {
    "totalBudget": 5000,
    "campaignDays": 7,
    "dailyBudget": 714,
    "estimatedCPA": 120,
    "estimatedConversions": 42,
    "expectedRevenue": 35700,
    "expectedGrossProfit": 15960,
    "expectedNetProfit": 10960,
    "expectedROAS": 7.1
  },
  "objectiveAdvisor": {
    "userSelectedObjective": "ما اختاره المستخدم (مثل: Sales أو Messages)",
    "userSelectedObjectiveArabicTitle": "اسم الهدف الذي اختاره العميل",
    "isUserChoiceOptimal": false,
    "userChoiceAnalysisVerdict": "تحليل عميق ومفصل لاختيار المستخدم: هل اختياره صائب أم يحرق ميزانيته وما هي عيوبه ومزاياه لاقتصاديات هذا المنتج بالتحديد؟",
    "whyAiRecommendationIsBetter": "لماذا توصية الذكاء الاصطناعي هي الأحسن والأوفر له بالأرقام ومعدل التحويل؟",
    "alternativeExecutionTacticForUserChoice": "خطة تكتيكية إذا أصر المستخدم على اختياره لتقليل المخاطر وتفادي الخسائر",
    "recommendedObjective": "Messages",
    "objectiveArabicTitle": "حملة رسائل واتساب مباشرة (Leads / Messaging)",
    "verdictReason": "تحليل عميق يوضح لماذا هذا الهدف هو الأوفر والأعلى تحويلاً لبيزنسك",
    "ifSalesStrategy": {
      "objectiveName": "Sales (مبيعات وتحويلات المتجر)",
      "whyUseThis": "متى تستخدمه",
      "executionIdea": "فكرة الإعلان لصفحة الهبوط",
      "creativeFormat": "فيديو ريلز مع شاشة نهاية توجّه للمتجر",
      "closingOrConversionTactic": "تكتيك الخصم المؤقت والشحن المجاني لتقليل ترك السلة",
      "recommendedBudgetMin": "1000 ج.م / يومياً"
    },
    "ifMessagesStrategy": {
      "objectiveName": "Messages / WhatsApp (محادثات البيع المباشر)",
      "whyUseThis": "متى تستخدمه ولماذا هو الأفضل لكسر تردد العميل",
      "executionIdea": "فكرة الإعلان لفتح الشات فوراً",
      "creativeFormat": "فيديو ريلز عمودي 9:16 مع زر واتساب مباشر",
      "closingOrConversionTactic": "استخدام سكريبت الرد الفوري ومتابعة العميل خلال أول 5 دقائق",
      "recommendedBudgetMin": "400 ج.م / يومياً"
    },
    "ifLeadsStrategy": {
      "objectiveName": "Leads (استمارات فورية Instant Forms)",
      "whyUseThis": "متى تستخدمه لتجميع بيانات العملاء الجادين",
      "executionIdea": "فكرة إعلان الاستمارة السريعة",
      "creativeFormat": "كاروسيل صور أو فيديو استشاري مع فورم 3 أسئلة",
      "closingOrConversionTactic": "الاتصال الهاتفي السريع في أول 15 دقيقة قبل أن يبرد العميل",
      "recommendedBudgetMin": "600 ج.م / يومياً"
    },
    "chatClosingScript": {
      "firstWelcomeMessage": "مرحباً بك يا فندم! 🌸 بخصوص استفسارك عن المنتج، يسعدنا خدمتك..",
      "qualifyingQuestion": "عشان نحدد العرض الأنسب لحضرتك، هل تبحث عن [خيار أ] أم [خيار ب]؟",
      "objectionHandlingExpensive": "فاهم وجهة نظرك تماماً يا فندم، لكن لما تحسب القيمة والضمان هتلاقي إنك بتوفر أضعاف أي بديل!",
      "closingCallToAction": "الدفعة دي متبقي منها قطع محدودة بالخصم الحالي، تحب نثبت حجزك بالاسم والعنوان للشحن اليوم؟"
    }
  },
  "policyRules": {
    "bannedWords": ["كلمات ممنوعة"],
    "criticalPitfalls": ["أخطاء سياسات"],
    "approvedPractices": ["ممارسات آمنة"],
    "algorithmSecret": "سر الخوارزميات"
  },
  "budgetBlueprint": {
    "phase1": "مرحلة الاختبار أول 72 ساعة",
    "phase2": "مرحلة التكبير والتوسع",
    "whenToKill": "متى توقف الإعلان",
    "whenToScale": "متى تضاعف الميزانية"
  },
  "customAiAdvice": "نصيحة ذهبية لصاحب البيزنس"
}
\`\`\`
`;

  try {
    const rawText = await callGeminiApiWithFallback(prompt, GEMINI_API_KEY);
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      const jsonSub = cleaned.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonSub) as GeneratedGeminiCampaign;
      parsed.isLiveGemini = true;
      return parsed;
    }
    throw new Error('Invalid JSON structure returned by Gemini');
  } catch (err: any) {
    console.warn('Gemini live API call encountered issue, activating intelligent local engine:', err.message);
    return buildIntelligentFallbackCampaign(payload);
  }
}

/**
 * Intelligent Fallback Campaign Generator tailored strictly to the business model
 */
function buildIntelligentFallbackCampaign(payload: BusinessConsultationPayload): GeneratedGeminiCampaign {
  const {
    businessType,
    productOrServiceName,
    sellingPrice,
    costOrMargin,
    dailyBudget,
    totalBudget,
    campaignDays,
    pricePoint,
    painPoint,
    hasNoOffer,
    industryGuaranteeType,
    country,
  } = payload;

  const price = Number(sellingPrice) || 1000;
  const margin = Number(costOrMargin) || 400;
  const daily = Number(dailyBudget) || 500;
  const days = Number(campaignDays) || 7;
  const total = Number(totalBudget) || daily * days;

  const audits: RightWrongItem[] = [];
  let score = 100;

  // 1. Duration & Budget Feasibility
  if (days < 5) {
    score -= 20;
    audits.push({
      topic: 'مدة تشغيل الحملة الإعلانية (Campaign Duration & Learning Phase)',
      userChoice: `تشغيل لمدة ${days} أيام فقط بإجمالي ميزانية ${total} ج.م`,
      isCorrect: false,
      statusText: '❌ خطأ قاتل: مدة قصيرة جداً لا تكفي لمرحلة التعلم الخوارزمي',
      theWrong: `خوارزميات ميتا وتيك توك تحتاج من 5 إلى 7 أيام وحوالي 50 عملية تحويل للخروج من مرحلة التعلم (Learning Phase) وفهم العميل المثالي. تشغيل إعلان لمدة ${days} أيام فقط يعني أنك ستوقف الحملة وهي في أسوأ أداء وأعلى تكلفة للرسالة، وتحرق ميزانيتك قبل أن تبدأ النتائج الحقيقية!`,
      theRight: `الصح: ضبط مدة الحملة على 7 إلى 14 يوماً على الأقل بمعدل ${daily} ج.م يومياً، لتمكين الخوارزمية من اختبار الجمهور واستقرار تكلفة الاكتساب.`,
      impactScore: '-20 نقطة',
    });
  } else {
    audits.push({
      topic: 'مدة تشغيل الحملة الإعلانية (Campaign Duration & Learning Phase)',
      userChoice: `تشغيل لمدة ${days} أيام بميزانية يومية ${daily} ج.م (إجمالي ${total} ج.م)`,
      isCorrect: true,
      statusText: '✔️ مدة زمنية كافية وممتازة لتدريب الخوارزمية',
      theWrong: 'التسرع وإيقاف الإعلانات قبل مرور 72 ساعة من التشغيل.',
      theRight: `المدة المختارة (${days} أيام) تمنح خوارزمية الإعلانات وقتاً كافياً لتجاوز مرحلة التعلم واستهداف الشريحة الأكثر تفاعلاً.`,
      impactScore: '+15 نقطة',
    });
  }

  // 2. Daily Budget Feasibility
  const minRecommendedDaily = Math.max(margin * 1.5, 400);
  if (daily < minRecommendedDaily) {
    score -= 20;
    audits.push({
      topic: 'الميزانية اليومية مقابل سعر المنتج (Budget vs Unit Economics)',
      userChoice: `${daily} ج.م يومياً لهامش ربح ${margin} ج.م`,
      isCorrect: false,
      statusText: '❌ فخ الميزانية الضعيفة: الحملة ستدخل في Learning Limited',
      theWrong: `أنت تطلب من الخوارزمية جلب عملاء بميزانية يومية (${daily} ج.م) أقل من تكلفة الاكتساب الطبيعية للمنتج. ستتعطل الحملة في مرحلة التعلم المحدود ولن تستقر أبداً!`,
      theRight: `الصح: رفع الميزانية اليومية إلى ${minRecommendedDaily} ج.م على الأقل لتغذية المزاد بالبيانات الكافية.`,
      impactScore: '-20 نقطة',
    });
  }

  // 3. Offer Status
  if (hasNoOffer) {
    score -= 25;
    audits.push({
      topic: 'استراتيجية العروض والحوافز التنافسية (Offer vs No-Offer Strategy)',
      userChoice: 'لا أملك أي عروض حالياً (أسعاري ثابتة بدون خصومات)',
      isCorrect: false,
      statusText: '❌ فخ الإعلان التقليدي: غياب العرض يرفع تكلفة الرسالة 3 أضعاف',
      theWrong: `إطلاق إعلان يطلب من العميل الشراء بسعر عادي بدون أي حافز يجعل إعلانك يبدو كإعلان ممل يسهل تجاوزه. العميل يفكر: "هبقى أكلمهم بعدين"، ولا يضغط على الإعلان نهائياً، مما يرفع تكلفة النقرة والرسالة لأرقام خيالية!`,
      theRight: `الصح: ليس بالضرورة حرق أسعارك أو تقديم خصومات نقدية تقلل من هيبتك! الصح هو تقديم "عرض قيمة مضاف" (Value-Add Offer) مثل: باقة كشف وأشعة مجانية للعيادة، أو شحن مجاني عند طلب قطعتين، أو إضافة ملحقات هدية تكلفة إنتاجها رمزية، لتحفيز العميل على اتخاذ القرار فوراً!`,
      impactScore: '-25 نقطة',
    });
  }

  // 4. Product / Domain Specificity Check
  const rawProduct = (productOrServiceName || '').trim();
  const genericKeywords = ['دكتور', 'عيادة', 'ملابس', 'لبس', 'أكل', 'اكل', 'مطعم', 'كافيه', 'عقار', 'عقارات', 'منتج', 'خدمة', 'كورس', 'كورسات', 'تسويق', 'شوز', 'احذية', 'أحذية', 'شنط', 'ميكب', 'ميك اب', 'عطور', 'برفان', 'شركة', 'محل', 'استشارات', 'تجارة', 'بضاعة', 'حاجة'];
  const isVagueProduct = rawProduct.length < 5 || genericKeywords.includes(rawProduct.toLowerCase());

  if (isVagueProduct) {
    score -= 10;
    audits.push({
      topic: 'درجة تحديد وتفصيل المنتج والنشاط (Product Specificity Check)',
      userChoice: `إدخال عام: "${rawProduct}"`,
      isCorrect: false,
      statusText: '⚠️ تنبيه: اسم المنتج عام ومختصر جداً بحاجة لتفصيل',
      theWrong: `أنا محتاج اسم المنتج بالظبط أو المجال مفصل علشان أفهم منه ومقولكش أي حاجة وخلاص! كتابة اسم عام مثل (${rawProduct}) يجعل خوارزمية إعلانات ميتا وتيك توك تتخبط وتوجه الإعلان لجمهور عشوائي غير مهتم وتحرق ميزانيتك.`,
      theRight: `الصح: تحديد الموديل أو التخصص الدقيق (مثلاً: بدلاً من عيادة اكتب "عيادة زراعة وتجميل أسنان بالفينير"، وبدلاً من ملابس اكتب "براند عبايات خليجي كريب ملكي") حتى تذهب ميزانيتك للمشتري الحقيقي فوراً!`,
      impactScore: '-10 نقاط',
    });
  } else {
    audits.push({
      topic: 'درجة تحديد وتفصيل المنتج والنشاط (Product Specificity Check)',
      userChoice: `إدخال محدد: "${rawProduct}"`,
      isCorrect: true,
      statusText: '✔️ اسم منتج مفصل وواضح يسهل استهدافه بدقة',
      theWrong: 'كتابة مسميات عامة ومبهمة تشتت الخوارزمية وتزيد تكلفة الشراء.',
      theRight: `تحديد المنتج بهذا الوضوح (${rawProduct}) يمكّن الذكاء الاصطناعي وخوارزميات Ads Manager من استخراج الاهتمامات المتقاطعة للعميل الحقيقي بدقة 100%.`,
      impactScore: '+10 نقاط',
    });
  }

  // Calculate realistic ROI metrics
  const bLower = (businessType || '').toLowerCase();
  const isHighTicket = bLower.includes('realestate') || bLower.includes('عقار') || bLower.includes('مقاولات') || price > 50000;
  const isMedical = bLower.includes('medical') || bLower.includes('طب') || bLower.includes('عياد') || bLower.includes('دكتور');
  
  const estimatedCpa =
    isHighTicket
      ? Math.round(Math.max(daily * 0.25, 150))
      : isMedical
      ? Math.round(Math.max(daily * 0.12, 60))
      : Math.round(Math.max(margin * 0.35, 35));

  const estimatedConversions = Math.max(Math.round(total / estimatedCpa), 1);
  const expectedRevenue = estimatedConversions * price;
  const expectedGrossProfit = estimatedConversions * margin;
  const expectedNetProfit = expectedGrossProfit - total;
  const expectedRoas = Number((expectedRevenue / total).toFixed(1));

  // Dynamic Grand Slam Offer
  let customGrandSlamOffer = '';
  if (hasNoOffer) {
    if (isMedical) {
      customGrandSlamOffer = `🔥 عرض القيمة المصحح لعيادتك: فحص تشخيصي وأشعة ديجيتال مجانية بالكامل للمتابعين الجدد + خطة علاجية تفصيلية ومتابعة دورية مجاناً بعد [${productOrServiceName}] (بدون المساس بسعر كشفك الأساسي)!`;
    } else if (isHighTicket) {
      customGrandSlamOffer = `🔥 عرض القيمة المصحح: استشارة ودراسة جدوى تفصيلية مجانية 1-on-1 مع خبير متخصص + ضمان كتابي موثق على [${productOrServiceName}]!`;
    } else if (bLower.includes('food') || bLower.includes('مطعم') || bLower.includes('أكل')) {
      customGrandSlamOffer = `🔥 عرض الكومبو المصحح: اطلب [${productOrServiceName}] بسعرها العادي، واكسب فوراً (مشروب غازي مثلج + صوص إضافي مجاناً على أول أوردر)!`;
    } else {
      customGrandSlamOffer = `🔥 عرض الباقة المصحح: احصل على [${productOrServiceName}] بسعره الأصلي الثابت، مع (شحن/توصيل مجاني أو إضافة مكملة هدية + معاينة وفحص قبل الدفع)!`;
    }
  } else {
    customGrandSlamOffer = `🔥 العرض المغري المصمم: ${payload.offerType} على [${productOrServiceName}] مع ضمان خاص وتسهيلات فورية لأول المتواصلين هذا الأسبوع!`;
  }

  // Budget Funnel Split
  const coldTestingPercent = 70;
  const coldTestingDaily = Math.round(daily * 0.7);
  const retargetingPercent = 30;
  const retargetingDaily = daily - coldTestingDaily;

  // Lateral Interests based on Pain Point
  const lateralInterests =
    pricePoint === 'luxury'
      ? ['Luxury lifestyle', 'High-end mobile devices (iPhone 15/16 Pro)', 'Frequent International Travelers', 'First-class travel']
      : ['Engaged Shoppers', 'Personal care', 'Family budget', 'Discount shopping'];

  const userObj = payload.userDesiredObjective || 'Messages';
  const recObj: 'Sales' | 'Leads' | 'Messages' | 'Engagement' | 'LocalAwareness' = isHighTicket
      ? 'Leads'
      : (bLower.includes('ecommerce') && price < 1200 && payload.websiteAndPixelStatus === 'ready_pixel')
      ? 'Sales'
      : 'Messages';

    const userObjTitle =
      userObj === 'Sales'
        ? 'إعلانات المبيعات والتحويلات (Sales / Conversions)'
        : userObj === 'Messages'
        ? 'إعلانات رسائل ومحادثات واتساب (Messages / WhatsApp)'
        : userObj === 'Leads'
        ? 'إعلانات تجميع بيانات وليدز (Leads / Instant Forms)'
        : userObj === 'Engagement'
        ? 'إعلانات التفاعل والبوستات (Engagement)'
        : userObj === 'Traffic'
        ? 'إعلانات الزيارات والنقرات (Traffic)'
        : userObj === 'LocalAwareness'
        ? 'إعلانات الانتشار والوعي المحلي (Awareness)'
        : 'تفويض الذكاء الاصطناعي للاختيار';

    let userChoiceVerdict = '';
    let whyAiBetter = '';
    let altTactic = '';

    if (userObj === 'Sales') {
      if (payload.websiteAndPixelStatus === 'no_website') {
        userChoiceVerdict = `⚠️ فخ حرق ميزانية: اختيارك لهدف Sales (المبيعات) لا يصلح إطلاقاً لأنك لا تملك موقعاً إلكترونياً أو بيكسل ميتا نشط! إعلانات التحويلات تحتاج صفحة دفع وحدث Purchase لتتعلم الخوارزمية، وبدونها ستنفق ميزانيتك على زوار عشوائيين دون مبيعة واحدة.`;
        whyAiBetter = `توصية الخبير (${recObj}): الأوفر والأضمن لك بنسبة 100% هو إعلانات الرسائل أو الليدز لأنها تفتح شات واتساب وتلفون مباشر مع العميل وتغلق البيع دون الحاجة لتكاليف برمجة أو متجر!`;
        altTactic = `إذا أصررت على البيع الأونلاين: يجب إنشاء صفحة هبوط سريعة بنظام الدفع عند الاستلام مع ربط Pixel و CAPI فوراً قبل تشغيل أي إعلان.`;
      } else if (daily < 500) {
        userChoiceVerdict = `⚠️ مخاطرة في الميزانية: ميزانيتك اليومية (${daily} ج.م) أقل من الحد الأدنى المطلوب لخوارزمية التحويلات لتجاوز مرحلة الـ Learning Phase (50 عملية شراء أسبوعياً).`;
        whyAiBetter = `توصية الخبير (${recObj}): إعلانات الرسائل أو الليدز تمنحك كلفة اكتساب أقل بكثير وتسمح لك بتحقيق مبيعات بأي ميزانية متاحة.`;
        altTactic = `حسّن صفحة الهبوط لتكون من صفحة واحدة بسيطة مع عرض لا يقاوم وشحن مجاني لرفع نسبة الشراء.`;
      } else {
        userChoiceVerdict = `✔️ اختيار ممتاز ومطابق: لديك متجر/بيكسل وميزانية مناسبة. هذا الهدف سيوفر عليك إرهاق الرد اليدوي على الشات ويجلب مشتريات فورية بالفيزا.`;
        whyAiBetter = `توصيتنا متطابقة تماماً مع اختيارك! ركّز على تقليل خطوات الشراء ومتابعة السلات المتروكة.`;
        altTactic = `شغّل إعلانات Advantage+ Shopping Campaigns مع بيكسل محدث لتعظيم الـ ROAS.`;
      }
    } else if (userObj === 'Traffic' || userObj === 'Engagement') {
      userChoiceVerdict = `❌ تحذير خطير من حرق الميزانية: اختيارك لـ (${userObjTitle}) سيجلب لك آلاف النقرات أو اللايكات الرخيصة من أشخاص فضوليين لا يملكون أي نية للشراء أو الدفع!`;
      whyAiBetter = `توصية الخبير (${recObj}): إعلانات الرسائل أو المبيعات تجبر خوارزمية ميتا على البحث حصرياً عن العملاء المشترين الجادين (High-Intent Buyers).`;
      altTactic = `إذا كنت تريد رواجاً فقط، لا تنفق أكثر من 15% من ميزانيتك على هذا الهدف، وحوّل الباقي فوراً للرسائل أو المبيعات.`;
    } else if (userObj === 'Messages') {
      if (isHighTicket) {
        userChoiceVerdict = `💡 إعلانات الرسائل جيدة، لكن للعقارات والخدمات الكبرى تستهلك وقتاً هائلاً في الشات مع عملاء فضوليين يختفون بعد معرفة السعر.`;
        whyAiBetter = `توصية الخبير (Leads): نماذج الليدز تفلتر العميل الجاد عبر أسئلة (الميزانية، المدينة، التوقيت) قبل أن يتصل به فريق المبيعات.`;
        altTactic = `استخدم سكريبت فلترة آلي صارم على واتساب بحيث تسأل العميل عن ميزانيته وجديته في أول رسالة.`;
      } else {
        userChoiceVerdict = `✔️ اختيار مثالي ومطابق لتوصية الخبير! لمنتجك وسعرك (${price} ج.م)، إعلانات الرسائل هي الأعلى كسرًا للتردد والأرخص في كلفة المحادثة وتحقيق طلبات يومية.`;
        whyAiBetter = `توصيتنا مطابقة لاختيارك بنسبة 100%! الشات يتيح لك بناء ثقة وإقناع العميل وعرض مكملات للمنتج (Upsell).`;
        altTactic = `احرص على الرد في أول 5 دقائق باستخدام سكريبت الشات المقترح لرفع نسبة الشراء 3 أضعاف.`;
      }
    } else if (userObj === 'Leads') {
      userChoiceVerdict = `✔️ اختيار احترافي لجمع بيانات العملاء (اسم + هاتف + وقت تواصل).`;
      whyAiBetter = `توصية متطابقة مع طبيعة الخدمات التي تتطلب مكالمة هاتفية استشارية لإغلاق الصفقة.`;
      altTactic = `اتصل بالعميل في أول 15 دقيقة من تسجيل الفورم لضمان أعلى معدل تحويل قبل أن ينسى الإعلان.`;
    } else {
      userChoiceVerdict = `🤖 تم تحليل بياناتك بالكامل من الذكاء الاصطناعي واختيار الهدف الأوفر والأعلى مبيعات لاقتصاديات منتجك.`;
      whyAiBetter = `الهدف الموصى به (${recObj}) صُمم خصيصاً ليناسب سعر منتجك (${price} ج.م) وقدرتك التشغيلية.`;
      altTactic = `ابدأ بالهدف الموصى به مباشرة دون أي تشتيت.`;
    }

    const recArabicTitle = recObj === 'Leads'
      ? 'حملة تجميع بيانات العملاء المحتملين (Leads / Instant Forms)'
      : recObj === 'Sales'
      ? 'حملة مبيعات وتحويلات مباشرة (Sales / Conversions)'
      : 'حملة رسائل ومحادثات واتساب مباشرة (Messages / WhatsApp)';

    const verdictReasonText = isHighTicket
      ? `نظراً لطبيعة البيزنس وسعر الخدمة المرتفع (${price} ج.م)، العميل لن يدفع بضغطة زر أونلاين. الأفضل والأنسب هو حملة Leads مع نموذج سريع (Instant Form) يجمع اسم ورقم وميعاد الاتصال المناسب ليقوم فريق المبيعات بإغلاق الصفقة هاتفياً.`
      : (bLower.includes('ecommerce') && price < 1200 && payload.websiteAndPixelStatus === 'ready_pixel')
      ? `المنتج ذو سعر اقتصادي/متوسط (${price} ج.م) وقرار الشراء فيه سريع ولا يحتاج لمحادثة طويلة ولديك بيكسل مجهز. هدف Sales مع توجيه لصفحة دفع سريعة هو الأوفر لتكلفة الشراء وسيوفر عليك تكلفة موظفي الشات.`
      : `الهدف الأفضل والأوفر لـ [${productOrServiceName}] هو (Messages / WhatsApp). الجمهور العربي يفضل السؤال عن التفاصيل والتأكد من المعاينة والضمان قبل الطلب. الشات يمنحك فرصة رفع متوسط قيمة السلة (Upselling) وإغلاق الديل في الحال.`;

    return {
      score: Math.max(score, 65),
      feasibilityVerdict: `خطة تسويقية موجهة بالكامل لـ [${productOrServiceName}]، بميزانية يومية ${daily} ج.م مقسمة بين الاستكشاف وإعادة الاستهداف. تم فحص ملاءمة هدفك الإعلاني وتحديد النموذج الأوفر والأعلى عائداً لبيزنسك.`,
      estimatedResults: `متوقع تحقيق ما بين ${Math.round(estimatedConversions * 0.8)} إلى ${Math.round(estimatedConversions * 1.3)} عميل محتمل/طلب مؤكد خلال ${days} يوماً بمعدل عائد على الإنفاق تقريبي ${expectedRoas}x ROAS.`,
      rightWrongAudits: audits,
      correctedGrandSlamOffer: customGrandSlamOffer,
      viralHooks: [
        `⚠️ "سر لو عرفته في [${productOrServiceName}] هيوفر عليك آلاف الجنيهات وتجارب فاشلة.. اسمع الـ 30 ثانية دول!"`,
        `🔥 "أغلب اللي اشتروا [${productOrServiceName}] اكتشفوا المشكلة دي متأخر.. إزاي تضمن حقك قبل ما تدفع قرش؟"`,
        `💡 "ليه العرض ده تحديداً على [${productOrServiceName}] محقق أعلى تقييم هذا الشهر؟ التفاصيل في أول كومنت!"`,
      ],
      videoScript: {
        hookSeconds: `🎬 0-3 ثوانٍ: (لقطة مقربة جذابة للمنتج/الخدمة) - "لو بتفكر تطلب [${productOrServiceName}] الأسبوع ده، استنى متستعجلش.. في تفصيلة مهمة لازم تعرفها الأول!"`,
        painPointSeconds: `😩 4-10 ثوانٍ: "كتير بيقعوا في فخ المنتجات المقلدة أو الخدمات بدون ضمان، والنتيجة فلوس بتضيع وتجربة تضايق، خصوصاً مع مشكلة [${painPoint || 'التكلفة والجودة'}]."`,
        solutionSeconds: `💡 11-18 ثانية: "عشان كده صممنا [${productOrServiceName}] عشان يديك الجودة الأصلية 100% مع راحة بال كاملة."`,
        offerSeconds: `🎁 19-24 ثانية: "${customGrandSlamOffer}"`,
        ctaSeconds: `👉 25-30 ثانية: "الكمية المتاحة بالعرض ده محدودة جداً.. اضغط على الزر تحت الفيديو وابعتلنا على الواتساب أو اطلب الآن قبل انتهاء الخصم!"`,
      },
      adCopies: [
        {
          type: '🔥 إعلان العرض والندرة (FOMO & Urgency)',
          headline: `عرض خاص ومحدود على ${productOrServiceName} ⏳`,
          primaryText: `مستني إيه؟ 🚀\n\nدلوقتي تقدر تحصل على [${productOrServiceName}] مع:\n✔️ ${customGrandSlamOffer.slice(0, 80)}\n✔️ ${industryGuaranteeType}\n\n⚠️ متبقي عدد محدود جداً بالسعر الحالي.\n👇 اضغط على الزر واطلب نسختك قبل نفاد الكمية!`,
          ctaButton: userObj === 'Sales' ? 'اطلب الآن وادفع عند الاستلام 🛒' : 'تواصل معنا على واتساب الآن 💬',
        },
        {
          type: '💡 إعلان القيمة والجودة والضمان (Social Proof & Value)',
          headline: `الحل الأضمن لـ ${productOrServiceName} مع ضمان كامل 🛡️`,
          primaryText: `بدل ما تجرب في غير المضمون وتخسر فلوسك..\n\nمع [${productOrServiceName}]، بنقدملك:\n1️⃣ جودة معتمدة بدون أي تنازلات.\n2️⃣ حل عملي لمشكلة ${painPoint || 'التكلفة وسرعة الإنجاز'}.\n3️⃣ ${industryGuaranteeType}.\n\nشفافية كاملة من أول لحظة. اضغط واستفسر عن التفاصيل في ثوانٍ!`,
          ctaButton: 'اعرف كل التفاصيل والأسعار 📋',
        },
      ],
      targeting: {
        strategyType: 'الاستهداف المتقاطع بالاهتمامات العريضة والمشكلات (Broad & Lateral Targeting)',
        ageRange: isHighTicket ? '30 - 60 سنة' : '22 - 50 سنة',
        gender: payload.targetGender === 'women' ? 'نساء فقط (Women)' : payload.targetGender === 'men' ? 'رجال فقط (Men)' : 'رجال ونساء (All)',
        locations: country,
        radiusTargeting: payload.locationScope === 'radius_5_10km' ? 'نطاق 5-10 كم محلي' : 'المدينة أو الدولة كاملة',
        interests: [
          `${productOrServiceName}`,
          `${bLower.includes('medical') ? 'الصحة والعناية' : bLower.includes('ecommerce') ? 'تسوق أونلاين' : 'خدمات وأعمال'}`,
          'الجودة والماركات الموثوقة',
        ],
        lateralInterests: [
          `حل مشكلة ${painPoint ? painPoint.slice(0, 25) : 'توفير الوقت والمال'}`,
          'المهتمين بالعروض والقيمة العالية',
          'المشترون المتفاعلون (Engaged Shoppers)',
          ...lateralInterests,
        ],
        behaviors: [
          pricePoint === 'luxury' ? 'أصحاب الهواتف الحديثة (iPhone 14/15/16 Pro)' : 'المتسوقون المنفقون أونلاين',
          'المستخدمون المتفاعلون عبر الهاتف المحمول',
        ],
        exclusions: ['المسوقون وأصحاب الصفحات الإعلانية الأخرى'],
        placements: ['Instagram Reels (9:16)', 'Facebook Reels', 'TikTok Feed'],
        industrySecret: 'سر خوارزمية 2026: خوارزميات ميتا وتيك توك أصبحت ذكاء اصطناعي يفهم محتوى الفيديو المسموع والمكتوب (Creative-Led Targeting)؛ لذلك جودة وقوة أول 3 ثوانٍ في الفيديو هي التي تحدد نوعية العميل الذي يصلك بنسبة 80%!',
      },
      budgetFunnelAllocation: {
        coldTestingPercent: coldTestingPercent,
        coldTestingDaily: coldTestingDaily,
        retargetingPercent: retargetingPercent,
        retargetingDaily: retargetingDaily,
        retargetingAdvice: `وجّه ${retargetingDaily} ج.م يومياً لحملة إعادة استهداف (Custom Audience) موجهة لكل من شاهد 50% من فيديوهاتك أو زار صفحتك/متجرك في آخر 30 يوماً مع عرض حاسم لحصد المترددين!`,
      },
      abTestAngles: {
        angleA: {
          name: 'زاوية الخوف من فوات الفرصة والشعور بالندرة (FOMO & Urgency)',
          angleType: 'fomo_urgency',
          hook: `⚠️ "لو لسه مجربتش [${productOrServiceName}].. الكمية دي آخر دفعة بالسعر الحالي قبل زيادة الأسعار الرسمية!"`,
          primaryText: `الفرصة مبتكررش كتير.. ⏳\n\nأكتر من 500 عميل حجزوا أماكنهم هذا الأسبوع للاستفادة من [${customGrandSlamOffer.slice(0, 70)}].\n\nباقي 12 مكاناً فقط متاحاً للحجز بالأولوية!\n\n👇 اضغط الآن واحجز مكانك قبل اكتمال العدد!`,
          ctaButton: 'احجز مكانك قبل انتهاء العرض ⚡',
          psychologySecret: 'تعتمد هذه الزاوية على غريزة الخوف من الخسارة (Loss Aversion) التي تجعل العميل يتحرك 3 أضعاف أسرع من الرغبة في المكسب.',
        },
        angleB: {
          name: 'زاوية المنطق والجدوى الاقتصادية والضمان (Rational & Proof)',
          angleType: 'rational_roi',
          hook: `💡 "ليه تدفع أرقام خيالية في [${productOrServiceName}] لما ممكن تاخد أعلى جودة معتمدة وبضمان رسمي موثق؟"`,
          primaryText: `الأرقام والتجربة مبتكدبش.. 📊\n\nبدلاً من إهدار فلوسك على تجارب غير مضمونة، [${productOrServiceName}] بيقدملك:\n✔️ حل نهائي لمشكلة ${painPoint || 'التكلفة والجودة'}.\n✔️ ${industryGuaranteeType}\n✔️ شفافية كاملة قبل دفع أي مليم.\n\nاستثمر صح واطلب استشارتك الآن!`,
          ctaButton: 'اطلب بضمان كامل الآن 🛡️',
          psychologySecret: 'تخاطب هذه الزاوية العقل التحليلي وتزيل الشكوك عبر البراهين والضمانات القاطعة.',
        },
      },
      troubleshootingGuide: [
        {
          kpiProblem: 'سعر النقرة مرتفع جداً (High CPC)',
          diagnosis: 'أول 3 ثوانٍ من الفيديو أو الصورة الافتتاحية ميتة ولا تجذب انتباه الجمهور المستهدف في أول لحظة.',
          actionToTake: 'غيّر الخطاف الافتتاحي (Hook) فوراً، واستخدم مشهداً سريعاً غير متوقع أو سؤالاً يلمس ألم العميل مباشرة.',
        },
        {
          kpiProblem: 'نقرات وتفاعل كثير لكن بدون رسائل أو مبيعات (High Clicks, Low Conversions)',
          diagnosis: 'تأخر في الرد على الواتساب، أو وجود سعر مفاجئ غير موضح، أو تعقيد في صفحة الحجز/الشراء.',
          actionToTake: 'فعّل شات بوت فوري للرد على الواتساب في أقل من دقيقة، واكتب تفاصيل السعر والشحن بوضوح تام دون مفاجآت خفية.',
        },
        {
          kpiProblem: 'ارتفاع معدل التكرار (Frequency > 2.5) مع تراجع المبيعات',
          diagnosis: 'تشبع الشريحة الإعلانية (Ad Fatigue)؛ الجمهور يرى نفس الإعلان مراراً وتكراراً وتجاهله.',
          actionToTake: 'وسّع الاستهداف الجغرافي أو أطلق فيديو بزاوية تسويقية جديدة تماماً (Switch between Angle A and Angle B).',
        },
        {
          kpiProblem: 'تكلفة الرسالة أو الليد ترتفع فجأة بعد أول يومين (CPA Spikes)',
          diagnosis: 'الخوارزمية حصدت الجمهور الأسهل في البداية والآن تبحث في الشريحة الأوسع؛ أو أنك قمت بتعديل الميزانية بشكل عنيف.',
          actionToTake: 'لا ترفع الميزانية بأكثر من 20% كل 48 ساعة، واترك الحملة مستقرة دون تعديلات جذرية أثناء مرحلة التعلم.',
        },
      ],
      roiCalculations: {
        totalBudget: total,
        campaignDays: days,
        dailyBudget: daily,
        estimatedCPA: estimatedCpa,
        estimatedConversions,
        expectedRevenue,
        expectedGrossProfit,
        expectedNetProfit,
        expectedROAS: expectedRoas,
      },
      policyRules: {
        bannedWords: [
          businessType === 'medical' ? 'مضمون 100%، علاج نهائي، تبييض سحري فوري، قبل وبعد (Before/After صريحة)' : 'مضمون 100%، أرباح خيالية، ثراء فوري، بدون أي مخاطرة',
        ],
        criticalPitfalls: [
          businessType === 'medical'
            ? 'استخدام صور Before/After صريحة ومقربة للأسنان أو الجلد (السبب الأول لحظر حسابات العيادات في Meta). الصح: استبدالها بفيديو رأي مريض سعيد يتحدث عن تجربته.'
            : 'عدم وضوح سياسة الاسترجاع والضمان، مما يقلل درجة موثوقية الصفحة (Customer Feedback Score) في فيسبوك ويتسبب في إيقاف الإعلانات.',
        ],
        approvedPractices: [
          'استخدام فيديوهات رأسية 9:16 مصورة بكاميرا الموبايل الطبيعية.',
          'توضيح الشروط والضمان بوضوح لزيادة ثقة المشاهد.',
        ],
        algorithmSecret:
          'خوارزمية 2026 لميتا وتيك توك: كل ثانية احتفاظ بالمشاهدة (Retention) في أول 5 ثوانٍ من الفيديو تخفض تكلفة الألف ظهور (CPM) وتجلب لك عملاء بجودة أعلى تلقائياً!',
      },
      budgetBlueprint: {
        phase1: `أول 3 أيام (مرحلة الاختبار Testing): شغّل الزاويتين (Angle A و Angle B) بحملة واحدة بميزانية ${daily} ج.م يومياً. لا تعدل أي شيء في أول 72 ساعة لتمكين الخوارزمية من فهم الجمهور!`,
        phase2: `اليوم الرابع حتى اليوم الـ ${days} (مرحلة التكبير Scaling): أوقف الزاوية الأضعف، وضاعف ميزانية الزاوية الرابحة بنسبة 20% كل 48 ساعة.`,
        whenToKill: `متى توقف الإعلان فوراً؟ إذا أنفق الإعلان ما يعادل ضعف هامش ربحك دون تحقيق رسائل جادة أو أي تفاعل تحويلي!`,
        whenToScale: `متى تضاعف الميزانية؟ عندما تحقق تكلفة رسالة أو ليد ممتازة ومعدل إغلاق صفقات مربح لمدة يومين متتاليين.`,
      },
      customAiAdvice: `نصيحة ذهبية من MarkNCode AI لـ ${productOrServiceName}: اختبر الزاويتين (العاطفية والمنطقية) معاً في أول 3 أيام، وستكتشف أي لغة هي التي تلمس جيب جمهورك بدقة!`,
      objectiveAdvisor: {
        recommendedObjective: recObj,
        objectiveArabicTitle: recArabicTitle,
        verdictReason: verdictReasonText,

        userSelectedObjective: userObj,
        userSelectedObjectiveArabicTitle: userObjTitle,
        isUserChoiceOptimal: userObj === recObj,
        userChoiceAnalysisVerdict: userChoiceVerdict,
        whyAiRecommendationIsBetter: whyAiBetter,
        alternativeExecutionTacticForUserChoice: altTactic,

        ifSalesStrategy: {
          objectiveName: 'Sales (مبيعات المتجر والتحويل المباشر)',
          whyUseThis: 'استخدمه إذا كان لديك متجر سريع أو صفحة هبوط ذات تحويل عالي، والمنتج واضح وسعره أقل من 1500 ج.م.',
          executionIdea: `فكرة إعلان Sales: فيديو ريلز سريع (15 ثانية) يعرض مشكلة [${painPoint || 'المعاناة اليومية'}] ثم يوضح كيف يحلها [${productOrServiceName}] في ثوانٍ، وينتهي بزر "اطلب الآن مع شحن مجاني والدفع بعد الاستلام".`,
          creativeFormat: 'فيديو ريلز عمودي 9:16 بنظام UGC + كاروسيل لأبرز الأصناف الأكثر مبيعاً.',
          closingOrConversionTactic: 'تفعيل زر الدفع بنقرة واحدة (One-Page Checkout) بدون إجبار العميل على إنشاء حساب، مع عداد تنازلي للعرض.',
          recommendedBudgetMin: `${Math.max(daily, 600)} ج.م / يومياً`,
        },
        ifMessagesStrategy: {
          objectiveName: 'Messages / WhatsApp (محادثات البيع المباشر)',
          whyUseThis: 'الخيار الأقوى والأعلى ربحية في السوق المصري والعربي لكسر تردد العميل وتثبيت الثقة فوراً.',
          executionIdea: `فكرة إعلان Messages: فيديو تصوير حقيقي للمنتج أو الخدمة من داخل المقر/العيادة، مع كول تو أكشن مباشر: "ابعتلنا رسالة على الواتساب بكلمة (عرض) عشان تاخد استشارتك أو باقتك بخصم فوري!".`,
          creativeFormat: 'فيديو عفوي تصوير كاميرا هاتف بدقة عالية مع زر WhatsApp أخضر بارز في الواجهة.',
          closingOrConversionTactic: 'الرد في أول 60 ثانية باستخدام سكريبت الترحيب والفلترة السريعة لرفع نسبة الشراء من 8% إلى أكثر من 30%!',
          recommendedBudgetMin: `${Math.max(daily, 400)} ج.م / يومياً`,
        },
        ifLeadsStrategy: {
          objectiveName: 'Leads (نماذج واستمارات تجميع بيانات العملاء الجادين)',
          whyUseThis: 'مثالي للخدمات المرتفعة، العقارات، المقاولات، والعيادات التخصصية التي تحتاج مكالمة هاتفية استشارية.',
          executionIdea: `فكرة إعلان Leads: فيديو استشاري يعرض قصة نجاح أو جولة بالمشروع، مع فورم سريع يطلب (الاسم + الهاتف + الموعد المفضل للتواصل + الميزانية التقريبية).`,
          creativeFormat: 'فيديو دراسة حالة (Case Study) أو جولة واقعية + نموذج Instant Form مدمج داخل ميتا.',
          closingOrConversionTactic: 'الاتصال بالعميل خلال أقل من 15 دقيقة من تسجيل الفورم لضمان سخونة الاهتمام وعدم التشتت.',
          recommendedBudgetMin: `${Math.max(daily, 500)} ج.م / يومياً`,
        },
        chatClosingScript: {
          firstWelcomeMessage: `أهلاً بحضرتك يا فندم! 🌸 بخصوص استفسارك عن [${productOrServiceName}]، يسعدنا مساعدتك.. بنفكرك إن متاح حالياً (${customGrandSlamOffer.slice(0, 60)}). تحب نوضح لحضرتك التفاصيل ولا تبحث عن نقطة معينة؟`,
          qualifyingQuestion: `عشان نحدد العرض والأنسب لحضرتك بدقة: هل مشكلتك الأساسية هي ${painPoint ? `[${painPoint}]` : 'البحث عن أفضل جودة وسرعة استلام'}؟`,
          objectionHandlingExpensive: `فاهم وجهة نظرك تماماً يا فندم! السعر فعلاً يعكس أعلى مستوى جودة وتوفير حقيقي على المدى الطويل، ومعاك (${industryGuaranteeType}). لما تحسبها هتلاقي إنك بتستثمر في راحة بالك ومضمونة بدون مصاريف وتجارب فاشلة!`,
          closingCallToAction: `حالياً في 3 حجوزات/طلبات فقط متبقية لعرض هذا الأسبوع. تحب نثبت حجزك اليوم ونبعتلك تأكيد الطلب فوراً؟`,
        },
      },
    };
}

/**
 * Interactive Chat with Gemini about the generated campaign
 */
export async function askGeminiFollowUp(
  userQuestion: string,
  campaignSummary: string,
  chatHistory: { role: 'user' | 'model'; text: string }[]
): Promise<string> {
  const systemContext = `
أنت كبير خبراء التسويق الرقمي والميديا بايينج في MarkNCode، وتتحدث مباشرة مع صاحب البيزنس الذي قام بإنشاء حملته عبر "اعمل إعلانك بنفسك".
قاعدة صارمة: لا تذكر إطلاقاً أنك Google Gemini أو نموذج من Google؛ أنت دائماً مستشار وخبير الذكاء الاصطناعي الخاص بـ MarkNCode.
سياق الحملة الحالية:
${campaignSummary}

قاعدة ذهبية صارمة: العميل يطلب صراحة: "أنا عايز اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص".
إذا كان سؤال المستخدم أو اسم منتجه عاماً أو مبهماً، وضّح له فوراً: "أنا محتاج أعرف اسم المنتج بالظبط أو مجالك مفصل علشان أقدر أساعدك وأفهم منه ومقولكش أي كلام عام وخلاص!".
أجب دائماً بأمثلة عملية، أرقام دقيقة، وتوجيهات ميدانية مخصصة للمنتج تحديداً.
`;

  const conversationParts = [
    { role: 'user', parts: [{ text: systemContext }] },
    { role: 'model', parts: [{ text: 'أهلاً بك! أنا مستشارك الإعلاني في MarkNCode، جاهز للإجابة على أي استفسار وتعديل السكريبتات أو الاستهداف بما يناسب بيزنسك تماماً.' }] },
    ...chatHistory.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    { role: 'user', parts: [{ text: userQuestion }] },
  ];

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: conversationParts,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err: any) {
      console.warn(`Chat model ${model} failed:`, err.message);
    }
  }

  // Graceful fallback response if all live calls temporarily unavailable
  return `بناءً على معايير بيزنس "${campaignSummary.slice(0, 40)}": للإجابة على سؤالك "${userQuestion}"، ننصحك بالتركيز على اختبار الزاوية المنطقية في مواجهة الزاوية العاطفية، وتثبيت الميزانية 48 ساعة لقياس تكلفة الرسالة الفعلية بدقة!`;
}
