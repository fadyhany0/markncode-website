import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  TextField,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Snackbar,
  CircularProgress,
  Stack,
  Divider,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  PlayArrow as PlayIcon,
  Verified as VerifiedIcon,
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon,
  RestartAlt as ResetIcon,
  AssignmentTurnedIn as AuditIcon,
  AutoAwesome as SparkleIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  Tune as TuneIcon,
  AccessTime as TimeIcon,
  WhatsApp as WhatsAppIcon,
  Calculate as CalculateIcon,
  CompareArrows as CompareIcon,
  MedicalServices as DoctorIcon,
  SupportAgent as SupportIcon,
  MenuBook as GuideIcon,
  Launch as LaunchIcon,
  Lightbulb as IdeaIcon,
  WarningAmber as WarningIcon,
  Close as CloseIcon,
  TrackChanges as TargetIcon,
  ShoppingCart as CartIcon,
  Contacts as LeadsIcon,
  Forum as ForumIcon,
  Download as ExportIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  PaymentMethod,
  PaymentStatus,
  PaymentOrder,
  PaymentOrderData,
  ADMIN_CONFIG,
  submitPaymentTransferRequest,
  checkPaymentStatus,
  approvePaymentOrder,
  rejectPaymentOrder,
  consumeSingleUseCredit,
  getLocalPaymentOrder,
  buildWhatsAppNotificationUrl,
} from '../services/paymentApprovalService';
import {
  generateAdCampaignWithGemini,
  askGeminiFollowUp,
  detectGibberish,
  GeneratedGeminiCampaign,
  PricePoint,
  LocationScope,
  CustomerType,
  DesiredObjective,
  WebsitePixelStatus,
  CreativeAssetFormat,
  SalesClosingMethod,
  TargetGender,
  BusinessConsultationPayload,
} from '../services/geminiService';

const GoogleSvgIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

const USP_SUGGESTIONS = [
  'معاينة وفحص واستبدال مجاني قبل دفع مليم 📦',
  'شحن وتوصيل فوري خلال 24 ساعة لجميع المحافظات 🚚',
  'ضمان استرجاع نقدي كامل 14 يوماً بدون أي تعقيد 🛡️',
  'استشارة وفحص تشخيصي مجاناً بالكامل للمتابعين 🩺',
  'أسعار جملة مباشرة من المصنع المستورد بدون وسيط 🏭',
  'خامات أصلية أوروبية مستوردة بضمان معتمد رسمي 🌟',
  'دعم ومتابعة شخصية دورية بعد الشراء أو الكشف 🤝',
];

const BUSINESS_FIELD_SUGGESTIONS = [
  'عيادات ومراكز طبية وتجميل',
  'تجارة إلكترونية وأزياء ومنتجات',
  'عقارات واستثمار وتسويق عقاري',
  'مطاعم وكافيهات وأغذية',
  'كورسات واستشارات وخدمات B2B',
  'تشطيبات وديكور ومقاولات',
  'صالونات ومراكز عناية شخصية',
  'خدمات سيارات وصيانة منزلية',
];

const PAIN_POINT_SUGGESTIONS = [
  'توفير المال والبحث عن أفضل سعر وجودة حقيقية دون غش',
  'توفير الوقت والمجهود والسرعة في الإنجاز والتوصيل',
  'الخوف من الخامات الرديئة والنصب والتجارب الفاشلة السابقة',
  'علاج مشكلة صحية أو مظهر محرج واستعادة الثقة بالنفس',
  'زيادة المبيعات والأرباح والتوسع التجاري وحل مشكلة الركود',
  'البحث عن راحة البال والضمان المعتمد والخدمة الراقية VIP',
];

const GUARANTEE_SUGGESTIONS = [
  'معاينة وفحص كامل أمام المندوب قبل دفع أي جنيه + استبدال مجاني',
  'شهادات ضمان دولية معتمدة على الخامات + فحص ومتابعة دورية مجانية',
  'عقد رسمي موثق بشروط جزائية واضحة على مواعيد التسليم والجودة',
  'ضمان استرداد الأموال بالكامل لو لم تتحقق النتائج المحددة بالعقد',
  'ضمان وصول الطلب ساخن وبأعلى جودة خلال 35 دقيقة أو استبداله مجاناً',
];

interface SpecificityFeedback {
  isVague: boolean;
  isGibberish: boolean;
  status: 'error' | 'warning' | 'success';
  message: string;
  example: string;
}

export const checkInputSpecificity = (product: string, field: string): SpecificityFeedback => {
  const pTrim = product.trim();
  const fTrim = field.trim();
  const combined = `${pTrim} ${fTrim}`.trim().toLowerCase();

  // 1. If empty or too short (< 3 chars)
  if (!combined || combined.length < 3) {
    return {
      isVague: true,
      isGibberish: false,
      status: 'error',
      message: 'أنا محتاج اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص!',
      example: 'مثال: اكتب "عيادة زراعة أسنان وفينير ديجيتال" أو "براند هوديات أوفر سايز شبابي" بدلاً من كلمة واحدة عامة.',
    };
  }

  // 2. Strict Gibberish & Keyboard Mashing Detection (كشف الحروف العشوائية وخبط الكيبورد)
  const productGibberish = detectGibberish(pTrim);
  if (pTrim && productGibberish.isGibberish) {
    return {
      isVague: true,
      isGibberish: true,
      status: 'error',
      message: `كلام غير مفهوم أو حروف عشوائية (${productGibberish.reason})! أنا عايز اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص.`,
      example: 'اكتب اسم منتجك أو خدمتك الحقيقية (مثال: "ساعات يد رجالي جلد فاخرة"، "عيادة جلدية وتجميل"، "براند ملابس نسائية").',
    };
  }

  const fieldGibberish = detectGibberish(fTrim);
  if (fTrim && fieldGibberish.isGibberish) {
    return {
      isVague: true,
      isGibberish: true,
      status: 'error',
      message: `المجال المكتوب عبارة عن حروف عشوائية (${fieldGibberish.reason})! أنا عايز اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص.`,
      example: 'اكتب مجال نشاطك الحقيقي (مثال: "عيادة أسنان"، "متجر أحذية"، "شركة تشطيبات وديكور").',
    };
  }

  const combinedGibberish = detectGibberish(combined);
  if (combinedGibberish.isGibberish) {
    return {
      isVague: true,
      isGibberish: true,
      status: 'error',
      message: `كلام غير مفهوم أو حروف عشوائية (${combinedGibberish.reason})! أنا عايز اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص.`,
      example: 'اكتب اسم وتفاصيل منتجك أو خدمتك الحقيقية بدقة.',
    };
  }

  // 3. Dictionary of generic words / phrases
  const genericDict: Record<string, string> = {
    'دكتور': 'اكتب تخصص العيادة الدقيق، مثلاً: "عيادة جلدية وليزر وفيلر" أو "عيادة أطفال وعلاج طبيعي".',
    'عيادة': 'اكتب تخصص العيادة والخدمة، مثلاً: "زراعة أسنان فورية بدون جراحة وتجميل ابتسامة هوليوود".',
    'عيادة اسنان': 'وضح تخصص العيادة بالتحديد (مثلاً: "عيادة زراعة أسنان فورية وتجميل فينير ديجيتال" أو "تقويم أسنان شفاف للأطفال والبالغين").',
    'عيادة أسنان': 'وضح تخصص العيادة بالتحديد (مثلاً: "عيادة زراعة أسنان فورية وتجميل فينير ديجيتال" أو "تقويم أسنان شفاف للأطفال والبالغين").',
    'طبيب': 'وضح تخصصك الطبي والخدمة المحددة التي تريد الإعلان عنها بدقة.',
    'ملابس': 'حدد نوع الملابس وخامتها وموديلاتها، مثلاً: "عبايات استقبال كريب ملكي تطريز يدوي" أو "بدل رجالي كاجوال تركي".',
    'لبس': 'حدد نوع وموديل اللبس بدقة ومين الفئة المستهدفة (أطفال، شباب، نسائي كاجوال).',
    'محل ملابس': 'وضح نوع الملابس وخامتها وموديلاتها (مثلاً: "براند عبايات خروج كريب ملكي تطريز يدوي" أو "ملابس أطفال قطنية تركية").',
    'أكل': 'اكتب نوع الأكل والأصناف بالتفصيل، مثلاً: "وجبات مكرونة سي فود عائلية" أو "ساندوتشات برجر سماش بالجبنة الشيدر".',
    'اكل': 'اكتب نوع الأكل والأصناف بالتفصيل، مثلاً: "وجبات مكرونة سي فود عائلية" أو "ساندوتشات برجر سماش بالجبنة الشيدر".',
    'مطعم': 'اكتب تخصص المطعم وأشهر وجبة بتقدمها، مثلاً: "مطعم بيتزا إيطالي حطب مع صوصات خاصة ودليفري سريع".',
    'كافيه': 'اكتب المشروبات المميزة أو مكان الكافيه، مثلاً: "كافيه ومكان مذاكرة وWork Space مجهز للطلبة والفريلانسرز".',
    'عقار': 'اكتب نوع العقار وموقعه وتسهيلاته، مثلاً: "شقق دوبلكس بالتقسيط على 8 سنوات في التجمع الخامس بدون فوائد".',
    'عقارات': 'اكتب نوع ومكان العقارات، مثلاً: "فيلات وشاليهات استلام فوري في الساحل الشمالي بالتقسيط".',
    'شوز': 'حدد نوع الحذاء وخامته، مثلاً: "كوتشيات فوت ورك طبية للمشي والجري مستوردة بأرضية ميموري فوم".',
    'كوتشي': 'حدد نوع الكوتشي وخامته، مثلاً: "كوتشيات طبية فوت ورك ميموري فوم مستوردة للمشي والرياضة".',
    'كوتشيات': 'حدد نوع الكوتشي وخامته، مثلاً: "كوتشيات طبية فوت ورك ميموري فوم مستوردة للمشي والرياضة".',
    'احذية': 'حدد نوع الأحذية، مثلاً: "أحذية جلد طبيعي كلاسيك للعمل والمناسبات الرسمية".',
    'أحذية': 'حدد نوع الأحذية، مثلاً: "أحذية جلد طبيعي كلاسيك للعمل والمناسبات الرسمية".',
    'شنط': 'حدد نوع الشنط وخامتها (مثلاً: "حقائب نسائية جلد طبيعي يدوي ماركة فاخرة").',
    'شنطة': 'حدد نوع الشنطة وخامتها واستخدامها (مثلاً: "حقائب ظهر جلد للسفر واللابتوب مقاومة للماء").',
    'حقائب': 'حدد نوع الحقائب (مثلاً: "حقائب سفر ترولي مقاومة للصدمات بضمان 3 سنوات").',
    'ساعات': 'حدد نوع ومواصفات الساعات (مثلاً: "ساعات يد رجالية كوارتز ستانلس ستيل مقاومة للماء مع علبة هدايا فاخرة").',
    'ساعة': 'حدد نوع الساعة ومواصفاتها (مثلاً: "ساعة ذكية تدعم قياس النبض والمكالمات وبطارية 7 أيام").',
    'عسل': 'حدد نوع العسل ومصدره وضمانه (مثلاً: "عسل سدر جبلي أصلي مفحوص معملياً مع ضمان استرجاع كامل").',
    'نظارات': 'حدد نوع النظارات (مثلاً: "نظارات شمسية بولارايزد أصلية مع حماية UV400 وإطار خفيف").',
    'فساتين': 'حدد موديل وخامة الفساتين (مثلاً: "فساتين سهرة وسواريه شيفون ملكي مطرزة باليد").',
    'فستان': 'حدد نوع الفستان ومناسبته (مثلاً: "فستان زفاف ملكي تفصيل خاص مع طرحة مطرزة").',
    'عبايات': 'حدد خامة وموديل العبايات (مثلاً: "عبايات خروج كريب سعودي ملكي مطرزة").',
    'كورس': 'اكتب اسم الكورس ومستواه، مثلاً: "كورس احتراف التجارة الإلكترونية والميديا بايينج من الصفر للمبتدئين مع تطبيق عملي".',
    'كورسات': 'اكتب تخصص الكورسات والمجال العلمي بدقة.',
    'تسويق': 'اكتب نوع خدمة التسويق، مثلاً: "إدارة وتصوير وإطلاق حملات إعلانات ممولة لشركات ومتاجر الملابس".',
    'شركة تسويق': 'وضح الخدمات التسويقية المقدمة بدقة (مثلاً: "إدارة وإطلاق حملات إعلانات ممولة لزيادة المبيعات على تيك توك وإنستجرام").',
    'شركة': 'وضح مجال نشاط الشركة بالضبط وتخصص خدماتها ومنتجاتها.',
    'محل': 'اكتب نشاط المحل ونوع البضاعة المعروضة وموقعك.',
    'منتج': 'اكتب اسم المنتج وخامته وميزته التنافسية بالتحديد.',
    'منتجات': 'اكتب اسم ونوع المنتجات المعروضة بالتحديد.',
    'خدمة': 'اكتب اسم وتفاصيل الخدمة وما تعالجه لعميلك بالتحديد.',
    'خدمات': 'اكتب تفاصيل ومجال الخدمات المقدمة.',
    'حاجة': 'اكتب اسم المنتج أو الخدمة بالتحديد وبدون اختصارات عامة.',
    'بضاعة': 'اكتب نوع المنتجات والأصناف بدقة.',
    'ميكب': 'اكتب نوع مستحضرات التجميل، مثلاً: "مجموعات ميكب عناية بالبشرة أصلية ومرطبات معتمدة طبياً".',
    'ميك اب': 'اكتب نوع مستحضرات التجميل، مثلاً: "مجموعات ميكب عناية بالبشرة أصلية ومرطبات معتمدة طبياً".',
    'عطور': 'اكتب نوع العطور، مثلاً: "عطور فرنسية وشرقية مخصصة تدوم 48 ساعة مع ضمان ثبات كامل".',
    'عطر': 'اكتب اسم ونوع العطر ونسبة ثباته وفوحانه.',
    'برفان': 'اكتب نوع البرفان ونسبة الثبات، مثلاً: "عطور أو دي بارفان فرنسية مستوردة بفوحان عالي وثبات 48 ساعة".',
    'استشارات': 'اكتب نوع الاستشارات ومجالها، مثلاً: "استشارات تأسيس شركات ودراسات جدوى اقتصادية للمشاريع الناشئة".',
    'تشطيب': 'اكتب نوع التشطيب، مثلاً: "باقات تشطيب شقق الترا سوبر لوكس بالتقسيط وضمان 5 سنوات".',
    'تشطيبات': 'اكتب باقات التشطيب والضمان (مثلاً: "تشطيب فلل وشقق تسليم مفتاح مع عقد موثق").',
    'مقاولات': 'اكتب تخصص المقاولات والأعمال الهندسية بدقة.',
    'سيارات': 'اكتب خدمة السيارات بالتحديد (مثلاً: "مركز صيانة ميكانيكا وفحص كمبيوتر لسيارات مرسيدس وبي إم").',
    'شحن': 'اكتب نوع الشحن وتغطيته (مثلاً: "خدمات شحن سريع للمحافظات والدول العربية للتجار والمتاجر").',
    'تجارة': 'وضح مجال ونوع التجارة والمنتجات المعروضة.',
    'بيع': 'اكتب ما تبيعه بالضبط وتفاصيل مواصفاته وخامته.',
    'مشروع': 'وضح فكرة وطبيعة المشروع ومنتجه الرئيسي.',
  };

  const words = combined.split(/\s+/).filter(Boolean);

  // 4. Exact dictionary matches for generic words or phrases
  for (const [key, eg] of Object.entries(genericDict)) {
    if (combined === key || (words.length <= 3 && words.includes(key))) {
      return {
        isVague: true,
        isGibberish: false,
        status: 'warning',
        message: `أنا عايز اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص! كلمة "${key}" عامة جداً وهتشتت الإعلان والاستهداف.`,
        example: eg,
      };
    }
  }

  // 5. Single Word Restriction: ANY single word is NOT detailed!
  if (words.length === 1) {
    const singleWord = words[0];
    return {
      isVague: true,
      isGibberish: false,
      status: 'warning',
      message: `أنا محتاج اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص! كلمة "${singleWord}" مختصرة جداً (كلمة واحدة) ولا تكفي لفهم جمهورك وسلوكياتهم.`,
      example: `وضح تفاصيل أكثر: نوعه، خامته، موديله، أو ما يحلّه لعميلك (مثلاً: بدلاً من "${singleWord}"، اكتب وصفاً كاملاً مثل: "${singleWord} أصلي مع ضمان الجودة وتوصيل سريع").`,
    };
  }

  // 6. Two Words Check: If only 2 words and total length is too brief (< 9 chars)
  if (words.length === 2 && combined.length < 9) {
    return {
      isVague: true,
      isGibberish: false,
      status: 'warning',
      message: 'الاسم مختصر جداً ويحتاج لتفاصيل إضافية ليتمكن الذكاء الاصطناعي من استخراج الاهتمامات المتقاطعة بدقة.',
      example: 'أضف تخصصك الدقيق، نوع الخامة، الفئة المستهدفة، أو المشكلة التي تعالجها.',
    };
  }

  // 7. Success: Detailed, Multi-word, Real Product/Service
  return {
    isVague: false,
    isGibberish: false,
    status: 'success',
    message: `تحديد دقيق ومفصل وممتاز! فهم الذكاء الاصطناعي طبيعة منتجك [${pTrim || fTrim}] بدقة، وسيصمم استهدافاً وسكريبتات فيديو تركز على العميل المشتري الفعلي.`,
    example: '',
  };
};

const CreateYourAd: React.FC = () => {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // 200 EGP Single-Use Payment Gate State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone_cash');
  const [senderPhoneInput, setSenderPhoneInput] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('none');
  const [activePaymentOrder, setActivePaymentOrder] = useState<PaymentOrder | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');

  // Admin Approval Modal State (when admin opens the link from Gmail / WhatsApp: ?approve_order=...)
  const [adminApprovalModalOpen, setAdminApprovalModalOpen] = useState<boolean>(false);
  const [adminOrderData, setAdminOrderData] = useState<PaymentOrderData | null>(null);
  const [adminCloudId, setAdminCloudId] = useState<string | null>(null);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState<boolean>(false);
  const [adminVerdictSuccess, setAdminVerdictSuccess] = useState<string>('');

  // 1. Admin link listener: ?approve_order=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const approveOrderId = params.get('approve_order');
    if (approveOrderId) {
      setAdminCloudId(approveOrderId);
      checkPaymentStatus(approveOrderId).then((data) => {
        if (data) {
          setAdminOrderData(data);
          setAdminApprovalModalOpen(true);
        }
      });
    }
  }, [location.search]);

  // 2. Client recovery on user change
  useEffect(() => {
    if (!user) {
      setPaymentStatus('none');
      setActivePaymentOrder(null);
      return;
    }

    // Restore saved plan if available so client never loses their generated plan
    try {
      const savedPlan = localStorage.getItem(`mnc_saved_plan_${user.email}`);
      if (savedPlan) {
        const parsed = JSON.parse(savedPlan);
        setAuditResult(parsed);
      }
    } catch (e) {}

    const localOrder = getLocalPaymentOrder(user.email);
    if (localOrder) {
      setActivePaymentOrder(localOrder);
      checkPaymentStatus(localOrder.data.orderId, user.email).then((serverData) => {
        if (serverData) {
          setPaymentStatus(serverData.status);
          setActivePaymentOrder({ cloudId: localOrder.cloudId, data: serverData });
        }
      });
    } else {
      // Also check if admin manually activated this user email
      checkPaymentStatus(undefined, user.email).then((serverData) => {
        if (serverData && serverData.status === 'approved') {
          setPaymentStatus('approved');
        }
      });
    }
  }, [user]);

  // 3. Client polling & real-time sync while paymentStatus === 'pending'
  useEffect(() => {
    if (!user || paymentStatus !== 'pending') return;

    // Cross-tab Instant Sync
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('mnc_payment_sync');
      bc.onmessage = (ev) => {
        if (
          ev.data &&
          ev.data.action === 'APPROVED' &&
          (!ev.data.userEmail || ev.data.userEmail.toLowerCase() === user.email.toLowerCase())
        ) {
          setPaymentStatus('approved');
          setSnackbarMessage('🎉 تم تأكيد استلام الـ 200 ج.م وتفعيل الحساب من لوحة الإدارة بنجاح!');
          setCopiedSnackbar(true);
        }
      };
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      const orderId = activePaymentOrder?.data?.orderId;
      if (
        (orderId && e.key === `mnc_approved_${orderId}` && e.newValue === 'true') ||
        (e.key === `mnc_approved_user_${user.email}` && e.newValue === 'true')
      ) {
        setPaymentStatus('approved');
        setSnackbarMessage('🎉 تم تفعيل الحساب من لوحة الإدارة بنجاح!');
        setCopiedSnackbar(true);
      }
    };
    window.addEventListener('storage', handleStorage);

    // Polling central status
    const interval = setInterval(async () => {
      const serverData = await checkPaymentStatus(activePaymentOrder?.data?.orderId, user.email);
      if (serverData) {
        if (serverData.status === 'approved') {
          setPaymentStatus('approved');
          if (activePaymentOrder) {
            setActivePaymentOrder({ cloudId: activePaymentOrder.cloudId, data: serverData });
          }
          setSnackbarMessage('🎉 تم تأكيد استلام الـ 200 ج.م من الإدارة بنجاح! تم فتح صانع الإعلانات لاستخدامك لمرة واحدة.');
          setCopiedSnackbar(true);
        } else if (serverData.status === 'rejected') {
          setPaymentStatus('rejected');
          if (activePaymentOrder) {
            setActivePaymentOrder({ cloudId: activePaymentOrder.cloudId, data: serverData });
          }
        }
      }
    }, 2500);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, [user, paymentStatus, activePaymentOrder]);

  const handleConfirmPayment = async () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    if (!senderPhoneInput.trim() || senderPhoneInput.trim().length < 5) {
      setPaymentError('يرجى كتابة رقم الموبايل أو الحساب الذي قمت بالتحويل منه بدقة.');
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentError('');

    try {
      const newOrder = await submitPaymentTransferRequest({
        userEmail: user.email,
        userName: user.name || user.email,
        senderPhone: senderPhoneInput.trim(),
        paymentMethod,
      });

      setActivePaymentOrder(newOrder);
      setPaymentStatus('pending');
      setIsSubmittingPayment(false);
      setSnackbarMessage('تم إرسال إشعار الدفع إلى الإدارة بنجاح! جاري مراجعة التحويل وتفعيل الحساب...');
      setCopiedSnackbar(true);
    } catch (err: any) {
      setIsSubmittingPayment(false);
      setPaymentError(err.message || 'حدث خطأ أثناء تسجيل الدفع، يرجى المحاولة ثانية.');
    }
  };

  const handleAdminApproveOrder = async () => {
    if (!adminCloudId) return;
    setIsAdminSubmitting(true);
    const ok = await approvePaymentOrder(adminCloudId, adminOrderData?.orderId);
    setIsAdminSubmitting(false);
    if (ok) {
      setAdminVerdictSuccess('تمت الموافقة وتفعيل الحساب للعميل بنجاح! تم فتح الأداة له الآن.');
      setTimeout(() => {
        setAdminApprovalModalOpen(false);
        setAdminVerdictSuccess('');
      }, 2500);
    } else {
      alert('حدث خطأ أثناء اعتماد الموافقة، يرجى إعادة المحاولة.');
    }
  };

  const handleAdminRejectOrder = async () => {
    if (!adminCloudId) return;
    setIsAdminSubmitting(true);
    const ok = await rejectPaymentOrder(adminCloudId, adminOrderData?.orderId);
    setIsAdminSubmitting(false);
    if (ok) {
      setAdminVerdictSuccess('تم رفض الطلب بنجاح (لم يتم استلام التحويل).');
      setTimeout(() => {
        setAdminApprovalModalOpen(false);
        setAdminVerdictSuccess('');
      }, 2000);
    }
  };

  const handleGoogleQuickSignIn = async () => {
    try {
      sessionStorage.setItem('post_auth_redirect', '/create-your-ad');
      await signInWithGoogle();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        alert('حدث خطأ أثناء تسجيل الدخول بـ Google: ' + (err.message || 'يرجى المحاولة مجدداً'));
      }
    }
  };

  // Consultation Stepper State
  const [activeStep, setActiveStep] = useState(0);

  // Business & Product Inputs (Free Text Fields)
  const [businessField, setBusinessField] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [painPoint, setPainPoint] = useState<string>('');
  const [customGuarantee, setCustomGuarantee] = useState<string>('');

  // Real-time specificity feedback evaluator (عايز اسم المنتج بالظبط أو المجال مفصل)
  const currentSpecificity = checkInputSpecificity(productName, businessField);

  // NEW: User Desired Objective Selection
  const [userDesiredObjective, setUserDesiredObjective] = useState<DesiredObjective>('Messages');

  // NEW: Additional Granular Inputs
  const [websiteAndPixelStatus, setWebsiteAndPixelStatus] = useState<WebsitePixelStatus>('no_website');
  const [creativeAssetFormat, setCreativeAssetFormat] = useState<CreativeAssetFormat>('vertical_video');
  const [salesClosingMethod, setSalesClosingMethod] = useState<SalesClosingMethod>('instant_chat');
  const [uniqueSellingProposition, setUniqueSellingProposition] = useState<string>('');
  const [targetGender, setTargetGender] = useState<TargetGender>('all');
  const [showUspSuggestions, setShowUspSuggestions] = useState<boolean>(false);

  // Toggles for Optional Suggestions ("متدهوش اختيارات إلا لو هو طلب اختيارات")
  const [showFieldSuggestions, setShowFieldSuggestions] = useState<boolean>(false);
  const [showPainPointSuggestions, setShowPainPointSuggestions] = useState<boolean>(false);
  const [showGuaranteeSuggestions, setShowGuaranteeSuggestions] = useState<boolean>(false);

  // Economics & Granular Targeting
  const [sellingPrice, setSellingPrice] = useState<number>(1500);
  const [profitMargin, setProfitMargin] = useState<number>(650);
  const [pricePoint, setPricePoint] = useState<PricePoint>('mid');
  const [locationScope, setLocationScope] = useState<LocationScope>('radius_5_10km');
  const [customerType, setCustomerType] = useState<CustomerType>('b2c');

  // Campaign Budget & Duration Allocation
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [campaignDays, setCampaignDays] = useState<number>(7);
  const dailyCalculatedBudget = Math.round(totalBudget / Math.max(campaignDays, 1));

  const [platform, setPlatform] = useState('Meta (Instagram & Facebook Reels)');
  const [country, setCountry] = useState('مصر 🇪🇬');

  // OFFER SECTION
  const [hasNoOffer, setHasNoOffer] = useState<boolean>(false);
  const [customOfferText, setCustomOfferText] = useState('');

  // Diagnostic State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatusIndex, setAnalysisStatusIndex] = useState(0);
  const [auditResult, setAuditResult] = useState<GeneratedGeminiCampaign | null>(null);
  const [activeResultTab, setActiveResultTab] = useState(0);
  const [copiedSnackbar, setCopiedSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Interactive MarkNCode AI Chat State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Interactive ROI & Bot Follow-up State
  const [customCpa, setCustomCpa] = useState<number>(0);
  const [botPhoneNumber, setBotPhoneNumber] = useState<string>('');
  const [botSubscribed, setBotSubscribed] = useState<boolean>(false);

  const ANALYSIS_STEPS = [
    '⚡ جاري التواصل مع MarkNCode وبدء إعداد الحملة...',
    '🎯 استخراج الاهتمامات المتقاطعة (Lateral Interests) بناءً على المشكلة الرئيسية...',
    '💰 ضبط السلوكيات الشرائية وفق الفئة السعرية (اقتصادي / متوسط / فاخر)...',
    '📊 هندسة حاسبة العائد والميزانية (ROI & Funnel Allocation)...',
    '⚖️ توليد اختبار أ/ب التلقائي (A/B Testing Angles: FOMO vs Logic)...',
    '🚀 اكتمال الخطة والتقرير المتكامل بنجاح!',
  ];

  const [guideModalOpen, setGuideModalOpen] = useState(false);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage(`تم نسخ ${label} بنجاح! 📋`);
    setCopiedSnackbar(true);
  };

  // Run the Business-Tailored MarkNCode AI Diagnostic Engine
  const handleRunDiagnostic = async () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    if (paymentStatus !== 'approved') {
      setSnackbarMessage('عفواً، يلزم تفعيل الاشتراك لمرة واحدة بـ 200 ج.م قبل توليد الخطة!');
      setCopiedSnackbar(true);
      return;
    }

    const effectiveName = productName.trim() || businessField.trim();
    const specificity = checkInputSpecificity(productName, businessField);

    if (specificity.isVague) {
      setActiveStep(0);
      setSnackbarMessage(
        specificity.message ||
        'أنا محتاج اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص!'
      );
      setCopiedSnackbar(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStatusIndex(0);

    const progressTimer = setInterval(() => {
      setAnalysisStatusIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 900);

    const effectivePainPoint = painPoint.trim() || 'توفير المال والوقت والحصول على أعلى جودة وضمان حقيقي';
    const effectiveGuarantee = customGuarantee.trim() || 'ضمان معتمد وبناء طمأنينة كاملة للعميل';

    const payload: BusinessConsultationPayload = {
      businessType: businessField.trim() || 'نشاط تجاري عام',
      businessTypeName: businessField.trim() || 'نشاط تجاري عام',
      productOrServiceName: productName.trim() || effectiveName,
      sellingPrice: Number(sellingPrice) || 1000,
      costOrMargin: Number(profitMargin) || 400,
      totalBudget: Number(totalBudget) || 5000,
      campaignDays: Number(campaignDays) || 7,
      dailyBudget: dailyCalculatedBudget,
      platform,
      country,
      pricePoint,
      painPoint: effectivePainPoint,
      locationScope,
      customerType,
      userDesiredObjective,
      websiteAndPixelStatus,
      creativeAssetFormat,
      salesClosingMethod,
      uniqueSellingProposition: uniqueSellingProposition.trim(),
      targetGender,
      specifics: {
        businessField: businessField.trim(),
        productName: productName.trim(),
        customGuarantee: effectiveGuarantee,
      },
      responseSpeed: 'رد سريع ومتابعة منتظمة',
      hasNoOffer,
      offerType: hasNoOffer ? 'لا يوجد عروض' : customOfferText.trim() || 'عرض خاص ومحدد',
      customOfferText,
      industryGuaranteeType: effectiveGuarantee,
      creativeAssetType: 'فيديو ريلز عمودي 9:16 مقسم بالثواني',
    };

    try {
      const result = await generateAdCampaignWithGemini(payload);
      clearInterval(progressTimer);
      setAuditResult(result);
      if (result.roiCalculations?.estimatedCPA) {
        setCustomCpa(result.roiCalculations.estimatedCPA);
      }
      setIsAnalyzing(false);
      setActiveResultTab(0);

      // Save generated plan locally so customer never loses access to it
      if (user?.email) {
        try {
          localStorage.setItem(`mnc_saved_plan_${user.email}`, JSON.stringify(result));
        } catch (e) {}
      }

      setSnackbarMessage('تم استخراج الاستهداف الدقيق وخطة أ/ب وحاسبة الأرباح بنجاح! 🚀');
      setCopiedSnackbar(true);

      setChatMessages([
        {
          role: 'model',
          text: `مرحباً بك! أنا مستشارك الإعلاني في MarkNCode. قمت بإنشاء استهداف دقيق لمنتجك "${effectiveName}"، وقمت بهندسة زاويتين تسويقيتين (A/B Test) وحاسبة العائد المتوقع. يمكنك سؤالي عن أي تفصيلة أو طلب المساعدة التقنية لربط الإعلانات! 🎯`,
        },
      ]);
    } catch (err: any) {
      clearInterval(progressTimer);
      setIsAnalyzing(false);
      setSnackbarMessage('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي، يرجى المحاولة ثانية.');
      setCopiedSnackbar(true);
    }
  };

  const handleStartNewCampaignPlan = () => {
    if (window.confirm('هل تريد إنهاء استعراض هذه الخطة وبدء إنشاء حملة إعلانية جديدة لمنتج آخر؟ سيتم استهلاك رصيد الاستخدام لمرة واحدة وتطلب الخطة الجديدة تفعيل 200 ج.م.')) {
      if (user?.email) {
        try {
          localStorage.removeItem(`mnc_saved_plan_${user.email}`);
        } catch (e) {}
        consumeSingleUseCredit(activePaymentOrder?.cloudId || '', user.email);
      }
      setAuditResult(null);
      setPaymentStatus('used');
      setProductName('');
      setBusinessField('');
      setActiveStep(0);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Handle interactive chat follow-up with MarkNCode AI Consultant
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !auditResult) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    const campaignSummary = `
النشاط: ${businessField || 'عام'}
المنتج: ${productName || 'المنتج'}
الفئة السعرية: ${pricePoint}
المشكلة: ${painPoint}
الميزانية الإجمالية: ${totalBudget} ج.م على مدار ${campaignDays} يوم
العرض: ${auditResult.correctedGrandSlamOffer}
    `;

    try {
      const reply = await askGeminiFollowUp(userMsg, campaignSummary, chatMessages);
      setChatMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'model', text: 'عذراً، حدث خطأ مؤقت في الاتصال، حاول إرسال سؤالك مرة أخرى.' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Technical SOS link to MarkNCode WhatsApp with exact phrasing requested
  const handleTechnicalSos = (contextTopic?: string) => {
    const topicLabel = contextTopic ? ` بخصوص [${contextTopic}]` : '';
    const message = encodeURIComponent(
      `مرحباً فريق MarkNCode، هل يبدو هذا معقداً؟ استخدمت أداة "اعمل إعلانك بنفسك" لحملتي (${productName || 'مشروعي'})${topicLabel}، وأود أن يقوم فريق Markncode بضبط الإعدادات التقنية والبيكسل وهيكل الحملة لي مرة واحدة. درجة جاهزية التقرير: ${auditResult?.score || 80}/100.`
    );
    window.open(`https://wa.me/201021025510?text=${message}`, '_blank');
  };

  // Automated 5-day post-launch WhatsApp bot follow-up setup
  const handleWhatsAppBotSetup = () => {
    const message = encodeURIComponent(
      `مرحباً فريق MarkNCode، أود تفعيل خدمة المتابعة الآلية بعد 5 أيام لحملتي (${productName || 'مشروعي'}) وربط إعلاناتي بنظام رد آلي على الواتساب (WhatsApp Bot) لعدم تضييع العملاء. رقمي للتواصل: ${botPhoneNumber || 'هذا الرقم'}.`
    );
    window.open(`https://wa.me/201021025510?text=${message}`, '_blank');
    setBotSubscribed(true);
    setSnackbarMessage('تم تسجيل طلب المتابعة الآلية وبوت الرد التلقائي بنجاح! 🤖');
    setCopiedSnackbar(true);
  };

  // Export and copy full campaign plan to clipboard
  const handleExportFullCampaignPlan = () => {
    if (!auditResult) return;
    const planText = `
=====================================================
📋 الخطة الإعلانية والتسويقية المتكاملة - MarkNCode AI Studio
=====================================================

📌 بيانات المشروع:
- النشاط: ${businessField || 'عام'}
- المنتج / الخدمة: ${productName || 'المنتج'}
- الفئة السعرية: ${pricePoint === 'luxury' ? 'فاخر 💎' : pricePoint === 'mid' ? 'متوسط 🌟' : 'اقتصادي 🏷️'}
- النطاق الجغرافي: ${locationScope === 'radius_5_10km' ? 'محيط 5-10 كم' : locationScope === 'city' ? 'مدينة محددة' : 'دولة كاملة'}
- الميزانية الإجمالية: ${totalBudget} ج.م على مدار ${campaignDays} أيام (بمعدل ${dailyCalculatedBudget} ج.م يومياً)
- الجدوى والتقييم: ${auditResult.score}/100 - ${auditResult.feasibilityVerdict}

-----------------------------------------------------
🎯 الهدف الإعلاني الموصى به (Objective Advisor):
-----------------------------------------------------
الهدف الأنسب لبيزنسك: ${auditResult.objectiveAdvisor?.objectiveArabicTitle || 'حملة رسائل ومحادثات واتساب'}
سبب التوصية:
${auditResult.objectiveAdvisor?.verdictReason || ''}

💡 الأفكار التنفيذية لكل هدف:
1. إذا اخترت Sales (مبيعات المتجر والتحويل المباشر):
- الفكرة الإعلانية: ${auditResult.objectiveAdvisor?.ifSalesStrategy?.executionIdea || ''}
- تكتيك التحويل: ${auditResult.objectiveAdvisor?.ifSalesStrategy?.closingOrConversionTactic || ''}
- أقل ميزانية يومية: ${auditResult.objectiveAdvisor?.ifSalesStrategy?.recommendedBudgetMin || ''}

2. إذا اخترت Messages (محادثات البيع المباشر على واتساب):
- الفكرة الإعلانية: ${auditResult.objectiveAdvisor?.ifMessagesStrategy?.executionIdea || ''}
- تكتيك التحويل والشات: ${auditResult.objectiveAdvisor?.ifMessagesStrategy?.closingOrConversionTactic || ''}
- أقل ميزانية يومية: ${auditResult.objectiveAdvisor?.ifMessagesStrategy?.recommendedBudgetMin || ''}

3. إذا اخترت Leads (نماذج تجميع بيانات العملاء الجادين):
- الفكرة الإعلانية: ${auditResult.objectiveAdvisor?.ifLeadsStrategy?.executionIdea || ''}
- تكتيك المتابعة والاتصال: ${auditResult.objectiveAdvisor?.ifLeadsStrategy?.closingOrConversionTactic || ''}
- أقل ميزانية يومية: ${auditResult.objectiveAdvisor?.ifLeadsStrategy?.recommendedBudgetMin || ''}

-----------------------------------------------------
💬 سكريبت شات تقفيل البيعة في واتساب (WhatsApp Closing Script):
-----------------------------------------------------
1. رسالة الترحيب الأولى:
"${auditResult.objectiveAdvisor?.chatClosingScript?.firstWelcomeMessage || ''}"

2. سؤال الفلترة السريع:
"${auditResult.objectiveAdvisor?.chatClosingScript?.qualifyingQuestion || ''}"

3. الرد على اعتراض "السعر غالي":
"${auditResult.objectiveAdvisor?.chatClosingScript?.objectionHandlingExpensive || ''}"

4. كول تو أكشن تقفيل الديل (Closing CTA):
"${auditResult.objectiveAdvisor?.chatClosingScript?.closingCallToAction || ''}"

-----------------------------------------------------
🔥 العرض الذي لا يقاوم (Grand Slam Offer):
-----------------------------------------------------
${auditResult.correctedGrandSlamOffer || ''}

-----------------------------------------------------
🎯 الاستهداف في مدير إعلانات ميتا (Meta Ads Manager):
-----------------------------------------------------
- الاستراتيجية: ${auditResult.targeting?.strategyType || ''}
- الفئة العمرية: ${auditResult.targeting?.ageRange || ''}
- الاهتمامات المباشرة: ${auditResult.targeting?.interests?.join(', ') || ''}
- الاهتمامات المتقاطعة (Lateral Interests): ${auditResult.targeting?.lateralInterests?.join(', ') || ''}
- السلوكيات الشرائية: ${auditResult.targeting?.behaviors?.join(', ') || ''}
- سر الميديا باير: ${auditResult.targeting?.industrySecret || ''}

-----------------------------------------------------
⚖️ زوايا اختبار أ/ب (A/B Testing Angles):
-----------------------------------------------------
الزاوية الأولى (A): ${auditResult.abTestAngles?.angleA?.name || ''}
- الهوك: ${auditResult.abTestAngles?.angleA?.hook || ''}
- نص الإعلان:
${auditResult.abTestAngles?.angleA?.primaryText || ''}

الزاوية الثانية (B): ${auditResult.abTestAngles?.angleB?.name || ''}
- الهوك: ${auditResult.abTestAngles?.angleB?.hook || ''}
- نص الإعلان:
${auditResult.abTestAngles?.angleB?.primaryText || ''}

-----------------------------------------------------
🎬 سكريبت الفيديو بالثواني (0 - 30 ثانية):
-----------------------------------------------------
- (0 - 3 ثوانٍ): ${auditResult.videoScript?.hookSeconds || ''}
- (4 - 10 ثوانٍ): ${auditResult.videoScript?.painPointSeconds || ''}
- (11 - 18 ثانية): ${auditResult.videoScript?.solutionSeconds || ''}
- (19 - 24 ثانية): ${auditResult.videoScript?.offerSeconds || ''}
- (25 - 30 ثانية): ${auditResult.videoScript?.ctaSeconds || ''}

-----------------------------------------------------
💰 تقسيم الميزانية وحاسبة العائد:
-----------------------------------------------------
- ميزانية الجمهور البارد (70%): ${auditResult.budgetFunnelAllocation?.coldTestingDaily || 0} ج.م / يومياً
- ميزانية إعادة الاستهداف (30%): ${auditResult.budgetFunnelAllocation?.retargetingDaily || 0} ج.م / يومياً
- المبيعات المتوقعة: ${auditResult.roiCalculations?.estimatedConversions || 0} مبيعة/عميل
- العائد المتوقع على الصرف (ROAS): ${auditResult.roiCalculations?.expectedROAS || 0}x ضعف

=====================================================
تم الإنشاء بواسطة: MarkNCode AI Ad Studio 🚀
`.trim();

    navigator.clipboard.writeText(planText);
    setSnackbarMessage('تم نسخ الخطة الإعلانية والتسويقية بالكامل! 📋 جاهزة للمشاركة والتنفيذ');
    setCopiedSnackbar(true);
  };

  // Reusable Technical SOS Card: "هل يبدو هذا معقداً؟ اضغط هنا ليقوم فريق Markncode بضبط الإعدادات التقنية لك مرة واحدة"
  const renderTechnicalSosBanner = (stepName: string) => (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.16) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.45)',
        borderRadius: '16px',
        p: 2.5,
        mt: 2.5,
        boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <SupportIcon sx={{ color: '#38bdf8', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
              هل يبدو هذا معقداً؟ 🛠️
            </Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
              اضغط هنا ليقوم فريق Markncode بضبط الإعدادات التقنية لك مرة واحدة ({stepName}).
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={() => handleTechnicalSos(stepName)}
          startIcon={<WhatsAppIcon />}
          sx={{
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            px: 3,
            py: 1,
            fontWeight: 800,
            fontSize: '0.88rem',
            whiteSpace: 'nowrap',
            alignSelf: { xs: 'stretch', md: 'auto' },
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            },
          }}
        >
          طلب النجدة التقنية من MarkNCode 💬
        </Button>
      </Box>
    </Card>
  );

  // Beginner Ad Launch Step-by-Step Guide
  const renderBeginnerAdLaunchGuide = () => (
    <Stack spacing={3}>
      {/* Warning Box: Boost Post Trap */}
      <Card
        sx={{
          bgcolor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '16px',
          p: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: 'rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WarningIcon sx={{ color: '#ef4444', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#f87171', fontWeight: 800 }}>
              🛑 الفخ الكبير الذي يحرق فلوسك: إياك وزر "ترويج المنشور / Boost Post" من الموبايل!
            </Typography>
            <Typography variant="body2" sx={{ color: '#fecaca', mt: 0.5, lineHeight: 1.6 }}>
              في تطبيق فيسبوك وإنستغرام على الموبايل، يظهر زر أزرق مغري اسمه <strong>ترويج المنشور (Boost Post)</strong>. هذا الزر مصمم لجلب لايكات وتعليقات سطحية من أشخاص فضوليين لا يشترون أبداً! لا يتيح لك الاستهداف المتقاطع، ولا السلوكيات الشرائية، ولا ربط زر واتساب المباشر، ولا قياس عائد المبيعات الفعلي.
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* The Real Professional Tool: Meta Ads Manager */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '18px',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LaunchIcon sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 800 }}>
                المكان الوحيد الصحيح: مدير إعلانات ميتا (Meta Ads Manager)
              </Typography>
              <Typography variant="caption" sx={{ color: '#93c5fd' }}>
                المنصة الرسمية المعتمدة لكل وكالات التسويق والمحترفين حول العالم
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            href="https://adsmanager.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<LaunchIcon />}
            sx={{
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              fontWeight: 800,
              px: 3,
            }}
          >
            فتح مدير الإعلانات الآن ↗
          </Button>
        </Box>

        <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 700, mb: 1 }}>
            📌 المتطلبات الثلاثة قبل البدء (تجهيز في 3 دقائق):
          </Typography>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 1.2, bgcolor: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>1. صفحة فيسبوك</Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>باسم ونشاط بيزنسك</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 1.2, bgcolor: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>2. حساب إنستغرام أعمال</Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>مربوط بصفحة الفيسبوك</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 1.2, bgcolor: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>3. وسيلة دفع بنكية</Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>فيزا / ماستركارد / ميزة</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* 4 Practical Step-by-Step Screens */}
      <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 800 }}>
        🪜 الخطوات العملية الأربعة داخل مدير الإعلانات (طبق تقريرنا فوراً):
      </Typography>

      {/* Level 1: Campaign */}
      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Chip label="المستوى 1" sx={{ bgcolor: '#2563eb', color: 'white', fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 800 }}>
            مستوى الحملة (Campaign Level) - تحديد الهدف الإعلاني
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
          1. اضغط على الزر الأخضر البارز في أعلى اليسار <strong>(+ Create / إنشاء)</strong>.<br />
          2. <strong>اختيار الهدف (Campaign Objective)</strong>:<br />
          • إذا أردت أن يراسلك العملاء فوراً على الواتساب أو الماسنجر: اختر <strong>"Leads (العملاء المحتملون)"</strong> أو <strong>"Engagement (التفاعل)"</strong> ثم حدد لاحقاً تطبيقات المراسلة.<br />
          • إذا كان لديك متجر إلكتروني وتريد مبيعات مباشرة: اختر <strong>"Sales (المبيعات)"</strong>.<br />
          3. اكتب اسم الحملة: (مثلاً: <code>حملة_{productName || 'منتجك'}_MarkNCode_AI</code>).
        </Typography>
      </Card>

      {/* Level 2: Ad Set */}
      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Chip label="المستوى 2" sx={{ bgcolor: '#059669', color: 'white', fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 800 }}>
            مستوى المجموعة الإعلانية (Ad Set Level) - الميزانية والاستهداف
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
          • <strong>الميزانية اليومية (Daily Budget)</strong>: اكتب <strong>{dailyCalculatedBudget || 500} ج.م / يومياً</strong> (المعدل المحسوب من تقريرنا).<br />
          • <strong>الجدول الزمني</strong>: حدد مدة التشغيل (مثلاً <strong>{campaignDays || 7} أيام</strong>).<br />
          • <strong>الموقع الجغرافي (Location)</strong>: حدد دولتك أو مدينتك، أو اختر دائرة 5 إلى 10 كم حول مقرك إن كنت محلاً أو عيادة.<br />
          • <strong>الاستهداف التفصيلي (Detailed Targeting) - هنا السر الذهبي!</strong>:<br />
          افتح صندوق الاهتمامات والصق ما أخرجه لك الذكاء الاصطناعي في تبويب الاستهداف:<br />
          &nbsp;&nbsp;1) الاهتمامات المباشرة (Direct Interests).<br />
          &nbsp;&nbsp;2) الاهتمامات المتقاطعة (Lateral Interests) المبنية على حل صداع عميلك.<br />
          &nbsp;&nbsp;3) السلوكيات الشرائية (Behaviors) المتطابقة مع الفئة السعرية لمنتجك.<br />
          • <strong>المواضع (Placements)</strong>: اختر Advantage+ Placements أو حدد يدوياً ريلز وفيسبوك وإنستغرام.
        </Typography>
      </Card>

      {/* Level 3: Ad Level */}
      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Chip label="المستوى 3" sx={{ bgcolor: '#d97706', color: 'white', fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 800 }}>
            مستوى الإعلان (Ad Level) - رفع الفيديو والنص وزر الواتساب
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
          • حدد صفحة الفيسبوك وحساب الإنستغرام الخاصين بك.<br />
          • <strong>رفع الفيديو (Media)</strong>: ارفع الفيديو العمودي (9:16) المصور باتباع سكريبت الريلز الموجود بالتبويب.<br />
          • <strong>النص الأساسي (Primary Text)</strong>: انسخ النص الإعلاني (Ad Copy) وزوايا أ/ب من التقرير والصقها مباشرة.<br />
          • <strong>العنوان الرئيسي (Headline)</strong>: اكتب عنوان جذاب يثير الفضول مثل (عرض لفترة محدودة ⚡).<br />
          • <strong>زر اتخاذ الإجراء (CTA)</strong>: اختر <strong>Send WhatsApp Message (إرسال رسالة واتساب)</strong> وضع رسالة ترحيبية آلية جاهزة مثل: "مرحباً، أود الاستفسار عن عرض {productName || 'المنتج'}".
        </Typography>
      </Card>

      {/* Level 4: Publish & Learning Phase */}
      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(147, 51, 234, 0.3)', borderRadius: '16px', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Chip label="المستوى 4" sx={{ bgcolor: '#7c3aed', color: 'white', fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 800 }}>
            المراجعة والنشر وقاعدة الـ 72 ساعة الذهبية
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
          • اضغط على الزر الأخضر في الأسفل: <strong>Publish (نشر)</strong> وانتظر مراجعة الإعلان وقبوله.<br />
          • ⚠️ <strong>القاعدة الذهبية التي يجهلها 90% من المبتدئين</strong>: بعد قبول الإعلان وبدء الصرف، <strong>إياك أن تعدل أي شيء في الميزانية أو الجمهور أو الفيديو لمدة 48 إلى 72 ساعة كاملة</strong>! خوارزميات ميتا تكون في "مرحلة التعلّم" (Learning Phase) لتتعرف على المشترين الحقيقيين، وأي تعديل مبكر يصفّر الخوارزمية ويحرق ميزانيتك.
        </Typography>
      </Card>

      {/* Technical SOS help banner */}
      {renderTechnicalSosBanner('المساعدة الفنية في ضبط الحساب الإعلاني وربط وسائل الدفع والبيكسل')}
    </Stack>
  );

  // Automated 5-day post-launch WhatsApp Bot Section
  const renderFollowUpBotSection = () => (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '20px',
        p: { xs: 2.5, sm: 3 },
        mt: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <WhatsAppIcon sx={{ color: '#10b981', fontSize: 28 }} />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#34d399' }}>
            المتابعة الآلية بعد 5 أيام من الإطلاق (بوت الواتساب التلقائي لـ MarkNCode) 🤖
          </Typography>
          <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
            نظام متكامل لتتبع أداء الحملة وربط الرد الآلي لعدم تضييع أي عميل
          </Typography>
        </Box>
      </Box>

      {/* Simulated Automated Follow-Up Message */}
      <Box
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.04)',
          border: '1px dashed rgba(16, 185, 129, 0.4)',
          borderRadius: '16px',
          p: 2.5,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip size="small" label="رسالة المتابعة بعد 5 أيام عبر بوت الواتساب" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#a7f3d0', fontWeight: 700 }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#f1f5f9', lineHeight: 1.7, fontSize: '0.92rem' }}>
          💬 <strong>"مرحباً، مر 5 أيام على إطلاق إعلانك. هل تواجه مشكلة في تتبع الرسائل أو تحتاج لربط إعلاناتك بنظام رد آلي على الواتساب لعدم تضييع العملاء؟ يمكننا تجهيز ذلك لك."</strong>
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          alignItems: 'stretch',
        }}
      >
        <TextField
          fullWidth
          placeholder="أدخل رقمك لتفعيل المتابعة وربط الرد الآلي على الواتساب..."
          value={botPhoneNumber}
          onChange={(e) => setBotPhoneNumber(e.target.value)}
          size="medium"
          sx={{
            '& input': {
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              py: 1.4,
            },
            '& input::placeholder': {
              color: 'rgba(255, 255, 255, 0.6) !important',
              opacity: 1,
            },
            bgcolor: 'rgba(15, 23, 42, 0.9)',
            borderRadius: '14px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '14px',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              '&:hover': { borderColor: '#34d399' },
              '&.Mui-focused': { borderColor: '#34d399' },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleWhatsAppBotSetup}
          startIcon={<WhatsAppIcon />}
          sx={{
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            px: 3.5,
            minHeight: 50,
            width: { xs: '100%', sm: 'auto' },
            fontWeight: 900,
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            },
          }}
        >
          {botSubscribed ? 'تم الاشتراك بنجاح ✔️' : 'تفعيل المتابعة والرد الآلي 🚀'}
        </Button>
      </Box>
    </Card>
  );

  // Campaign Objective Advisor (Sales vs Messages vs Leads) & WhatsApp Chat Closing Script
  const renderCampaignObjectiveAdvisor = () => {
    if (!auditResult) return null;
    const advisor = auditResult.objectiveAdvisor;
    if (!advisor) return null;

    return (
      <Stack spacing={3}>
        {/* User Choice vs AI Recommendation Deep Comparison Card */}
        <Card
          sx={{
            background: advisor.isUserChoiceOptimal
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)'
              : (userDesiredObjective === 'Traffic' || userDesiredObjective === 'Engagement')
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: `2px solid ${
              advisor.isUserChoiceOptimal
                ? '#10b981'
                : (userDesiredObjective === 'Traffic' || userDesiredObjective === 'Engagement')
                ? '#ef4444'
                : '#f59e0b'
            }`,
            borderRadius: '20px',
            p: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ fontSize: '2rem' }}>
                {advisor.isUserChoiceOptimal ? '🎯' : '⚖️'}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 800 }}>
                  تحليل مقارنة اختيارك الإعلاني مقابل توصية الذكاء الاصطناعي:
                </Typography>
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900 }}>
                  {advisor.isUserChoiceOptimal ? '✔️ اختيارك متوافق ومثالي لنشاطك!' : '⚠️ تنبيه: الذكاء الاصطناعي يقترح بديلاً أوفر وأعلى مبيعات'}
                </Typography>
              </Box>
            </Box>

            <Chip
              size="medium"
              label={
                advisor.isUserChoiceOptimal
                  ? '🟢 خيارك معتمد ومثالي لاقتصاديات منتجك'
                  : (userDesiredObjective === 'Traffic' || userDesiredObjective === 'Engagement')
                  ? '🔴 تحذير: هدر مالي ونقرات بلا شراء'
                  : '🟡 خيار يحمل مخاطرة وتكلفة إضافية'
              }
              sx={{
                bgcolor: advisor.isUserChoiceOptimal ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: advisor.isUserChoiceOptimal ? '#34d399' : '#fbbf24',
                fontWeight: 800,
                border: `1px solid ${advisor.isUserChoiceOptimal ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
              }}
            />
          </Box>

          <Grid container spacing={2}>
            {/* Box 1: What User Selected */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, height: '100%', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                    1️⃣ ما اخترته أنت بنفسك:
                  </Typography>
                  <Chip
                    size="small"
                    label={advisor.userSelectedObjectiveArabicTitle || userDesiredObjective}
                    sx={{ bgcolor: '#1e293b', color: '#38bdf8', fontWeight: 700 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#e2e8f0', lineHeight: 1.7, fontSize: '0.88rem', mb: 1.5 }}>
                  {advisor.userChoiceAnalysisVerdict || 'تم فحص الهدف الذي اخترته ومقارنته بمعايير السوق وميزانيتك.'}
                </Typography>
                {advisor.alternativeExecutionTacticForUserChoice && (
                  <Box sx={{ p: 1.2, bgcolor: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800, display: 'block' }}>
                      💡 خطتك التكتيكية لو صممت على اختيارك:
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#cbd5e1', lineHeight: 1.5, display: 'block', mt: 0.3 }}>
                      {advisor.alternativeExecutionTacticForUserChoice}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Box 2: What AI Recommends (The Better Option) */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, height: '100%', bgcolor: 'rgba(16, 185, 129, 0.06)', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#34d399', fontWeight: 800 }}>
                    2️⃣ التوصية الأوفر والأعلى مبيعات (AI Recommendation):
                  </Typography>
                  <Chip
                    size="small"
                    label={advisor.objectiveArabicTitle}
                    sx={{ bgcolor: '#059669', color: '#ffffff', fontWeight: 800 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#d1fae5', lineHeight: 1.7, fontSize: '0.88rem' }}>
                  {advisor.whyAiRecommendationIsBetter || advisor.verdictReason}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Recommended Objective Verdict Banner */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '20px',
            p: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TargetIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  🎯 التوصية الخوارزمية الحاسمة لـ {productName || 'منتجك'}:
                </Typography>
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 900 }}>
                  {advisor.objectiveArabicTitle}
                </Typography>
              </Box>
            </Box>

            <Chip
              size="medium"
              label={`الخيار الأوفر والأعلى عائداً لـ (${pricePoint === 'luxury' ? 'الفئة الفاخرة 💎' : pricePoint === 'mid' ? 'الفئة المتوسطة 🌟' : 'الفئة الاقتصادية 🏷️'})`}
              sx={{ bgcolor: 'rgba(16, 185, 129, 0.18)', color: '#34d399', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}
            />
          </Box>

          <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, display: 'block', mb: 0.5 }}>
              💡 لماذا هذا الهدف بالتحديد هو الأنسب لاقتصاديات بيزنسك وسلوك جمهورك؟
            </Typography>
            <Typography variant="body2" sx={{ color: '#e2e8f0', lineHeight: 1.7, fontSize: '0.92rem' }}>
              {advisor.verdictReason}
            </Typography>
          </Box>
        </Card>

        {/* 3 Dedicated Strategy Breakdown Cards */}
        <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 800 }}>
          💡 الأفكار التنفيذية لكل هدف: كيف تطلق إعلانك إذا اخترت Sales أم Messages أم Leads؟
        </Typography>

        <Grid container spacing={2.5}>
          {/* Option 1: Sales */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: advisor.recommendedObjective === 'Sales' ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '18px',
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {advisor.recommendedObjective === 'Sales' && (
                <Chip
                  size="small"
                  label="الأفضل لبيزنسك ⭐"
                  sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#0284c7', color: 'white', fontWeight: 800 }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <CartIcon sx={{ color: '#38bdf8', fontSize: 24 }} />
                <Typography variant="subtitle1" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                  1. هدف Sales (المبيعات)
                </Typography>
              </Box>

              <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>متى تختاره؟</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                    {advisor.ifSalesStrategy?.whyUseThis}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: 'rgba(56, 189, 248, 0.06)', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, display: 'block' }}>
                    💡 فكرة الإعلان وزاوية العرض:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#e0f2fe', fontSize: '0.86rem', mt: 0.5, lineHeight: 1.5 }}>
                    {advisor.ifSalesStrategy?.executionIdea}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>نوع وشكل الإعلان:</Typography>
                  <Typography variant="body2" sx={{ color: '#f1f5f9', fontSize: '0.85rem' }}>
                    {advisor.ifSalesStrategy?.creativeFormat}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>تكتيك تسريع الشراء:</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                    {advisor.ifSalesStrategy?.closingOrConversionTactic}
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                    💰 أقل ميزانية مقترحة: {advisor.ifSalesStrategy?.recommendedBudgetMin}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Option 2: Messages / WhatsApp */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: advisor.recommendedObjective === 'Messages' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '18px',
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {advisor.recommendedObjective === 'Messages' && (
                <Chip
                  size="small"
                  label="الأفضل لبيزنسك ⭐"
                  sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#059669', color: 'white', fontWeight: 800 }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <WhatsAppIcon sx={{ color: '#10b981', fontSize: 24 }} />
                <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 800 }}>
                  2. هدف Messages (واتساب)
                </Typography>
              </Box>

              <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700 }}>متى تختاره؟</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                    {advisor.ifMessagesStrategy?.whyUseThis}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700, display: 'block' }}>
                    💡 فكرة الإعلان وزاوية العرض:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d1fae5', fontSize: '0.86rem', mt: 0.5, lineHeight: 1.5 }}>
                    {advisor.ifMessagesStrategy?.executionIdea}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700 }}>نوع وشكل الإعلان:</Typography>
                  <Typography variant="body2" sx={{ color: '#f1f5f9', fontSize: '0.85rem' }}>
                    {advisor.ifMessagesStrategy?.creativeFormat}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700 }}>تكتيك الشات وتقفيل الديل:</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                    {advisor.ifMessagesStrategy?.closingOrConversionTactic}
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 800 }}>
                    💰 أقل ميزانية مقترحة: {advisor.ifMessagesStrategy?.recommendedBudgetMin}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Option 3: Leads */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                border: advisor.recommendedObjective === 'Leads' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '18px',
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {advisor.recommendedObjective === 'Leads' && (
                <Chip
                  size="small"
                  label="الأفضل لبيزنسك ⭐"
                  sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#d97706', color: 'white', fontWeight: 800 }}
                />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <LeadsIcon sx={{ color: '#f59e0b', fontSize: 24 }} />
                <Typography variant="subtitle1" sx={{ color: '#f59e0b', fontWeight: 800 }}>
                  3. هدف Leads (الاستمارات)
                </Typography>
              </Box>

              <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>متى تختاره؟</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                    {advisor.ifLeadsStrategy?.whyUseThis}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: 'rgba(245, 158, 11, 0.08)', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700, display: 'block' }}>
                    💡 فكرة الإعلان وزاوية العرض:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fef3c7', fontSize: '0.86rem', mt: 0.5, lineHeight: 1.5 }}>
                    {advisor.ifLeadsStrategy?.executionIdea}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>نوع وشكل الإعلان:</Typography>
                  <Typography variant="body2" sx={{ color: '#f1f5f9', fontSize: '0.85rem' }}>
                    {advisor.ifLeadsStrategy?.creativeFormat}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>تكتيك الاتصال والفلترة:</Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                    {advisor.ifLeadsStrategy?.closingOrConversionTactic}
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 800 }}>
                    💰 أقل ميزانية مقترحة: {advisor.ifLeadsStrategy?.recommendedBudgetMin}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* WhatsApp Chat Closing Script Card */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '20px',
            p: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ForumIcon sx={{ color: '#10b981', fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#34d399', fontWeight: 900 }}>
                  💬 سكريبت الشات المعتمد لتقفيل البيعة في واتساب (Chat Closing Script)
                </Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                  أكثر من 70% من أصحاب الأنشطة يخسرون عملاء إعلانات الرسائل بسبب الرد الخاطئ أو إرسال السعر فوراً! إليك سكريبت الـ 4 خطوات المعتمد:
                </Typography>
              </Box>
            </Box>

            <Button
              size="small"
              onClick={() =>
                handleCopyText(
                  `1. رسالة الترحيب الأولى:\n"${advisor.chatClosingScript?.firstWelcomeMessage}"\n\n2. سؤال الفلترة السريع:\n"${advisor.chatClosingScript?.qualifyingQuestion}"\n\n3. الرد على اعتراض "السعر غالي":\n"${advisor.chatClosingScript?.objectionHandlingExpensive}"\n\n4. كول تو أكشن تقفيل الديل:\n"${advisor.chatClosingScript?.closingCallToAction}"`,
                  'سكريبت الشات بالكامل'
                )
              }
              startIcon={<CopyIcon />}
              sx={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)', bgcolor: 'rgba(16, 185, 129, 0.1)' }}
            >
              نسخ السكريبت بالكامل
            </Button>
          </Box>

          <Stack spacing={2}>
            {/* Step 1: Welcome Message */}
            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', borderRight: '4px solid #38bdf8' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                  الخطوة 1: رسالة الترحيب الأولى (الرد الفوري خلال أول 60 ثانية)
                </Typography>
                <IconButton size="small" onClick={() => handleCopyText(advisor.chatClosingScript?.firstWelcomeMessage || '', 'رسالة الترحيب')}>
                  <CopyIcon sx={{ color: '#38bdf8', fontSize: 16 }} />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ color: '#e2e8f0', lineHeight: 1.6 }}>
                "{advisor.chatClosingScript?.firstWelcomeMessage}"
              </Typography>
            </Box>

            {/* Step 2: Qualifying Question */}
            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', borderRight: '4px solid #10b981' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 800 }}>
                  الخطوة 2: سؤال الفلترة الذكي (توجيه المحادثة وفهم احتياج العميل بدقة)
                </Typography>
                <IconButton size="small" onClick={() => handleCopyText(advisor.chatClosingScript?.qualifyingQuestion || '', 'سؤال الفلترة')}>
                  <CopyIcon sx={{ color: '#10b981', fontSize: 16 }} />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ color: '#e2e8f0', lineHeight: 1.6 }}>
                "{advisor.chatClosingScript?.qualifyingQuestion}"
              </Typography>
            </Box>

            {/* Step 3: Objection Handling */}
            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', borderRight: '4px solid #f59e0b' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 800 }}>
                  الخطوة 3: الرد الحاسم على اعتراض "السعر غالي / ليه أنتوا أغلى من غيركم؟"
                </Typography>
                <IconButton size="small" onClick={() => handleCopyText(advisor.chatClosingScript?.objectionHandlingExpensive || '', 'الرد على السعر غالي')}>
                  <CopyIcon sx={{ color: '#fbbf24', fontSize: 16 }} />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ color: '#e2e8f0', lineHeight: 1.6 }}>
                "{advisor.chatClosingScript?.objectionHandlingExpensive}"
              </Typography>
            </Box>

            {/* Step 4: Closing CTA */}
            <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', borderRight: '4px solid #c084fc' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 800 }}>
                  الخطوة 4: كول تو أكشن تقفيل الديل وتثبيت الحجز (Closing Action)
                </Typography>
                <IconButton size="small" onClick={() => handleCopyText(advisor.chatClosingScript?.closingCallToAction || '', 'كول تو أكشن تقفيل الديل')}>
                  <CopyIcon sx={{ color: '#c084fc', fontSize: 16 }} />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ color: '#e2e8f0', lineHeight: 1.6 }}>
                "{advisor.chatClosingScript?.closingCallToAction}"
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Meta Objectives Comparison Matrix */}
        <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', p: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#38bdf8', fontWeight: 800, mb: 2 }}>
            📊 مقارنة سريعة بين أهداف مدير إعلانات ميتا (Meta Ads Objectives Comparison):
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 620 }}>
              <Grid container sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '8px', fontWeight: 800, color: '#f8fafc', fontSize: '0.85rem' }}>
                <Grid item xs={2.5}>الهدف في ميتا</Grid>
                <Grid item xs={3}>ما تبحث عنه الخوارزمية</Grid>
                <Grid item xs={2.5}>الأنسب لـ</Grid>
                <Grid item xs={2}>يحتاج بيكسل وموقع؟</Grid>
                <Grid item xs={2}>ملاحظة ذهبية</Grid>
              </Grid>

              <Grid container sx={{ p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', fontSize: '0.85rem' }}>
                <Grid item xs={2.5} sx={{ color: '#34d399', fontWeight: 700 }}>💬 Messages / WhatsApp</Grid>
                <Grid item xs={3} sx={{ color: '#cbd5e1' }}>أشخاص معتادون على فتح الشات والتحدث</Grid>
                <Grid item xs={2.5} sx={{ color: '#cbd5e1' }}>العيادات، الخدمات، المنتجات +500 ج.م</Grid>
                <Grid item xs={2} sx={{ color: '#10b981', fontWeight: 700 }}>❌ لا (يكفي رقمك)</Grid>
                <Grid item xs={2} sx={{ color: '#93c5fd' }}>الأعلى كسرًا للتردد</Grid>
              </Grid>

              <Grid container sx={{ p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', fontSize: '0.85rem' }}>
                <Grid item xs={2.5} sx={{ color: '#38bdf8', fontWeight: 700 }}>🛒 Sales (Conversions)</Grid>
                <Grid item xs={3} sx={{ color: '#cbd5e1' }}>أشخاص يشترون ويدفعون أونلاين بالفيزا</Grid>
                <Grid item xs={2.5} sx={{ color: '#cbd5e1' }}>المتاجر الإلكترونية والمنتجات السريعة</Grid>
                <Grid item xs={2} sx={{ color: '#f59e0b', fontWeight: 700 }}>✔️ نعم (بيكسل إلزامي)</Grid>
                <Grid item xs={2} sx={{ color: '#93c5fd' }}>يوفر تكلفة موظفي الشات</Grid>
              </Grid>

              <Grid container sx={{ p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', fontSize: '0.85rem' }}>
                <Grid item xs={2.5} sx={{ color: '#fbbf24', fontWeight: 700 }}>📝 Leads (Instant Forms)</Grid>
                <Grid item xs={3} sx={{ color: '#cbd5e1' }}>أشخاص مستعدون لملء استمارة تواصل</Grid>
                <Grid item xs={2.5} sx={{ color: '#cbd5e1' }}>العقارات، المقاولات، B2B، الكورسات</Grid>
                <Grid item xs={2} sx={{ color: '#10b981', fontWeight: 700 }}>❌ لا (فورم داخلي)</Grid>
                <Grid item xs={2} sx={{ color: '#93c5fd' }}>اتصل في أول 15 دقيقة</Grid>
              </Grid>

              <Grid container sx={{ p: 1.5, alignItems: 'center', fontSize: '0.85rem' }}>
                <Grid item xs={2.5} sx={{ color: '#ef4444', fontWeight: 700 }}>⚠️ Traffic / الزيارات</Grid>
                <Grid item xs={3} sx={{ color: '#cbd5e1' }}>أشخاص يضغطون على الروابط فقط دون شراء</Grid>
                <Grid item xs={2.5} sx={{ color: '#cbd5e1' }}>المدونات والمقالات الإخبارية فقط</Grid>
                <Grid item xs={2} sx={{ color: '#cbd5e1' }}>اختياري</Grid>
                <Grid item xs={2} sx={{ color: '#fca5a5' }}>احذر: لا يجلب مبيعات!</Grid>
              </Grid>
            </Box>
          </Box>
        </Card>

        {/* Technical SOS help banner */}
        {renderTechnicalSosBanner('اختيار وتفعيل الهدف الإعلاني وربط حملة الرسائل أو المبيعات')}
      </Stack>
    );
  };

  return (
    <Box sx={{ bgcolor: '#020617', minHeight: '100vh', color: '#f8fafc', pb: 12 }}>
      {/* Hero Header */}
      <Box
        sx={{
          background: 'radial-gradient(ellipse at 50% -10%, #1e3a8a 0%, #0f172a 80%, #020617 100%)',
          pt: { xs: 14, md: 18 },
          pb: { xs: 8, md: 10 },
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Chip
              icon={<SparkleIcon sx={{ color: '#38bdf8 !important', fontSize: 18 }} />}
              label="مدعوم بمحرك الذكاء الاصطناعي لـ MarkNCode | استهداف دقيق + اختبار أ/ب + حاسبة الأرباح"
              sx={{
                mb: 3,
                bgcolor: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                fontWeight: 700,
                fontSize: { xs: '0.8rem', md: '0.92rem' },
                px: 2,
                py: 2.3,
                borderRadius: '50px',
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                fontSize: { xs: '2.1rem', sm: '3.1rem', md: '3.9rem' },
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                mb: 2.5,
                background: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 70%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              استشر Markncode بناءً على طبيعة وتفاصيل البيزنس بتاعك! 🎯
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: '#cbd5e1',
                maxWidth: 880,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.2rem' },
                lineHeight: 1.8,
                mb: 4,
                fontWeight: 500,
              }}
            >
              حدد الفئة السعرية، والمشكلة الكبرى التي تحلها لعميلك، ونطاقك الجغرافي.
              سيقوم <strong>محرك الذكاء الاصطناعي لـ MarkNCode</strong> بهندسة <strong>استهداف متقاطع دقيق</strong>، وتوليد <strong>اختبار أ/ب تلقائي (A/B Test)</strong>، وحساب العائد على استثمارك بالأرقام!
            </Typography>

            {/* Member Incentive Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
                justifyContent: 'center',
                p: { xs: 1.5, sm: 2 },
                borderRadius: '16px',
                bgcolor: 'rgba(16, 185, 129, 0.08)',
                border: '1px dashed rgba(16, 185, 129, 0.4)',
                maxWidth: 780,
                mx: 'auto',
              }}
            >
              <VerifiedIcon sx={{ color: '#10b981', fontSize: 24 }} />
              <Typography variant="body2" sx={{ color: '#a7f3d0', fontWeight: 600 }}>
                🎁 <strong>هدية للأعضاء:</strong> احفظ تقرير الاستهداف والسكريبتات مجاناً + دعم فني مباشر لربط إعلاناتك من MarkNCode!
              </Typography>
              {!user ? (
                <Stack direction="row" spacing={1}>
                  <Button
                    onClick={() => {
                      sessionStorage.setItem('post_auth_redirect', '/create-your-ad');
                      navigate('/signin?redirect=/create-your-ad');
                    }}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: '50px',
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      textTransform: 'none',
                      px: 2,
                    }}
                  >
                    تسجيل الدخول
                  </Button>
                  <Button
                    onClick={() => {
                      sessionStorage.setItem('post_auth_redirect', '/create-your-ad');
                      navigate('/signup?redirect=/create-your-ad');
                    }}
                    size="small"
                    variant="contained"
                    sx={{
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      textTransform: 'none',
                      px: 2,
                    }}
                  >
                    سجّل مجاناً ⚡
                  </Button>
                </Stack>
              ) : (
                <Chip size="small" label="أنت عضو مسجل ✅" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700 }} />
              )}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Main Diagnostic Workspace */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        {/* Auth Loading Spinner */}
        {authLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#38bdf8' }} />
          </Box>
        )}

        {/* Authenticated & Approved Member Greeting Bar */}
        {!authLoading && user && paymentStatus === 'approved' && (
          <Box
            sx={{
              mb: 3,
              p: 1.8,
              px: 3,
              borderRadius: '16px',
              bgcolor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <VerifiedIcon sx={{ color: '#10b981', fontSize: 24 }} />
              <Typography variant="body2" sx={{ color: '#a7f3d0', fontWeight: 700 }}>
                مرحباً بك، <strong>{user.name || user.email}</strong> 👋 | استخدامك لمرة واحدة مفعل وجاهز الآن (تم استلام 200 ج.م بنجاح ✅). يمكنك إعداد وتوليد خطة إعلانك بحرية كاملة!
              </Typography>
            </Box>
            <Chip size="small" label="استخدامك مفعل لمرة واحدة 🚀" sx={{ bgcolor: 'rgba(16, 185, 129, 0.3)', color: '#34d399', fontWeight: 800 }} />
          </Box>
        )}

        {/* Payment Review Pending Card */}
        {!authLoading && user && paymentStatus === 'pending' && (
          <Card
            sx={{
              mb: 6,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(217, 119, 6, 0.25) 100%)',
              border: '2px solid rgba(245, 158, 11, 0.7)',
              borderRadius: '28px',
              p: { xs: 3, sm: 4, md: 5 },
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(245, 158, 11, 0.25)',
            }}
          >
            <Box
              sx={{
                width: { xs: 68, sm: 76 },
                height: { xs: 68, sm: 76 },
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(251, 191, 36, 0.25) 100%)',
                border: '1.5px solid rgba(245, 158, 11, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
              }}
            >
              <PendingIcon sx={{ fontSize: { xs: 34, sm: 42 }, color: '#fbbf24' }} />
            </Box>

            <Chip
              size="small"
              label="⏳ جاري المراجعة والتأكيد من الإدارة"
              sx={{
                bgcolor: 'rgba(245, 158, 11, 0.2)',
                color: '#fef08a',
                border: '1.5px solid rgba(245, 158, 11, 0.5)',
                fontWeight: 800,
                fontSize: '0.85rem',
                mb: 2,
                px: 1.5,
                py: 0.5,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                mb: 2,
                fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.1rem' },
                lineHeight: 1.3,
              }}
            >
              طلبك قيد المراجعة وتأكيد استلام التحويل (200 ج.م)
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#e2e8f0',
                maxWidth: 680,
                mx: 'auto',
                mb: 3.5,
                lineHeight: 1.9,
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
              }}
            >
              تم إرسال إشعار تحويل الـ 200 ج.م من الرقم (<strong style={{ color: '#38bdf8' }}>{activePaymentOrder?.data?.senderPhone || senderPhoneInput}</strong>) عبر <strong style={{ color: '#34d399' }}>{paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'انستا باي'}</strong> إلى إدارة MarkNCode.
              <br />
              بمجرد مراجعة وتأكيد الاستلام، سيتم فتح الأداة تلقائياً أمامك على هذه الشاشة فوراً دون الحاجة لإعادة تحميل الصفحة!
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ maxWidth: 580, mx: 'auto', width: '100%' }}
            >
              {activePaymentOrder && (
                <Button
                  variant="contained"
                  onClick={() => {
                    const waUrl = buildWhatsAppNotificationUrl(
                      activePaymentOrder.data.orderId,
                      user.email,
                      user.name || user.email,
                      activePaymentOrder.data.senderPhone,
                      activePaymentOrder.data.paymentMethod
                    );
                    window.open(waUrl, '_blank');
                  }}
                  startIcon={<WhatsAppIcon sx={{ fontSize: 24 }} />}
                  sx={{
                    py: 1.6,
                    px: 3.5,
                    minHeight: 52,
                    borderRadius: '16px',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    },
                  }}
                >
                  تأكيد ومتابعة عبر واتساب 📲
                </Button>
              )}

              <Button
                variant="outlined"
                onClick={() => setPaymentStatus('none')}
                sx={{
                  py: 1.6,
                  px: 3,
                  minHeight: 52,
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  color: '#f1f5f9',
                  borderColor: 'rgba(255,255,255,0.3)',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    borderColor: '#38bdf8',
                    color: '#38bdf8',
                    bgcolor: 'rgba(56, 189, 248, 0.1)',
                  },
                }}
              >
                تعديل الرقم أو طريقة الدفع 🔄
              </Button>
            </Stack>
          </Card>
        )}

        {/* Payment Required Gate Card (Vodafone Cash & InstaPay) */}
        {!authLoading && user && paymentStatus !== 'approved' && paymentStatus !== 'pending' && !auditResult && (
          <Card
            sx={{
              mb: 6,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 58, 138, 0.5) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.5)',
              borderRadius: '28px',
              p: { xs: 2.5, sm: 4, md: 5 },
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(56, 189, 248, 0.25)',
            }}
          >
            <Box
              sx={{
                width: { xs: 68, sm: 80 },
                height: { xs: 68, sm: 80 },
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(56, 189, 248, 0.3) 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
                boxShadow: '0 0 35px rgba(56, 189, 248, 0.4)',
              }}
            >
              <WalletIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: '#38bdf8' }} />
            </Box>

            <Chip
              size="medium"
              label="💳 تكلفة الاستخدام: 200 جنيه مصري لمرة واحدة"
              sx={{
                bgcolor: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                border: '1.5px solid rgba(56, 189, 248, 0.5)',
                fontWeight: 900,
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                mb: 2.5,
                px: 2,
                py: 2.2,
                borderRadius: '12px',
              }}
            />

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #bae6fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
                lineHeight: 1.3,
              }}
            >
              تفعيل استخدام صانع الإعلانات (200 ج.م)
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#e2e8f0',
                maxWidth: 720,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.9,
                fontSize: { xs: '0.95rem', sm: '1.08rem' },
              }}
            >
              استخدام صانع الإعلانات وهندسة الاستهداف المتقاطع وسكريبتات الريلز وحاسبة العائد متاح بـ <strong style={{ color: '#38bdf8', fontSize: '1.15rem' }}>200 جنيه مصري للاستخدام لمرة واحدة</strong>.
              <br />
              اختر وسيلة الدفع التي تناسبك وقم بالتحويل، ثم اكتب رقمك واضغط <strong style={{ color: '#34d399' }}>"تم الدفع وتأكيد التحويل"</strong> ليتم تفعيل حسابك فوراً:
            </Typography>

            {/* Error or Used Alert */}
            {paymentStatus === 'used' && (
              <Alert severity="info" sx={{ mb: 3, maxWidth: 680, mx: 'auto', borderRadius: '14px', bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#ffffff', border: '1px solid rgba(56, 189, 248, 0.4)', fontWeight: 700 }}>
                🎉 تم استهلاك رصيدك السابق بنجاح. لتوليد خطة إعلانية جديدة، يرجى تفعيل استخدام جديد بـ 200 ج.م.
              </Alert>
            )}
            {paymentStatus === 'rejected' && (
              <Alert severity="error" sx={{ mb: 3, maxWidth: 680, mx: 'auto', borderRadius: '14px', fontWeight: 700 }}>
                تعذر التحقق من التحويل للطلب السابق. يرجى التأكد من تحويل الـ 200 ج.م وإعادة إرسال رقم التحويل الصحيح.
              </Alert>
            )}
            {paymentError && (
              <Alert severity="error" sx={{ mb: 3, maxWidth: 680, mx: 'auto', borderRadius: '14px', fontWeight: 700 }}>
                {paymentError}
              </Alert>
            )}

            {/* Payment Method Selection Cards */}
            <Box sx={{ maxWidth: 650, mx: 'auto', mb: 3.5 }}>
              <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900, mb: 2, textAlign: 'right', display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>⚡</span> اختر وسيلة الدفع التي تناسبك:
              </Typography>

              <Grid container spacing={2}>
                {/* Vodafone Cash Card */}
                <Grid item xs={12} sm={6}>
                  <Card
                    onClick={() => setPaymentMethod('vodafone_cash')}
                    sx={{
                      p: 2.5,
                      minHeight: 100,
                      cursor: 'pointer',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      textAlign: 'right',
                      position: 'relative',
                      transition: 'all 0.25s ease',
                      bgcolor: paymentMethod === 'vodafone_cash' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(15, 23, 42, 0.75)',
                      border: paymentMethod === 'vodafone_cash' ? '2.5px solid #ef4444' : '1.5px solid rgba(255,255,255,0.18)',
                      boxShadow: paymentMethod === 'vodafone_cash' ? '0 0 25px rgba(239, 68, 68, 0.35)' : 'none',
                      '&:hover': {
                        borderColor: '#ef4444',
                        transform: 'translateY(-2px)',
                        bgcolor: 'rgba(239, 68, 68, 0.15)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '16px',
                        bgcolor: '#e11d48',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.2rem',
                        flexShrink: 0,
                        boxShadow: '0 4px 15px rgba(225, 29, 72, 0.5)',
                      }}
                    >
                      VF
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.05rem' }}>
                          فودافون كاش
                        </Typography>
                        {paymentMethod === 'vodafone_cash' && (
                          <Chip
                            size="small"
                            label="مُختار ✓"
                            sx={{ bgcolor: '#ef4444', color: 'white', fontWeight: 900, height: 22, fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: paymentMethod === 'vodafone_cash' ? '#fecdd3' : '#cbd5e1', fontWeight: 600 }}>
                        Vodafone Cash Wallet
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                {/* InstaPay Card */}
                <Grid item xs={12} sm={6}>
                  <Card
                    onClick={() => setPaymentMethod('instapay')}
                    sx={{
                      p: 2.5,
                      minHeight: 100,
                      cursor: 'pointer',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      textAlign: 'right',
                      position: 'relative',
                      transition: 'all 0.25s ease',
                      bgcolor: paymentMethod === 'instapay' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(15, 23, 42, 0.75)',
                      border: paymentMethod === 'instapay' ? '2.5px solid #a855f7' : '1.5px solid rgba(255,255,255,0.18)',
                      boxShadow: paymentMethod === 'instapay' ? '0 0 25px rgba(168, 85, 247, 0.35)' : 'none',
                      '&:hover': {
                        borderColor: '#a855f7',
                        transform: 'translateY(-2px)',
                        bgcolor: 'rgba(168, 85, 247, 0.15)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '16px',
                        bgcolor: '#7c3aed',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.2rem',
                        flexShrink: 0,
                        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.5)',
                      }}
                    >
                      IP
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.05rem' }}>
                          انستا باي
                        </Typography>
                        {paymentMethod === 'instapay' && (
                          <Chip
                            size="small"
                            label="مُختار ✓"
                            sx={{ bgcolor: '#a855f7', color: 'white', fontWeight: 900, height: 22, fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: paymentMethod === 'instapay' ? '#e9d5ff' : '#cbd5e1', fontWeight: 600 }}>
                        InstaPay Egypt
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Transfer Details Card for the Selected Method */}
            <Card
              sx={{
                maxWidth: 650,
                mx: 'auto',
                p: { xs: 2.5, sm: 3.5 },
                mb: 4,
                borderRadius: '22px',
                bgcolor: 'rgba(15, 23, 42, 0.95)',
                border: paymentMethod === 'vodafone_cash' ? '2px solid rgba(244, 63, 94, 0.6)' : '2px solid rgba(168, 85, 247, 0.6)',
                textAlign: 'right',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{paymentMethod === 'vodafone_cash' ? '🔴' : '🟣'}</span>
                {paymentMethod === 'vodafone_cash' ? 'رقم محفظة فودافون كاش لتحويل الـ 200 ج.م:' : 'حساب / رقم انستا باي لتحويل الـ 200 ج.م:'}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: 1.5,
                  bgcolor: 'rgba(0,0,0,0.45)',
                  p: { xs: 1.8, sm: 2 },
                  borderRadius: '16px',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  mb: 2.5,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: '#38bdf8',
                    letterSpacing: '2px',
                    direction: 'ltr',
                    fontSize: { xs: '1.5rem', sm: '1.85rem' },
                    fontFamily: 'monospace',
                  }}
                >
                  {ADMIN_CONFIG.vodafoneCashNumber}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleCopyText(ADMIN_CONFIG.vodafoneCashNumber, 'رقم التحويل')}
                  startIcon={<CopyIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    bgcolor: 'rgba(56, 189, 248, 0.25)',
                    color: '#ffffff',
                    border: '1.5px solid #38bdf8',
                    fontWeight: 900,
                    py: 1,
                    px: 2.5,
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      bgcolor: '#38bdf8',
                      color: '#0f172a',
                    },
                  }}
                >
                  نسخ الرقم 📋
                </Button>
              </Box>

              <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600, display: 'block', mb: 2.5, lineHeight: 1.8 }}>
                {paymentMethod === 'vodafone_cash'
                  ? '👈 قم بفتح محفظتك الذكية (فودافون كاش) وتحويل مبلغ 200 ج.م إلى الرقم أعلاه.'
                  : '👈 قم بفتح تطبيق InstaPay والتحويل إلى هذا الرقم بمبلغ 200 ج.م.'}
              </Typography>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 800, mb: 1 }}>
                  اكتب رقم الموبايل أو الحساب الذي قمت بالتحويل منه:
                </Typography>
                <TextField
                  fullWidth
                  placeholder="مثال: 01012345678 أو معرف انستا باي الخاص بك..."
                  value={senderPhoneInput}
                  onChange={(e) => setSenderPhoneInput(e.target.value)}
                  sx={{
                    '& input': {
                      color: '#ffffff',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      py: 1.6,
                      direction: 'ltr',
                      textAlign: 'right',
                    },
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(0,0,0,0.5)',
                      borderRadius: '14px',
                      border: '1.5px solid rgba(255,255,255,0.25)',
                      '&:hover': { borderColor: '#38bdf8' },
                      '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                    },
                  }}
                  helperText="⚠️ ضروري جداً ليتمكن الأدمن من مطابقة العملية وتفعيل حسابك فوراً"
                  FormHelperTextProps={{
                    sx: { color: '#facc15', fontSize: '0.85rem', fontWeight: 700, mt: 1 },
                  }}
                />
              </Box>
            </Card>

            {/* CTA Button */}
            <Button
              variant="contained"
              onClick={handleConfirmPayment}
              disabled={isSubmittingPayment}
              startIcon={isSubmittingPayment ? <CircularProgress size={22} color="inherit" /> : <CheckCircleIcon sx={{ fontSize: 24 }} />}
              sx={{
                py: 2,
                px: { xs: 3.5, sm: 6 },
                borderRadius: '18px',
                fontWeight: 900,
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
                width: { xs: '100%', sm: 'auto' },
                minHeight: 56,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                },
              }}
            >
              {isSubmittingPayment ? 'جاري إرسال إشعار الدفع...' : 'تم الدفع وتأكيد التحويل (200 ج.م) ✅'}
            </Button>
          </Card>
        )}

        {/* Mandatory Authentication Gate Card when Not Logged In */}
        {!authLoading && !user && (
          <Card
            sx={{
              mb: 6,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 58, 138, 0.5) 100%)',
              border: '2px solid rgba(59, 130, 246, 0.6)',
              borderRadius: '28px',
              p: { xs: 3, sm: 4, md: 5 },
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(59, 130, 246, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: { xs: 68, sm: 80 },
                height: { xs: 68, sm: 80 },
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(56, 189, 248, 0.3) 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
                boxShadow: '0 0 35px rgba(56, 189, 248, 0.4)',
              }}
            >
              <LockIcon sx={{ fontSize: { xs: 36, sm: 44 }, color: '#38bdf8' }} />
            </Box>

            <Chip
              size="medium"
              label="🔒 ميزة حصرية للأعضاء المسجلين"
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.2)',
                color: '#fca5a5',
                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                fontWeight: 900,
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                mb: 2.5,
                px: 2,
                py: 2.2,
                borderRadius: '12px',
              }}
            />

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #bae6fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.4rem' },
                lineHeight: 1.3,
              }}
            >
              يلزم تسجيل الدخول لاستخدام صانع الإعلانات
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#e2e8f0',
                maxWidth: 720,
                mx: 'auto',
                mb: 4,
                lineHeight: 1.9,
                fontSize: { xs: '0.95rem', sm: '1.08rem' },
              }}
            >
              أهلاً بك في استوديو إعلانات <strong>MarkNCode</strong>! أداة توليد الاستراتيجيات المخصصة، استخراج الاهتمامات المتقاطعة، سكريبتات الريلز، وحاسبة العائد متاحة حصرياً للمستخدمين المسجلين. سجّل دخولك الآن أو أنشئ حسابك مجاناً في دقيقة واحدة للبدء فوراً!
            </Typography>

            {/* Quick Feature Highlights */}
            <Grid container spacing={2} sx={{ mb: 4, maxWidth: 840, mx: 'auto' }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2.5, borderRadius: '18px', bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1.5px solid rgba(56, 189, 248, 0.3)' }}>
                  <Typography variant="subtitle1" sx={{ color: '#38bdf8', fontWeight: 900, mb: 0.8 }}>
                    🎯 استهداف دقيق متقاطع
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    اهتمامات وسلوكيات شرائية جاهزة للنسخ في Ads Manager
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2.5, borderRadius: '18px', bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1.5px solid rgba(16, 185, 129, 0.3)' }}>
                  <Typography variant="subtitle1" sx={{ color: '#34d399', fontWeight: 900, mb: 0.8 }}>
                    🎬 سكريبتات فيديو بالثواني
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    هوك بصري وصوتي ونصوص إعلانية ترفع نسبة التحويل
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 2.5, borderRadius: '18px', bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1.5px solid rgba(245, 158, 11, 0.3)' }}>
                  <Typography variant="subtitle1" sx={{ color: '#fbbf24', fontWeight: 900, mb: 0.8 }}>
                    💬 مستشارك الإعلاني الخاص
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                    شات فوري للمتابعة وتوزيع الميزانية وحاسبة الـ ROAS
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* CTAs */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ maxWidth: 680, mx: 'auto', width: '100%' }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  sessionStorage.setItem('post_auth_redirect', '/create-your-ad');
                  navigate('/signin?redirect=/create-your-ad');
                }}
                startIcon={<LoginIcon sx={{ fontSize: 22 }} />}
                sx={{
                  py: 1.8,
                  px: 4,
                  minHeight: 52,
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.45)',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                تسجيل الدخول (Sign In) 🔑
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  sessionStorage.setItem('post_auth_redirect', '/create-your-ad');
                  navigate('/signup?redirect=/create-your-ad');
                }}
                startIcon={<PersonAddIcon sx={{ fontSize: 22 }} />}
                sx={{
                  py: 1.8,
                  px: 4,
                  minHeight: 52,
                  borderRadius: '16px',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                إنشاء حساب جديد مجاناً ✨
              </Button>

              <Button
                variant="outlined"
                onClick={handleGoogleQuickSignIn}
                sx={{
                  py: 1.4,
                  px: 3,
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.06)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.12)',
                    borderColor: '#38bdf8',
                  },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <GoogleSvgIcon /> الدخول بـ Google 🚀
              </Button>
            </Stack>
          </Card>
        )}

        {/* Workspace Form & Output (Locked and blurred until logged in AND payment approved) */}
        <Box
          sx={{
            position: 'relative',
            ...((!user || (paymentStatus !== 'approved' && !auditResult)) && {
              filter: 'blur(7px)',
              opacity: 0.35,
              pointerEvents: 'none',
              userSelect: 'none',
              cursor: 'not-allowed',
            }),
          }}
        >
        {/* Beginner Guide Launcher Banner */}
        <Card
          sx={{
            mb: 4,
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.45) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '20px',
            p: { xs: 2.5, md: 3 },
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 18px rgba(37, 99, 235, 0.4)',
                  flexShrink: 0,
                }}
              >
                <GuideIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                  📍 مش عارف تبدأ منين؟ ومش عارف تفتح وتعمل إعلانك منين بالضبط على أرض الواقع؟
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                  دليل عملي شامل: لماذا يجب تجنب زر Boost Post، أين تجد مدير الإعلانات، والخطوات الأربعة من الصفر حتى النشر!
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={() => setGuideModalOpen(true)}
              startIcon={<LaunchIcon />}
              sx={{
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                fontWeight: 800,
                px: 3,
                py: 1,
                whiteSpace: 'nowrap',
                alignSelf: { xs: 'stretch', md: 'auto' },
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
              }}
            >
              افتح دليل أين تطلق إعلانك خطوة بخطوة 📖
            </Button>
          </Box>
        </Card>

        <Grid container spacing={{ xs: 2.5, md: 4 }}>
          {/* Left: Consultation Interview Form */}
          <Grid item xs={12} lg={5}>
            <Card
              sx={{
                bgcolor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                borderRadius: { xs: '20px', md: '24px' },
                p: { xs: 2, sm: 3, md: 4 },
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                position: { xs: 'static', lg: 'sticky' },
                top: { lg: 90 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
                      flexShrink: 0,
                    }}
                  >
                    <AuditIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#f8fafc', lineHeight: 1.2, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                      {productName.trim() || businessField.trim() ? `استجواب إعلاني: ${productName || businessField}` : 'استجواب إعلاني ذكي'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.82rem' }}>
                      الخطوة {activeStep + 1} من 3
                    </Typography>
                  </Box>
                </Box>

                <Button
                  size="small"
                  onClick={() => setActiveStep(0)}
                  startIcon={<ResetIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    color: '#e2e8f0',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    px: 1.5,
                    py: 0.5,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)', borderColor: '#38bdf8' },
                  }}
                >
                  إعادة
                </Button>
              </Box>

              {/* Progress Indicator */}
              <LinearProgress
                variant="determinate"
                value={((activeStep + 1) / 3) * 100}
                sx={{
                  mb: 3,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                  },
                }}
              />

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {/* STEP 0: Granular Precision Inputs (The Inputs) */}
                {activeStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Notice Banner: Strict Product Specificity Rule */}
                    <Box
                      sx={{
                        mb: 2.5,
                        p: 2,
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ fontSize: '1.4rem', lineHeight: 1, mt: 0.3 }}>🎯</Box>
                      <Box>
                        <Typography sx={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem', mb: 0.5 }}>
                          أهم قاعدة للحصول على استهداف حقيقي:
                        </Typography>
                        <Typography sx={{ color: '#e2e8f0', fontSize: '0.82rem', lineHeight: 1.6 }}>
                          <strong>"أنا عايز اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص!"</strong>
                          <br />
                          تجنب الكلمات المفردة العامة (مثل كلمة "عيادة"، "ملابس"، "كورس"). اكتب اسم وتفاصيل منتجك أو خدمتك بدقة لتستخرج خوارزميات الذكاء الاصطناعي اهتمامات وسلوكيات المشتري الحقيقي.
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 700, mb: 2 }}>
                      🎯 1. محددات الاستهداف والنشاط (اكتب بياناتك بحرية):
                    </Typography>

                    <Stack spacing={3}>
                      {/* Business Field Free Text Input */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 1, fontSize: '0.95rem' }}>
                          🏢 مجال أو نوع البيزنس بتاعك:
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="مثلاً: عيادة تجميل، متجر عطور، شركة نقل، بيع عسل، كورس برمجة..."
                          value={businessField}
                          onChange={(e) => setBusinessField(e.target.value)}
                          sx={{
                            '& input': { color: '#ffffff', fontSize: '1rem', fontWeight: 700, py: 1.6 },
                            '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6) !important', opacity: 1 },
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(15, 23, 42, 0.85)',
                              borderRadius: '14px',
                              border: '1.5px solid rgba(255,255,255,0.25)',
                              '&:hover': { borderColor: '#38bdf8' },
                              '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                            },
                          }}
                        />
                        <Box sx={{ mt: 1.2 }}>
                          <Button
                            size="small"
                            onClick={() => setShowFieldSuggestions(!showFieldSuggestions)}
                            startIcon={<IdeaIcon sx={{ fontSize: 18 }} />}
                            sx={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, p: 0, minWidth: 'auto', textTransform: 'none' }}
                          >
                            {showFieldSuggestions ? 'إخفاء الاقتراحات 🔼' : '💡 هل تحتاج أمثلة لمجالك؟ اضغط لعرض اقتراحات'}
                          </Button>
                        </Box>
                        {showFieldSuggestions && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5, p: 2, bgcolor: 'rgba(56, 189, 248, 0.12)', borderRadius: '14px', border: '1.5px solid rgba(56, 189, 248, 0.35)' }}>
                            <Typography variant="caption" sx={{ color: '#e2e8f0', width: '100%', mb: 0.5, fontWeight: 700 }}>
                              اضغط على أي مجال لاختياره مباشرة:
                            </Typography>
                            {BUSINESS_FIELD_SUGGESTIONS.map((field, idx) => (
                              <Chip
                                key={idx}
                                label={field}
                                onClick={() => setBusinessField(field)}
                                sx={{
                                  cursor: 'pointer',
                                  bgcolor: businessField === field ? '#2563eb' : 'rgba(255,255,255,0.1)',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  border: businessField === field ? '1.5px solid #60a5fa' : '1px solid rgba(255,255,255,0.2)',
                                  '&:hover': { bgcolor: '#1d4ed8' },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>

                      {/* Product Name with Live Specificity Feedback */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 1, fontSize: '0.95rem' }}>
                          📦 اسم المنتج أو الخدمة أو العرض بالتحديد:
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="مثلاً: كورس تجارة إلكترونية، فستان سواريه، زراعة أسنان، تشطيب شقة..."
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          error={Boolean((productName || businessField) && currentSpecificity.isVague)}
                          sx={{
                            '& input': { color: '#ffffff', fontSize: '1rem', fontWeight: 700, py: 1.6 },
                            '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6) !important', opacity: 1 },
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(15, 23, 42, 0.85)',
                              borderRadius: '14px',
                              border: '1.5px solid rgba(255,255,255,0.25)',
                              '&:hover': { borderColor: '#38bdf8' },
                              '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                            },
                          }}
                        />

                        {/* Dynamic specificity check alert */}
                        {(productName.trim().length > 0 || businessField.trim().length > 0) && (
                          <Box
                            sx={{
                              mt: 1.5,
                              p: 2,
                              borderRadius: '14px',
                              bgcolor: currentSpecificity.isGibberish
                                ? 'rgba(239, 68, 68, 0.2)'
                                : currentSpecificity.isVague
                                ? 'rgba(245, 158, 11, 0.18)'
                                : 'rgba(16, 185, 129, 0.18)',
                              border: `1.5px solid ${
                                currentSpecificity.isGibberish
                                  ? 'rgba(239, 68, 68, 0.6)'
                                  : currentSpecificity.isVague
                                  ? 'rgba(245, 158, 11, 0.5)'
                                  : 'rgba(16, 185, 129, 0.5)'
                              }`,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                sx={{
                                  fontSize: '0.9rem',
                                  fontWeight: 800,
                                  color: currentSpecificity.isGibberish
                                    ? '#fca5a5'
                                    : currentSpecificity.isVague
                                    ? '#fde047'
                                    : '#6ee7b7',
                                }}
                              >
                                {currentSpecificity.isGibberish
                                  ? '🛑 غير مفهوم (حروف عشوائية):'
                                  : currentSpecificity.isVague
                                  ? '⚠️ مطلوب تفصيل أكثر:'
                                  : '✔️ ممتاز:'} {currentSpecificity.message}
                              </Typography>
                            </Box>
                            {currentSpecificity.example && (
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mt: 0.5 }}>
                                <Typography sx={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 600 }}>
                                  💡 <strong>مثال مقترح للذكاء الاصطناعي:</strong> {currentSpecificity.example}
                                </Typography>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => {
                                    const match = currentSpecificity.example.match(/"([^"]+)"/);
                                    if (match && match[1]) {
                                      setProductName(match[1]);
                                    } else {
                                      setProductName(currentSpecificity.example);
                                    }
                                  }}
                                  sx={{
                                    fontSize: '0.8rem',
                                    py: 0.6,
                                    px: 1.8,
                                    color: '#ffffff',
                                    bgcolor: 'rgba(56, 189, 248, 0.3)',
                                    border: '1px solid #38bdf8',
                                    borderRadius: '10px',
                                    fontWeight: 800,
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#38bdf8', color: '#0f172a' },
                                  }}
                                >
                                  ✨ تطبيق هذا النموذج
                                </Button>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>

                      {/* NEW: User Desired Ad Objective Selector Cards */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <TargetIcon sx={{ color: '#38bdf8', fontSize: 22 }} />
                          <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.95rem' }}>
                            ما هو نوع الإعلان الذي تريد تنفيذه بنفسك؟ (Ad Objective):
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', mb: 2, fontSize: '0.84rem' }}>
                          اختر ما تفضله، وسيقوم الذكاء الاصطناعي بتحليله فوراً ومقارنته بالأوفر والأعلى عائداً لبيزنسك:
                        </Typography>

                        <Grid container spacing={1.5}>
                          {[
                            { val: 'Messages', label: '💬 إعلانات رسائل ومحادثات', sub: 'واتساب / انستجرام DM / ماسنجر' },
                            { val: 'Sales', label: '🛒 إعلانات مبيعات وتحويلات', sub: 'متجر إلكتروني (Sales / Conversions)' },
                            { val: 'Leads', label: '📝 إعلانات استمارات وبيانات', sub: 'تجميع عملاء مهتمين (Instant Forms)' },
                            { val: 'Engagement', label: '👍 إعلانات تفاعل وبوستات', sub: 'رواج ومتابعين (Engagement / Likes)' },
                            { val: 'Traffic', label: '🌐 إعلانات زيارات ونقرات', sub: 'ترافيك ونقرات روابط (Traffic)' },
                            { val: 'LocalAwareness', label: '📍 إعلانات انتشار ووعي محلي', sub: 'محيط المحل أو العيادة (Local Reach)' },
                            { val: 'Undecided', label: '🤖 دع الذكاء الاصطناعي يقرر', sub: 'تحليل ومقارنة كل البدائل تلقائياً' },
                          ].map((opt) => {
                            const isSelected = userDesiredObjective === opt.val;
                            return (
                              <Grid item xs={12} sm={6} key={opt.val}>
                                <Box
                                  onClick={() => setUserDesiredObjective(opt.val as DesiredObjective)}
                                  sx={{
                                    p: 1.8,
                                    minHeight: { xs: 68, sm: 76 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    bgcolor: isSelected ? 'rgba(56, 189, 248, 0.22)' : 'rgba(15, 23, 42, 0.7)',
                                    border: isSelected ? '2.5px solid #38bdf8' : '1.5px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'right',
                                    '&:hover': {
                                      borderColor: '#38bdf8',
                                      bgcolor: 'rgba(56, 189, 248, 0.12)',
                                      transform: 'translateY(-1px)',
                                    },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.92rem' }}>
                                      {opt.label}
                                    </Typography>
                                    {isSelected && (
                                      <Chip size="small" label="مُختار ✓" sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 900, height: 22, fontSize: '0.75rem' }} />
                                    )}
                                  </Box>
                                  <Typography sx={{ color: isSelected ? '#e0f2fe' : '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.5, fontWeight: isSelected ? 600 : 500 }}>
                                    {opt.sub}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>

                      {/* Selector 1: Price Point Cards */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.18)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 0.5, fontSize: '0.95rem' }}>
                          🏷️ الفئة السعرية للمنتج (Price Point):
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', mb: 2, fontSize: '0.84rem' }}>
                          تحدد السلوكيات الشرائية المناسبة بدقة (الأجهزة الحديثة، المنفقين الدائمين):
                        </Typography>
                        <Grid container spacing={1.5}>
                          {[
                            { val: 'economic', label: '🏷️ اقتصادي / شعبي', sub: 'Budget / Economic' },
                            { val: 'mid', label: '⚖️ متوسط القيمة', sub: 'Mid-range Ticket' },
                            { val: 'luxury', label: '💎 فاخر / عالي القيمة', sub: 'Luxury / High-Ticket' },
                          ].map((item) => {
                            const isSelected = pricePoint === item.val;
                            return (
                              <Grid item xs={12} sm={4} key={item.val}>
                                <Box
                                  onClick={() => setPricePoint(item.val as PricePoint)}
                                  sx={{
                                    p: 1.8,
                                    minHeight: { xs: 64, sm: 76 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                    bgcolor: isSelected ? 'rgba(59, 130, 246, 0.28)' : 'rgba(15, 23, 42, 0.7)',
                                    border: isSelected ? '2.5px solid #3b82f6' : '1.5px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: '#3b82f6', bgcolor: 'rgba(59, 130, 246, 0.15)' },
                                  }}
                                >
                                  <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.92rem', mb: 0.3 }}>
                                    {item.label}
                                  </Typography>
                                  <Typography sx={{ color: isSelected ? '#dbeafe' : '#cbd5e1', fontSize: '0.78rem', fontWeight: isSelected ? 700 : 500 }}>
                                    {item.sub}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>

                      {/* Pain Point Free Text Input */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 1, fontSize: '0.95rem' }}>
                          ⚡ ما هو أكبر صداع أو مشكلة تحلها لعميلك؟ (Pain Point):
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="اكتب المشكلة أو الصداع اللي عميلك بيعاني منه..."
                          value={painPoint}
                          onChange={(e) => setPainPoint(e.target.value)}
                          sx={{
                            '& input': { color: '#ffffff', fontSize: '1rem', fontWeight: 700, py: 1.6 },
                            '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6) !important', opacity: 1 },
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(15, 23, 42, 0.85)',
                              borderRadius: '14px',
                              border: '1.5px solid rgba(255,255,255,0.25)',
                              '&:hover': { borderColor: '#38bdf8' },
                              '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                            },
                          }}
                        />
                        <Box sx={{ mt: 1.2 }}>
                          <Button
                            size="small"
                            onClick={() => setShowPainPointSuggestions(!showPainPointSuggestions)}
                            startIcon={<IdeaIcon sx={{ fontSize: 18 }} />}
                            sx={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, p: 0, minWidth: 'auto', textTransform: 'none' }}
                          >
                            {showPainPointSuggestions ? 'إخفاء الاقتراحات 🔼' : '💡 هل تحتاج أفكار لمشاكل وصداع العملاء؟ اضغط هنا'}
                          </Button>
                        </Box>
                        {showPainPointSuggestions && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5, p: 2, bgcolor: 'rgba(56, 189, 248, 0.12)', borderRadius: '14px', border: '1.5px solid rgba(56, 189, 248, 0.35)' }}>
                            <Typography variant="caption" sx={{ color: '#e2e8f0', width: '100%', mb: 0.5, fontWeight: 700 }}>
                              اضغط على أي مشكلة لإضافتها فوراً:
                            </Typography>
                            {PAIN_POINT_SUGGESTIONS.map((point, idx) => (
                              <Chip
                                key={idx}
                                label={point}
                                onClick={() => setPainPoint(point)}
                                sx={{
                                  cursor: 'pointer',
                                  bgcolor: painPoint === point ? '#059669' : 'rgba(255,255,255,0.1)',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  border: painPoint === point ? '1.5px solid #34d399' : '1px solid rgba(255,255,255,0.2)',
                                  '&:hover': { bgcolor: '#047857' },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>

                      {/* Selector 2: Location Scope Cards */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.18)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 0.5, fontSize: '0.95rem' }}>
                          📍 النطاق الجغرافي المستهدف (Location Scope):
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', mb: 2, fontSize: '0.84rem' }}>
                          يحدد ما إذا كانت الحملة تحتاج توعية محلية (Local) أم تحويلات واسعة:
                        </Typography>
                        <Grid container spacing={1.5}>
                          {[
                            { val: 'radius_5_10km', label: '📍 محيط 5 - 10 كم', sub: 'حول المقر (Local Reach)' },
                            { val: 'city', label: '🏙️ مدينة / محافظة محددة', sub: 'نطاق محافظة كاملة (City)' },
                            { val: 'country', label: '🗺️ دولة كاملة / شحن عام', sub: 'كافة المحافظات (Country)' },
                          ].map((item) => {
                            const isSelected = locationScope === item.val;
                            return (
                              <Grid item xs={12} sm={4} key={item.val}>
                                <Box
                                  onClick={() => setLocationScope(item.val as LocationScope)}
                                  sx={{
                                    p: 1.8,
                                    minHeight: { xs: 64, sm: 76 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                    bgcolor: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                                    border: isSelected ? '2.5px solid #38bdf8' : '1.5px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.12)' },
                                  }}
                                >
                                  <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.92rem', mb: 0.3 }}>
                                    {item.label}
                                  </Typography>
                                  <Typography sx={{ color: isSelected ? '#e0f2fe' : '#cbd5e1', fontSize: '0.78rem', fontWeight: isSelected ? 700 : 500 }}>
                                    {item.sub}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>

                      {/* Selector 3: Customer Type Cards */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.18)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 0.5, fontSize: '0.95rem' }}>
                          👥 طبيعة العميل المستهدف (Customer Type):
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', mb: 2, fontSize: '0.84rem' }}>
                          لتغيير نبرة الإعلان كلياً (عاطفية للأفراد vs عائد استثماري للشركات):
                        </Typography>
                        <Grid container spacing={1.5}>
                          {[
                            { val: 'b2c', label: '👤 أفراد ومستهلكين نهائيين (B2C)', sub: 'بيع للأشخاص بنبرة عاطفية وسريعة' },
                            { val: 'b2b', label: '🏢 شركات وأصحاب أعمال (B2B)', sub: 'بيع للمؤسسات بنبرة أرباح وعائد ROI' },
                          ].map((item) => {
                            const isSelected = customerType === item.val;
                            return (
                              <Grid item xs={12} sm={6} key={item.val}>
                                <Box
                                  onClick={() => setCustomerType(item.val as CustomerType)}
                                  sx={{
                                    p: 1.8,
                                    minHeight: { xs: 68, sm: 78 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                    bgcolor: isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                                    border: isSelected ? '2.5px solid #10b981' : '1.5px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: isSelected ? '0 0 20px rgba(16, 185, 129, 0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.12)' },
                                  }}
                                >
                                  <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.92rem', mb: 0.3 }}>
                                    {item.label}
                                  </Typography>
                                  <Typography sx={{ color: isSelected ? '#d1fae5' : '#cbd5e1', fontSize: '0.78rem', fontWeight: isSelected ? 700 : 500 }}>
                                    {item.sub}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>

                      {/* Selector 4: Target Gender Cards */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.18)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 0.5, fontSize: '0.95rem' }}>
                          🎯 الجمهور المستهدف حسب الجنس (Target Gender):
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', mb: 2, fontSize: '0.84rem' }}>
                          لتحديد الجمهور المناسب وتفادي صرف الميزانية على الجنس غير المهتم:
                        </Typography>
                        <Grid container spacing={1.5}>
                          {[
                            { val: 'all', label: '👥 الجميع', sub: 'رجال ونساء معاً' },
                            { val: 'women', label: '👩 نساء فقط', sub: 'Women Audience' },
                            { val: 'men', label: '👨 رجال فقط', sub: 'Men Audience' },
                          ].map((item) => {
                            const isSelected = targetGender === item.val;
                            return (
                              <Grid item xs={12} sm={4} key={item.val}>
                                <Box
                                  onClick={() => setTargetGender(item.val as TargetGender)}
                                  sx={{
                                    p: 1.8,
                                    minHeight: { xs: 64, sm: 76 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                    bgcolor: isSelected ? 'rgba(236, 72, 153, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                                    border: isSelected ? '2.5px solid #ec4899' : '1.5px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: isSelected ? '0 0 20px rgba(236, 72, 153, 0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: '#ec4899', bgcolor: 'rgba(236, 72, 153, 0.12)' },
                                  }}
                                >
                                  <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.92rem', mb: 0.3 }}>
                                    {item.label}
                                  </Typography>
                                  <Typography sx={{ color: isSelected ? '#fce7f3' : '#cbd5e1', fontSize: '0.78rem', fontWeight: isSelected ? 700 : 500 }}>
                                    {item.sub}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    </Stack>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (currentSpecificity.isVague) {
                            setSnackbarMessage(
                              currentSpecificity.message ||
                              'أنا محتاج اسم المنتج بالظبط أو المجال مفصل علشان يفهم منو و ميقولش اي حاجه و خلاص!'
                            );
                            setCopiedSnackbar(true);
                            return;
                          }
                          setActiveStep(1);
                        }}
                        endIcon={<NextIcon sx={{ fontSize: 22 }} />}
                        sx={{
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                          px: 4,
                          py: 1.8,
                          minHeight: 52,
                          fontWeight: 900,
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          width: { xs: '100%', sm: 'auto' },
                          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.45)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                          },
                        }}
                      >
                        التالي: الميزانية وحاسبة الأرباح
                      </Button>
                    </Box>
                  </motion.div>
                )}

                {/* STEP 1: Budget, Duration & Allocation */}
                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Typography variant="subtitle1" sx={{ color: '#38bdf8', fontWeight: 900, mb: 2.5, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>⏱️</span> 2. مدة الحملة والميزانية ومولد التوزيع:
                    </Typography>

                    <Stack spacing={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 1, fontSize: '0.92rem' }}>
                            💰 سعر بيع المنتج/الخدمة (ج.م):
                          </Typography>
                          <TextField
                            fullWidth
                            type="number"
                            placeholder="مثال: 450"
                            value={sellingPrice}
                            onChange={(e) => setSellingPrice(Number(e.target.value))}
                            sx={{
                              '& input': { color: '#ffffff', fontSize: '1rem', fontWeight: 700, py: 1.6 },
                              '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6) !important', opacity: 1 },
                              '& .MuiOutlinedInput-root': {
                                bgcolor: 'rgba(15, 23, 42, 0.85)',
                                borderRadius: '14px',
                                border: '1.5px solid rgba(255,255,255,0.25)',
                                '&:hover': { borderColor: '#38bdf8' },
                                '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 1, fontSize: '0.92rem' }}>
                            📈 صافي هامش الربح التقريبي (ج.م):
                          </Typography>
                          <TextField
                            fullWidth
                            type="number"
                            placeholder="مثال: 150"
                            value={profitMargin}
                            onChange={(e) => setProfitMargin(Number(e.target.value))}
                            sx={{
                              '& input': { color: '#ffffff', fontSize: '1rem', fontWeight: 700, py: 1.6 },
                              '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6) !important', opacity: 1 },
                              '& .MuiOutlinedInput-root': {
                                bgcolor: 'rgba(15, 23, 42, 0.85)',
                                borderRadius: '14px',
                                border: '1.5px solid rgba(255,255,255,0.25)',
                                '&:hover': { borderColor: '#38bdf8' },
                                '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>

                      {/* Total Budget Input */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 1, fontSize: '0.95rem' }}>
                          💵 إجمالي ميزانية الحملة بالكامل (ج.م):
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          value={totalBudget}
                          onChange={(e) => setTotalBudget(Number(e.target.value))}
                          InputProps={{
                            endAdornment: (
                              <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 900, whiteSpace: 'nowrap', pl: 1 }}>
                                ج.م إجمالي
                              </Typography>
                            ),
                          }}
                          sx={{
                            '& input': { color: '#ffffff', fontSize: '1.1rem', fontWeight: 800, py: 1.6 },
                            '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6) !important', opacity: 1 },
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(15, 23, 42, 0.85)',
                              borderRadius: '14px',
                              border: '1.5px solid rgba(255,255,255,0.25)',
                              '&:hover': { borderColor: '#38bdf8' },
                              '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                            },
                          }}
                        />
                      </Box>

                      {/* Campaign Duration Days */}
                      <Box sx={{ p: 2.5, borderRadius: '18px', bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                          <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.95rem' }}>
                            ⏳ مدة تشغيل الحملة:
                          </Typography>
                          <Chip
                            label={`${campaignDays} أيام`}
                            sx={{ bgcolor: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8', fontWeight: 900, fontSize: '0.95rem', border: '1px solid #38bdf8' }}
                          />
                        </Box>
                        <Slider
                          value={campaignDays}
                          min={3}
                          max={30}
                          step={1}
                          marks={[
                            { value: 3, label: '3 أيام' },
                            { value: 7, label: '7 أيام (موصى به)' },
                            { value: 14, label: '14 يوم' },
                            { value: 30, label: 'شهر' },
                          ]}
                          onChange={(_, val) => setCampaignDays(val as number)}
                          sx={{
                            color: '#38bdf8',
                            height: 8,
                            '& .MuiSlider-markLabel': { color: '#e2e8f0', fontWeight: 800, fontSize: '0.82rem' },
                            '& .MuiSlider-thumb': { width: 22, height: 22, bgcolor: '#ffffff', border: '3px solid #38bdf8' },
                          }}
                        />
                      </Box>

                      {/* Calculated Daily Allocation Box */}
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: '18px',
                          bgcolor: 'rgba(37, 99, 235, 0.2)',
                          border: '2px solid rgba(59, 130, 246, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 1.5,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ color: '#bae6fd', fontWeight: 800, mb: 0.3 }}>
                            المعدل اليومي للصرف على المنصة:
                          </Typography>
                          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 900 }}>
                            {dailyCalculatedBudget} ج.م / يومياً
                          </Typography>
                        </Box>
                        <Chip
                          icon={<TimeIcon sx={{ fontSize: 18, color: '#38bdf8 !important' }} />}
                          label={`على مدار ${campaignDays} أيام`}
                          sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#ffffff', fontWeight: 800, fontSize: '0.85rem' }}
                        />
                      </Box>

                      {/* Platform Selection Cards */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.18)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 0.5, fontSize: '0.95rem' }}>
                          📱 المنصة الإعلانية المستهدفة:
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', mb: 2, fontSize: '0.84rem' }}>
                          اختر المنصة الأساسية التي ترغب في إطلاق الحملة عليها:
                        </Typography>
                        <Grid container spacing={1.5}>
                          {[
                            { val: 'Meta (Instagram & Facebook Reels)', label: 'Meta (Instagram & Facebook Reels)', sub: 'الأفضل لمصر والوطن العربي عامة' },
                            { val: 'TikTok Ads For You Feed', label: 'TikTok Ads (For You Page In-Feed)', sub: 'الأعلى انتشاراً للشباب والمنتجات البصرية' },
                            { val: 'Google & YouTube Ads', label: 'Google Search & YouTube Shorts', sub: 'للعملاء الذين يبحثون بنية شراء مباشرة' },
                            { val: 'Snapchat Ads', label: 'Snapchat Ads (الخليج ومصر)', sub: 'قوة شرائية هائلة في الخليج والمحافظات' },
                          ].map((item) => {
                            const isSelected = platform === item.val;
                            return (
                              <Grid item xs={12} sm={6} key={item.val}>
                                <Box
                                  onClick={() => setPlatform(item.val)}
                                  sx={{
                                    p: 1.8,
                                    minHeight: { xs: 68, sm: 78 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    bgcolor: isSelected ? 'rgba(56, 189, 248, 0.22)' : 'rgba(15, 23, 42, 0.7)',
                                    border: isSelected ? '2.5px solid #38bdf8' : '1.5px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'right',
                                    '&:hover': { borderColor: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.12)' },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
                                    <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.88rem' }}>
                                      {item.label}
                                    </Typography>
                                    {isSelected && (
                                      <Chip size="small" label="مُختار ✓" sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 900, height: 22, fontSize: '0.75rem' }} />
                                    )}
                                  </Box>
                                  <Typography sx={{ color: isSelected ? '#e0f2fe' : '#cbd5e1', fontSize: '0.78rem', fontWeight: isSelected ? 600 : 500 }}>
                                    {item.sub}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>

                      {/* Country Selection Chips */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.18)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 1, fontSize: '0.95rem' }}>
                          🌍 الدولة / السوق المستهدف:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2 }}>
                          {[
                            'مصر 🇪🇬',
                            'السعودية 🇸🇦',
                            'الإمارات 🇦🇪',
                            'الكويت 🇰🇼',
                            'قطر 🇶🇦',
                          ].map((c) => {
                            const isSelected = country === c;
                            return (
                              <Chip
                                key={c}
                                label={c}
                                onClick={() => setCountry(c)}
                                sx={{
                                  cursor: 'pointer',
                                  p: 2,
                                  fontSize: '0.95rem',
                                  fontWeight: 800,
                                  bgcolor: isSelected ? '#2563eb' : 'rgba(255,255,255,0.08)',
                                  color: '#ffffff',
                                  border: isSelected ? '2px solid #60a5fa' : '1.5px solid rgba(255,255,255,0.2)',
                                  boxShadow: isSelected ? '0 0 15px rgba(37, 99, 235, 0.4)' : 'none',
                                  '&:hover': { bgcolor: '#1d4ed8' },
                                }}
                              />
                            );
                          })}
                        </Box>
                      </Box>

                      {/* Website & Pixel Readiness Selection Cards */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 0.5, fontSize: '0.95rem' }}>
                          🌐 جاهزية الموقع الإلكتروني والبيكسل (Website & Pixel Readiness):
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', mb: 2, fontSize: '0.84rem' }}>
                          عامل حاسم في تحليل الاستراتيجية: إعلانات Sales تتطلب بيكسل مجهز، وإلا فإن إعلانات الرسائل أو الليدز تكون أوفر 10 أضعاف!
                        </Typography>

                        <Grid container spacing={1.5}>
                          {[
                            { val: 'no_website', label: '💬 لا أملك موقعاً إلكترونياً', sub: 'أعتمد على الشات ورسائل الواتساب والتليفون فقط' },
                            { val: 'ready_pixel', label: '⚡ متجر أو موقع ببيكسل نشط', sub: 'مربوط ببيكسل ميتا نشط وجاهز لحملات الـ Conversions' },
                            { val: 'website_no_pixel', label: '🌐 موقع بدون بيكسل', sub: 'لدي موقع ولكن بدون بيكسل أو متجر قيد الإنشاء' },
                          ].map((item) => {
                            const isSelected = websiteAndPixelStatus === item.val;
                            return (
                              <Grid item xs={12} key={item.val}>
                                <Box
                                  onClick={() => setWebsiteAndPixelStatus(item.val as WebsitePixelStatus)}
                                  sx={{
                                    p: 2,
                                    minHeight: { xs: 66, sm: 74 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    bgcolor: isSelected ? 'rgba(56, 189, 248, 0.22)' : 'rgba(15, 23, 42, 0.7)',
                                    border: isSelected ? '2.5px solid #38bdf8' : '1.5px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    gap: 1.5,
                                    textAlign: 'right',
                                    '&:hover': { borderColor: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.12)' },
                                  }}
                                >
                                  <Box>
                                    <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.92rem', mb: 0.3 }}>
                                      {item.label}
                                    </Typography>
                                    <Typography sx={{ color: isSelected ? '#e0f2fe' : '#cbd5e1', fontSize: '0.8rem', fontWeight: isSelected ? 600 : 500 }}>
                                      {item.sub}
                                    </Typography>
                                  </Box>
                                  {isSelected && (
                                    <Chip size="small" label="مُختار ✓" sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 900, height: 22, fontSize: '0.75rem' }} />
                                  )}
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    </Stack>

                    <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setActiveStep(0)}
                        startIcon={<PrevIcon sx={{ fontSize: 20 }} />}
                        sx={{
                          color: '#ffffff',
                          borderColor: 'rgba(255,255,255,0.3)',
                          bgcolor: 'rgba(255,255,255,0.06)',
                          borderRadius: '16px',
                          px: 3,
                          py: 1.5,
                          minHeight: 52,
                          fontWeight: 800,
                          width: { xs: '100%', sm: 'auto' },
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', borderColor: '#ffffff' },
                        }}
                      >
                        السابق
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(2)}
                        endIcon={<NextIcon sx={{ fontSize: 22 }} />}
                        sx={{
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                          px: 4,
                          py: 1.8,
                          minHeight: 52,
                          fontWeight: 900,
                          fontSize: { xs: '1rem', sm: '1.08rem' },
                          width: { xs: '100%', sm: 'auto' },
                          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.45)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                          },
                        }}
                      >
                        التالي: العروض والضمانات
                      </Button>
                    </Box>
                  </motion.div>
                )}

                {/* STEP 2: Offers & Dynamic Guarantees */}
                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Typography variant="subtitle1" sx={{ color: '#38bdf8', fontWeight: 900, mb: 2.5, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>🎁</span> 3. فحص العروض والضمان الخاص بمجالك:
                    </Typography>

                    <Stack spacing={3}>
                      {/* Offer handling */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.18)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 2, fontSize: '0.95rem' }}>
                          🎯 هل لديك عرض خاص حالياً للإعلان؟
                        </Typography>

                        <RadioGroup
                          value={hasNoOffer ? 'no_offer' : 'has_offer'}
                          onChange={(e) => setHasNoOffer(e.target.value === 'no_offer')}
                        >
                          <FormControlLabel
                            value="no_offer"
                            control={<Radio size="medium" sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#fbbf24' } }} />}
                            label={
                              <Box sx={{ py: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.92rem' }}>
                                  ❌ لا أملك أي عروض حالياً (أسعاري ثابتة ولا أقدم خصومات)
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#cbd5e1', display: 'block', fontSize: '0.8rem', mt: 0.3 }}>
                                  سيقوم محرك الذكاء الاصطناعي بهندسة عرض قيمة جذاب (Grand Slam Offer) لا يحرق أسعارك!
                                </Typography>
                              </Box>
                            }
                            sx={{ mb: 1.5, alignItems: 'flex-start' }}
                          />

                          <FormControlLabel
                            value="has_offer"
                            control={<Radio size="medium" sx={{ color: '#10b981', '&.Mui-checked': { color: '#34d399' } }} />}
                            label={
                              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.92rem' }}>
                                🎁 لدي عرض أو تخفيض حالي أريد تضمينه في الإعلان
                              </Typography>
                            }
                          />
                        </RadioGroup>

                        {!hasNoOffer && (
                          <Box sx={{ mt: 2.5 }}>
                            <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, mb: 1, fontSize: '0.9rem' }}>
                              اكتب عرضك الحالي بالتفصيل:
                            </Typography>
                            <TextField
                              fullWidth
                              placeholder="مثلاً: خصم 20% لفترة محدودة / كشف وأشعة مجاناً / شحن مجاني عند طلب قطعتين..."
                              value={customOfferText}
                              onChange={(e) => setCustomOfferText(e.target.value)}
                              sx={{
                                '& input': { color: '#ffffff', fontSize: '1rem', fontWeight: 700, py: 1.6 },
                                '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6) !important', opacity: 1 },
                                '& .MuiOutlinedInput-root': {
                                  bgcolor: 'rgba(0, 0, 0, 0.45)',
                                  borderRadius: '14px',
                                  border: '1.5px solid rgba(255,255,255,0.25)',
                                  '&:hover': { borderColor: '#38bdf8' },
                                  '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                                },
                              }}
                            />
                          </Box>
                        )}
                      </Box>

                      {/* Tailored Guarantee Free Text Input with On-Demand Suggestions */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.18)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 1, fontSize: '0.95rem' }}>
                          🛡️ الضمان وبناء الطمأنينة لعميلك (اكتب الضمان الخاص بنشاطك بحرية):
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="مثلاً: معاينة كاملة قبل الدفع واستبدال مجاني / ضمان استرجاع أموال / شهادة معتمدة / فحص مجاني..."
                          value={customGuarantee}
                          onChange={(e) => setCustomGuarantee(e.target.value)}
                          sx={{
                            '& input': { color: '#ffffff', fontSize: '1rem', fontWeight: 700, py: 1.6 },
                            '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6) !important', opacity: 1 },
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(0, 0, 0, 0.45)',
                              borderRadius: '14px',
                              border: '1.5px solid rgba(255,255,255,0.25)',
                              '&:hover': { borderColor: '#38bdf8' },
                              '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                            },
                          }}
                        />
                        <Box sx={{ mt: 1.2 }}>
                          <Button
                            size="small"
                            onClick={() => setShowGuaranteeSuggestions(!showGuaranteeSuggestions)}
                            startIcon={<IdeaIcon sx={{ fontSize: 18 }} />}
                            sx={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, p: 0, minWidth: 'auto', textTransform: 'none' }}
                          >
                            {showGuaranteeSuggestions ? 'إخفاء الاقتراحات 🔼' : '💡 هل تحتاج نماذج لضمانات قوية؟ اضغط هنا'}
                          </Button>
                        </Box>
                        {showGuaranteeSuggestions && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5, p: 2, bgcolor: 'rgba(56, 189, 248, 0.12)', borderRadius: '14px', border: '1.5px solid rgba(56, 189, 248, 0.35)' }}>
                            <Typography variant="caption" sx={{ color: '#e2e8f0', width: '100%', mb: 0.5, fontWeight: 700 }}>
                              اضغط على أي نموذج ضمان لاختياره مباشرة:
                            </Typography>
                            {GUARANTEE_SUGGESTIONS.map((guar, idx) => (
                              <Chip
                                key={idx}
                                label={guar}
                                onClick={() => setCustomGuarantee(guar)}
                                sx={{
                                  cursor: 'pointer',
                                  bgcolor: customGuarantee === guar ? '#2563eb' : 'rgba(255,255,255,0.1)',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  border: customGuarantee === guar ? '1.5px solid #60a5fa' : '1px solid rgba(255,255,255,0.2)',
                                  '&:hover': { bgcolor: '#1d4ed8' },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>

                      {/* NEW: Unique Selling Proposition (USP) */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(255, 255, 255, 0.18)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 1, fontSize: '0.95rem' }}>
                          🏆 ميزتك التنافسية الكبرى وسر تفوقك على المنافسين (USP):
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="مثلاً: خامات أصلية مستوردة بضمان معتمد، أسرع شحن، معاينة وفحص مجاني..."
                          value={uniqueSellingProposition}
                          onChange={(e) => setUniqueSellingProposition(e.target.value)}
                          sx={{
                            '& input': { color: '#ffffff', fontSize: '1rem', fontWeight: 700, py: 1.6 },
                            '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6) !important', opacity: 1 },
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(0, 0, 0, 0.45)',
                              borderRadius: '14px',
                              border: '1.5px solid rgba(255,255,255,0.25)',
                              '&:hover': { borderColor: '#38bdf8' },
                              '&.Mui-focused': { borderColor: '#38bdf8', borderWidth: '2px' },
                            },
                          }}
                        />
                        <Box sx={{ mt: 1.2 }}>
                          <Button
                            size="small"
                            onClick={() => setShowUspSuggestions(!showUspSuggestions)}
                            startIcon={<IdeaIcon sx={{ fontSize: 18 }} />}
                            sx={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, p: 0, minWidth: 'auto', textTransform: 'none' }}
                          >
                            {showUspSuggestions ? 'إخفاء الاقتراحات 🔼' : '💡 هل تحتاج نماذج لميزات تنافسية قوية؟ اضغط هنا'}
                          </Button>
                        </Box>
                        {showUspSuggestions && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5, p: 2, bgcolor: 'rgba(56, 189, 248, 0.12)', borderRadius: '14px', border: '1.5px solid rgba(56, 189, 248, 0.35)' }}>
                            <Typography variant="caption" sx={{ color: '#e2e8f0', width: '100%', mb: 0.5, fontWeight: 700 }}>
                              اضغط على أي ميزة لاختيارها مباشرة:
                            </Typography>
                            {USP_SUGGESTIONS.map((usp, idx) => (
                              <Chip
                                key={idx}
                                label={usp}
                                onClick={() => setUniqueSellingProposition(usp)}
                                sx={{
                                  cursor: 'pointer',
                                  bgcolor: uniqueSellingProposition === usp ? '#2563eb' : 'rgba(255,255,255,0.1)',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  border: uniqueSellingProposition === usp ? '1.5px solid #60a5fa' : '1px solid rgba(255,255,255,0.2)',
                                  '&:hover': { bgcolor: '#1d4ed8' },
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>

                      {/* Creative Asset Format Cards */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(56, 189, 248, 0.4)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 0.5, fontSize: '0.95rem' }}>
                          🎬 نوع وشكل المحتوى الإعلاني المتاح لديك للتنفيذ:
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', mb: 2, fontSize: '0.84rem' }}>
                          يساعد الذكاء الاصطناعي على ضبط زوايا السكريبت وصيغ الإعلانات (فيديو ريلز مقابل صور وبنرات):
                        </Typography>

                        <Grid container spacing={1.5}>
                          {[
                            { val: 'vertical_video', label: '📱 فيديو ريلز / تيك توك مصور', sub: 'تصوير حقيقي للمنتج أو العيادة (الأعلى مبيعات 9:16)' },
                            { val: 'graphic_images', label: '🖼️ صور وتصاميم فوتوشوب', sub: 'بنرات وتصاميم سوشيال ميديا' },
                            { val: 'motion_graphics', label: '✨ موشن جرافيك أو أنيميشن', sub: 'رسوم متحركة وتصميم 3D' },
                            { val: 'no_creative_need_help', label: '💡 لا أملك محتوى حالياً', sub: 'محتاج أفكار للتصوير بالموبايل' },
                          ].map((item) => {
                            const isSelected = creativeAssetFormat === item.val;
                            return (
                              <Grid item xs={12} sm={6} key={item.val}>
                                <Box
                                  onClick={() => setCreativeAssetFormat(item.val as CreativeAssetFormat)}
                                  sx={{
                                    p: 1.8,
                                    minHeight: { xs: 68, sm: 78 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    bgcolor: isSelected ? 'rgba(56, 189, 248, 0.22)' : 'rgba(15, 23, 42, 0.7)',
                                    border: isSelected ? '2.5px solid #38bdf8' : '1.5px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'right',
                                    '&:hover': { borderColor: '#38bdf8', bgcolor: 'rgba(56, 189, 248, 0.12)' },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
                                    <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.88rem' }}>
                                      {item.label}
                                    </Typography>
                                    {isSelected && (
                                      <Chip size="small" label="مُختار ✓" sx={{ bgcolor: '#38bdf8', color: '#0f172a', fontWeight: 900, height: 22, fontSize: '0.75rem' }} />
                                    )}
                                  </Box>
                                  <Typography sx={{ color: isSelected ? '#e0f2fe' : '#cbd5e1', fontSize: '0.78rem', fontWeight: isSelected ? 600 : 500 }}>
                                    {item.sub}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>

                      {/* Sales Closing Method Cards */}
                      <Box sx={{ p: 2.5, borderRadius: '20px', bgcolor: 'rgba(15, 23, 42, 0.95)', border: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 900, mb: 0.5, fontSize: '0.95rem' }}>
                          ⚡ طريقة إتمام المبيعات وسرعة الرد والتنفيذ:
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#e2e8f0', display: 'block', mb: 2, fontSize: '0.84rem' }}>
                          لتحديد سكريبت الشات المناسب أو فورم الفلترة الهاتفي ومعدل الإغلاق المتوقع:
                        </Typography>

                        <Grid container spacing={1.5}>
                          {[
                            { val: 'instant_chat', label: '💬 رد فوري على الشات والرسائل', sub: 'في أقل من 15 دقيقة (Instant Chat)' },
                            { val: 'telesales', label: '📞 مكالمات هاتفية وتيلي سيلز', sub: 'كول سنتر وتواصل ومبيعات هاتفية' },
                            { val: 'direct_online_checkout', label: '💳 شراء ودفع أونلاين مباشر', sub: 'بالفيزا على الموقع دون شات' },
                            { val: 'delayed_chat', label: '⏳ رد يدوي متأخر نسبياً', sub: 'خلال عدة ساعات' },
                          ].map((item) => {
                            const isSelected = salesClosingMethod === item.val;
                            return (
                              <Grid item xs={12} sm={6} key={item.val}>
                                <Box
                                  onClick={() => setSalesClosingMethod(item.val as SalesClosingMethod)}
                                  sx={{
                                    p: 1.8,
                                    minHeight: { xs: 68, sm: 78 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    borderRadius: '16px',
                                    bgcolor: isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(15, 23, 42, 0.7)',
                                    border: isSelected ? '2.5px solid #10b981' : '1.5px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: isSelected ? '0 0 20px rgba(16, 185, 129, 0.35)' : 'none',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'right',
                                    '&:hover': { borderColor: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.12)' },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
                                    <Typography sx={{ color: '#ffffff', fontWeight: 900, fontSize: '0.88rem' }}>
                                      {item.label}
                                    </Typography>
                                    {isSelected && (
                                      <Chip size="small" label="مُختار ✓" sx={{ bgcolor: '#10b981', color: '#ffffff', fontWeight: 900, height: 22, fontSize: '0.75rem' }} />
                                    )}
                                  </Box>
                                  <Typography sx={{ color: isSelected ? '#d1fae5' : '#cbd5e1', fontSize: '0.78rem', fontWeight: isSelected ? 600 : 500 }}>
                                    {item.sub}
                                  </Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    </Stack>

                    <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setActiveStep(1)}
                        startIcon={<PrevIcon sx={{ fontSize: 20 }} />}
                        sx={{
                          color: '#ffffff',
                          borderColor: 'rgba(255,255,255,0.3)',
                          bgcolor: 'rgba(255,255,255,0.06)',
                          borderRadius: '16px',
                          px: 3,
                          py: 1.5,
                          minHeight: 52,
                          fontWeight: 800,
                          width: { xs: '100%', sm: 'auto' },
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', borderColor: '#ffffff' },
                        }}
                      >
                        السابق
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleRunDiagnostic}
                        disabled={isAnalyzing}
                        startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <SparkleIcon sx={{ fontSize: 22 }} />}
                        sx={{
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          px: 4.5,
                          py: 1.8,
                          minHeight: 56,
                          fontWeight: 900,
                          fontSize: { xs: '1.05rem', sm: '1.2rem' },
                          width: { xs: '100%', sm: 'auto' },
                          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          },
                        }}
                      >
                        {isAnalyzing ? 'جاري التواصل مع MarkNCode...' : 'توليد خطة الإعلان الذكية 🚀'}
                      </Button>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </Grid>

          {/* Right: Real-time MarkNCode AI Diagnostic & Strategy Output */}
          <Grid item xs={12} lg={7}>
            {isAnalyzing && (
              <Card
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '24px',
                  p: { xs: 4, md: 6 },
                  textAlign: 'center',
                }}
              >
                <CircularProgress size={60} sx={{ color: '#38bdf8', mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
                  جاري التواصل مع MarkNCode وتحليل بيزنسك الآن...
                </Typography>
                <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 600, mb: 3 }}>
                  {ANALYSIS_STEPS[analysisStatusIndex]}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={((analysisStatusIndex + 1) / ANALYSIS_STEPS.length) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    maxWidth: 400,
                    mx: 'auto',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)',
                    },
                  }}
                />
              </Card>
            )}

            {!isAnalyzing && !auditResult && (
              <Card
                sx={{
                  bgcolor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '24px',
                  p: { xs: 4, md: 8 },
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '20px',
                    bgcolor: 'rgba(56, 189, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <SparkleIcon sx={{ color: '#38bdf8', fontSize: 36 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1 }}>
                  أجب على تفاصيل الاستهداف واضغط "توليد خطة الإعلان الذكية"
                </Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', maxWidth: 480, mx: 'auto', mb: 3, lineHeight: 1.7 }}>
                  ستحصل على استهداف دقيق متقاطع، مولد توزيع الميزانية، اختبار أ/ب التلقائي، سكريبتات ريلز بالثواني، وحاسبة الأرباح والعائد!
                </Typography>
              </Card>
            )}

            {!isAnalyzing && auditResult && (
              <Box>
                {/* Result Top Summary Card */}
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '24px',
                    p: { xs: 2.5, sm: 3, md: 4 },
                    mb: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 110,
                          height: 110,
                          borderRadius: '50%',
                          background:
                            auditResult.score >= 80
                              ? 'conic-gradient(#10b981 0% 85%, rgba(255,255,255,0.1) 85% 100%)'
                              : 'conic-gradient(#f59e0b 0% 65%, rgba(255,255,255,0.1) 65% 100%)',
                          p: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            bgcolor: '#0f172a',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="h4" sx={{ fontWeight: 900, color: auditResult.score >= 80 ? '#10b981' : '#f59e0b' }}>
                            {auditResult.score}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '0.72rem', fontWeight: 800 }}>
                            من 100
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 1, color: '#f8fafc' }}>
                        {auditResult.score >= 80 ? 'جاهزية إعلانية ممتازة 🚀' : 'تحذير: أخطاء بحاجة لتصحيح ⚠️'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            size="small"
                            label={auditResult.isLiveGemini ? 'MarkNCode AI Pro ⚡' : 'MarkNCode AI Engine 🤖'}
                            sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800 }}
                          />
                          <Chip
                            size="small"
                            label={`${totalBudget} ج.م / ${campaignDays} أيام`}
                            sx={{ bgcolor: 'rgba(37, 99, 235, 0.25)', color: '#93c5fd', fontWeight: 800 }}
                          />
                          <Chip
                            size="small"
                            label={pricePoint === 'luxury' ? 'فاخر 💎' : pricePoint === 'mid' ? 'متوسط 🌟' : 'اقتصادي 🏷️'}
                            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', fontWeight: 700 }}
                          />
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleExportFullCampaignPlan}
                            startIcon={<ExportIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              color: '#38bdf8',
                              borderColor: 'rgba(56, 189, 248, 0.4)',
                              borderRadius: '10px',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              bgcolor: 'rgba(56, 189, 248, 0.08)',
                              '&:hover': {
                                borderColor: '#38bdf8',
                                bgcolor: 'rgba(56, 189, 248, 0.18)',
                              },
                            }}
                          >
                            📥 نسخ الخطة بالكامل
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            onClick={handleStartNewCampaignPlan}
                            startIcon={<ResetIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              color: '#fbbf24',
                              borderColor: 'rgba(251, 191, 36, 0.4)',
                              borderRadius: '10px',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              bgcolor: 'rgba(251, 191, 36, 0.08)',
                              '&:hover': {
                                borderColor: '#fbbf24',
                                bgcolor: 'rgba(251, 191, 36, 0.18)',
                              },
                            }}
                          >
                            🔄 خطة لمنتج جديد (200 ج.م)
                          </Button>
                        </Stack>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#e2e8f0', fontWeight: 700, mb: 1, lineHeight: 1.6 }}>
                        {auditResult.feasibilityVerdict}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                        📈 {auditResult.estimatedResults}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>

                {/* Tabs for Result Breakdown with modern pill design */}
                <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
                  <Tabs
                    value={activeResultTab}
                    onChange={(_, val) => setActiveResultTab(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTab-root': {
                        color: '#cbd5e1',
                        fontWeight: 800,
                        fontSize: { xs: '0.82rem', md: '0.9rem' },
                        minHeight: 44,
                        px: { xs: 1.8, md: 2.2 },
                        py: 1,
                        borderRadius: '12px',
                        mr: 1,
                        mb: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(56, 189, 248, 0.1)',
                          color: '#ffffff',
                          borderColor: 'rgba(56, 189, 248, 0.3)',
                        },
                        '&.Mui-selected': {
                          color: '#38bdf8',
                          bgcolor: 'rgba(56, 189, 248, 0.18)',
                          border: '1.5px solid #38bdf8',
                          boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
                        },
                      },
                      '& .MuiTabs-indicator': { display: 'none' },
                    }}
                  >
                    <Tab icon={<GuideIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="📍 منين تعمل إعلانك خطوة بخطوة" />
                    <Tab icon={<TargetIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="🎯 مستشار الهدف (Sales أم WhatsApp أم Leads)" />
                    <Tab icon={<TuneIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="الاستهداف المتقاطع" />
                    <Tab icon={<CompareIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="اختبار أ/ب (A/B Test)" />
                    <Tab icon={<CalculateIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="حاسبة العائد والميزانية" />
                    <Tab icon={<PlayIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="سكريبت الريلز بالثواني" />
                    <Tab icon={<AuditIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="الصح والغلط" />
                    <Tab icon={<DoctorIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="دليل حل المشاكل (KPIs)" />
                    <Tab icon={<ChatIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="اسأل مستشارك الذكي 💬" />
                  </Tabs>
                </Box>

                {/* TAB 0: Beginner Step-by-Step Launch Guide */}
                {activeResultTab === 0 && renderBeginnerAdLaunchGuide()}

                {/* TAB 1: Campaign Objective Advisor (Sales vs Messages vs Leads) */}
                {activeResultTab === 1 && renderCampaignObjectiveAdvisor()}

                {/* TAB 2: Targeting & Lateral Interests */}
                {activeResultTab === 2 && (
                  <Stack spacing={2.5}>
                    <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                      🎯 استهداف Ads Manager الذكي (الاهتمامات المباشرة والمتقاطعة والسلوكيات):
                    </Typography>

                    <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', p: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800 }}>استراتيجية الحملة:</Typography>
                          <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                            {auditResult.targeting?.strategyType}
                          </Typography>
                        </Grid>

                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800 }}>الفئة العمرية:</Typography>
                          <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                            {auditResult.targeting?.ageRange}
                          </Typography>
                        </Grid>

                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800 }}>نوع العميل:</Typography>
                          <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700 }}>
                            {customerType === 'b2b' ? 'شركات B2B' : 'أفراد B2C'}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}><Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} /></Grid>

                        {/* Direct Interests */}
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: '#e2e8f0', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            1. اهتمامات مباشرة في مدير الإعلانات (Direct Interests):
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {auditResult.targeting?.interests?.map((int, i) => (
                              <Chip key={i} size="small" label={int} sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }} />
                            ))}
                          </Box>
                        </Grid>

                        {/* Lateral Interests based on Pain Point */}
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 800, display: 'block', mb: 0.5 }}>
                            2. اهتمامات متقاطعة سرية مبنية على حل المشكلة (Lateral Interests):
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {auditResult.targeting?.lateralInterests?.map((lat, i) => (
                              <Chip key={i} size="small" label={lat} sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 800 }} />
                            ))}
                          </Box>
                        </Grid>

                        {/* Behaviors driven by Price Point */}
                        <Grid item xs={12}>
                          <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 800, display: 'block', mb: 0.5 }}>
                            3. السلوكيات الشرائية المناسبة للفئة السعرية (Behaviors):
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {auditResult.targeting?.behaviors?.map((beh, i) => (
                              <Chip key={i} size="small" label={beh} sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontWeight: 800 }} />
                            ))}
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700, display: 'block', mb: 0.5 }}>
                              💡 سر خبير الميديا باير لهذا الاستهداف:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fde68a', lineHeight: 1.6 }}>
                              {auditResult.targeting?.industrySecret}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>

                    {renderTechnicalSosBanner('ضبط البيكسل ومدير الإعلانات وهيكل الاستهداف')}
                  </Stack>
                )}

                {/* TAB 3: Automatic A/B Testing Generator */}
                {activeResultTab === 3 && (
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                        ⚖️ اختبار أ/ب التلقائي: شغّل الزاويتين معاً في مدير الإعلانات
                      </Typography>
                      <Chip label="2 Creative Angles" sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }} />
                    </Box>

                    <Grid container spacing={2}>
                      {/* Angle A: FOMO */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '16px', p: 3, height: '100%' }}>
                          <Chip size="small" label="الزاوية الأولى: العاطفة والندرة" sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 800, mb: 2 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fbbf24', mb: 1.5 }}>
                            {auditResult.abTestAngles?.angleA?.name}
                          </Typography>

                          <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '8px', mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 800 }}>هوك الفيديو الافتتاحي (Hook):</Typography>
                            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700, mt: 0.5 }}>
                              {auditResult.abTestAngles?.angleA?.hook}
                            </Typography>
                          </Box>

                          <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '8px', mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>نص الإعلان (Ad Copy):</Typography>
                            <Typography variant="body2" sx={{ color: '#cbd5e1', whiteSpace: 'pre-line', lineHeight: 1.6, mt: 0.5 }}>
                              {auditResult.abTestAngles?.angleA?.primaryText}
                            </Typography>
                          </Box>

                          <Box sx={{ p: 1.5, bgcolor: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px' }}>
                            <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700, display: 'block' }}>
                              🧠 السر النفسي: {auditResult.abTestAngles?.angleA?.psychologySecret}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>

                      {/* Angle B: Rational */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '16px', p: 3, height: '100%' }}>
                          <Chip size="small" label="الزاوية الثانية: المنطق والجودة" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800, mb: 2 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#38bdf8', mb: 1.5 }}>
                            {auditResult.abTestAngles?.angleB?.name}
                          </Typography>

                          <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '8px', mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800 }}>هوك الفيديو الافتتاحي (Hook):</Typography>
                            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 700, mt: 0.5 }}>
                              {auditResult.abTestAngles?.angleB?.hook}
                            </Typography>
                          </Box>

                          <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '8px', mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>نص الإعلان (Ad Copy):</Typography>
                            <Typography variant="body2" sx={{ color: '#cbd5e1', whiteSpace: 'pre-line', lineHeight: 1.6, mt: 0.5 }}>
                              {auditResult.abTestAngles?.angleB?.primaryText}
                            </Typography>
                          </Box>

                          <Box sx={{ p: 1.5, bgcolor: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px' }}>
                            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, display: 'block' }}>
                              🧠 السر النفسي: {auditResult.abTestAngles?.angleB?.psychologySecret}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>

                    {renderTechnicalSosBanner('إطلاق وفحص زوايا اختبار أ/ب في مدير الإعلانات')}
                  </Stack>
                )}

                {/* TAB 4: ROI & Budget Allocator Calculator */}
                {activeResultTab === 4 && (
                  <Stack spacing={2.5}>
                    <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                      📊 حاسبة العائد والميزانية ومولد التوزيع التلقائي (ROI & Budget Allocator):
                    </Typography>

                    {/* Funnel Budget Allocator */}
                    <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(59, 130, 246, 0.35)', borderRadius: '16px', p: 3 }}>
                      <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 800, mb: 1 }}>
                        تقسيم الميزانية اليومية ({dailyCalculatedBudget} ج.م / يومياً):
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
                        {auditResult.budgetFunnelAllocation?.retargetingAdvice}
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)' }}>
                            <Typography variant="caption" sx={{ color: '#93c5fd' }}>
                              70% اختبار الجمهور البارد (Cold Audience):
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 900, mt: 0.5 }}>
                              {auditResult.budgetFunnelAllocation?.coldTestingDaily} ج.م / يومياً
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>لجلب عملاء جدد عبر الفيديوهات</Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            <Typography variant="caption" sx={{ color: '#a7f3d0' }}>
                              30% إعادة الاستهداف (Retargeting):
                            </Typography>
                            <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 900, mt: 0.5 }}>
                              {auditResult.budgetFunnelAllocation?.retargetingDaily} ج.م / يومياً
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>لحصد مبيعات المتفاعلين وزوار الصفحة</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>

                    {/* Interactive ROI & Metrics Grid */}
                    {(() => {
                      const effectiveCpa = customCpa > 0 ? customCpa : (auditResult.roiCalculations?.estimatedCPA || 100);
                      const calcConversions = Math.max(1, Math.round(totalBudget / effectiveCpa));
                      const calcRevenue = calcConversions * (Number(sellingPrice) || 1000);
                      const calcGrossProfit = calcConversions * (Number(profitMargin) || 400);
                      const calcNetProfit = calcGrossProfit - totalBudget;
                      const calcRoas = Number((calcRevenue / Math.max(totalBudget, 1)).toFixed(1));

                      return (
                        <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '16px', p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 800 }}>
                              الأرقام التقديرية للأرباح والعائد (Expected ROI & Profit):
                            </Typography>
                            <Chip size="small" label="حاسبة تفاعلية حية" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }} />
                          </Box>

                          {/* Dynamic CPA Slider */}
                          <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>
                                🎛️ جرب سيناريوهات مختلفة: غيّر تكلفة اكتساب العميل المتوقعة (CPA):
                              </Typography>
                              <Typography variant="subtitle2" sx={{ color: '#10b981', fontWeight: 900 }}>
                                {effectiveCpa} ج.م / عميل
                              </Typography>
                            </Box>
                            <Slider
                              value={effectiveCpa}
                              min={15}
                              max={Math.max(600, effectiveCpa * 2.5)}
                              step={5}
                              onChange={(_, val) => setCustomCpa(val as number)}
                              sx={{
                                color: '#10b981',
                                '& .MuiSlider-thumb': {
                                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600 }}>
                              كلما قمت بتحسين سكريبت الفيديو والعرض، انخفضت تكلفة العميل (CPA) وتضاعفت أرباحك الصافية!
                            </Typography>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                              <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>تكلفة العميل (CPA):</Typography>
                                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 800 }}>
                                  ~{effectiveCpa} ج.م
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                              <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>المبيعات المتوقعة:</Typography>
                                <Typography variant="h6" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                                  {calcConversions} عميل
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                              <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>صافي الربح المتوقع:</Typography>
                                <Typography variant="h6" sx={{ color: calcNetProfit >= 0 ? '#10b981' : '#ef4444', fontWeight: 800 }}>
                                  {calcNetProfit.toLocaleString()} ج.م
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                              <Box sx={{ p: 1.5, bgcolor: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px' }}>
                                <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>العائد على الصرف (ROAS):</Typography>
                                <Typography variant="h6" sx={{ color: '#fbbf24', fontWeight: 900 }}>
                                  {calcRoas}x ضعف
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Card>
                      );
                    })()}

                    {renderTechnicalSosBanner('ضبط وتدقيق ميزانية الحملة ومعدل العائد الاستثماري')}
                  </Stack>
                )}

                {/* TAB 5: Reels/TikTok Script by Seconds */}
                {activeResultTab === 5 && (
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                        🎬 سكريبت الفيديو الفيروسي مقسم بالثواني (0 - 30 ثانية)
                      </Typography>
                      <Button
                        size="small"
                        onClick={() =>
                          handleCopyText(
                            `${auditResult.videoScript?.hookSeconds}\n\n${auditResult.videoScript?.painPointSeconds}\n\n${auditResult.videoScript?.solutionSeconds}\n\n${auditResult.videoScript?.offerSeconds}\n\n${auditResult.videoScript?.ctaSeconds}`,
                            'السكريبت بالكامل'
                          )
                        }
                        startIcon={<CopyIcon />}
                        sx={{ color: '#38bdf8' }}
                      >
                        نسخ السكريبت
                      </Button>
                    </Box>

                    {/* Viral Hooks */}
                    <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', p: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#60a5fa', fontWeight: 800, mb: 1.5 }}>
                        🎯 خطافات أول 3 ثوانٍ المقترحة (Stop-Scrolling Hooks):
                      </Typography>
                      <Stack spacing={1}>
                        {auditResult.viralHooks?.map((h, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.2, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                            <Typography variant="body2" sx={{ color: '#e2e8f0' }}>{h}</Typography>
                            <IconButton size="small" onClick={() => handleCopyText(h, 'الهوك')}>
                              <CopyIcon sx={{ color: '#38bdf8', fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    </Card>

                    {/* Script Breakdown by seconds */}
                    <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', p: 3 }}>
                      <Stack spacing={2}>
                        <Box sx={{ p: 2, borderRadius: '10px', bgcolor: 'rgba(56, 189, 248, 0.08)', borderLeft: '4px solid #38bdf8' }}>
                          <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            الثواني 0 - 3: كسر النمط والخطاف الافتتاحي
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {auditResult.videoScript?.hookSeconds}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, borderRadius: '10px', bgcolor: 'rgba(239, 68, 68, 0.08)', borderLeft: '4px solid #ef4444' }}>
                          <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            الثواني 4 - 10: استثارة نقطة الألم وتعميق المعاناة
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {auditResult.videoScript?.painPointSeconds}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, borderRadius: '10px', bgcolor: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid #10b981' }}>
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            الثواني 11 - 18: تقديم الحل والتحول الإيجابي
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {auditResult.videoScript?.solutionSeconds}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, borderRadius: '10px', bgcolor: 'rgba(245, 158, 11, 0.08)', borderLeft: '4px solid #f59e0b' }}>
                          <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            الثواني 19 - 24: إطلاق العرض الذي لا يقاوم (Grand Slam Offer)
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {auditResult.videoScript?.offerSeconds}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, borderRadius: '10px', bgcolor: 'rgba(147, 51, 234, 0.08)', borderLeft: '4px solid #9333ea' }}>
                          <Typography variant="caption" sx={{ color: '#c084fc', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            الثواني 25 - 30: الدعوة الحاسمة للفعل (Call To Action)
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {auditResult.videoScript?.ctaSeconds}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  </Stack>
                )}

                {/* TAB 6: Right vs Wrong */}
                {activeResultTab === 6 && (
                  <Stack spacing={2.5}>
                    <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                      ⚖️ تدقيق الميديا باير: كشف الأخطاء القاتلة والصواب الإلزامي
                    </Typography>

                    {auditResult.rightWrongAudits?.map((item, idx) => (
                      <Card
                        key={idx}
                        sx={{
                          bgcolor: 'rgba(15, 23, 42, 0.75)',
                          border: item.isCorrect ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '16px',
                          p: 3,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc' }}>
                            {item.topic}
                          </Typography>
                          <Chip
                            size="small"
                            label={item.statusText}
                            sx={{
                              bgcolor: item.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: item.isCorrect ? '#10b981' : '#ef4444',
                              fontWeight: 700,
                            }}
                          />
                        </Box>

                        <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: 'rgba(239, 68, 68, 0.08)', mb: 1.5, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                          <Typography variant="caption" sx={{ color: '#fca5a5', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            ⚠️ الغلط ولماذا سيفشل الإعلان:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fecaca', lineHeight: 1.6 }}>
                            {item.theWrong}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          <Typography variant="caption" sx={{ color: '#86efac', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            ✔️ الصح والتصحيح الإلزامي المعتمد:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#bbf7d0', lineHeight: 1.6 }}>
                            {item.theRight}
                          </Typography>
                        </Box>
                      </Card>
                    ))}

                    {renderTechnicalSosBanner('تصحيح الأخطاء القاتلة في الحملة')}
                  </Stack>
                )}

                {/* TAB 7: Troubleshooting Doctor */}
                {activeResultTab === 7 && (
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                        🩺 طبيب قراءة النتائج وحل المشاكل (Troubleshooting Guide):
                      </Typography>
                      <Chip label="إذا واجهت أي هبوط" sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }} />
                    </Box>

                    {auditResult.troubleshootingGuide?.map((item, idx) => (
                      <Card key={idx} sx={{ bgcolor: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', p: 2.5 }}>
                        <Typography variant="subtitle1" sx={{ color: '#f87171', fontWeight: 800, mb: 1 }}>
                          🚨 المشكلة: {item.kpiProblem}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1.5, lineHeight: 1.5 }}>
                          <strong>التشخيص الخوارزمي:</strong> {item.diagnosis}
                        </Typography>
                        <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          <Typography variant="caption" sx={{ color: '#86efac', fontWeight: 700, display: 'block' }}>
                            🛠️ الحل العملي الفوري: {item.actionToTake}
                          </Typography>
                        </Box>
                      </Card>
                    ))}

                    {/* Technical SOS Banner */}
                    {renderTechnicalSosBanner('حل مشاكل انخفاض النتائج وارتفاع تكلفة النقرة')}

                    {/* Automated 5-Day WhatsApp Follow-up Section */}
                    {renderFollowUpBotSection()}
                  </Stack>
                )}

                {/* TAB 8: Interactive MarkNCode AI Chat Consultant */}
                {activeResultTab === 8 && (
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                        💬 محادثة مباشرة مع مستشارك الإعلاني لحملتك
                      </Typography>
                      <Chip
                        size="small"
                        icon={<SparkleIcon sx={{ fontSize: 14, color: '#38bdf8 !important' }} />}
                        label="مستشارك الذكي متصل ومستعد للإجابة"
                        sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}
                      />
                    </Box>

                    {/* Chat Box */}
                    <Card
                      sx={{
                        bgcolor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '20px',
                        p: 3,
                        minHeight: 380,
                        maxHeight: 520,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      {chatMessages.map((msg, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            alignSelf: msg.role === 'user' ? 'flex-start' : 'flex-end',
                            maxWidth: '85%',
                            p: 2,
                            borderRadius: '16px',
                            bgcolor: msg.role === 'user' ? 'rgba(37, 99, 235, 0.25)' : 'rgba(30, 41, 59, 0.9)',
                            border: msg.role === 'user' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: msg.role === 'user' ? '#93c5fd' : '#38bdf8', fontWeight: 700, display: 'block', mb: 0.5 }}>
                            {msg.role === 'user' ? 'أنت 👤' : 'مستشار MarkNCode AI 🤖'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#f1f5f9', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {msg.text}
                          </Typography>
                        </Box>
                      ))}

                      {isChatLoading && (
                        <Box sx={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
                          <CircularProgress size={16} sx={{ color: '#38bdf8' }} />
                          <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>
                            المستشار الذكي يحلل ويكتب الإجابة...
                          </Typography>
                        </Box>
                      )}
                    </Card>

                    {/* Chat Input Bar */}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        placeholder="اسأل مستشارك الذكي أي شيء (مثلاً: ازاي أوزع الـ 5000 ج.م على مدار الـ 7 أيام؟ أو اكتب لي سكريبت فكاهي)..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendChatMessage();
                        }}
                        size="medium"
                        sx={{
                          '& input': {
                            color: '#ffffff',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            py: 1.4,
                          },
                          '& input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.6) !important',
                            opacity: 1,
                          },
                          bgcolor: 'rgba(15, 23, 42, 0.9)',
                          borderRadius: '14px',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '14px',
                            border: '1.5px solid rgba(59, 130, 246, 0.4)',
                            '&:hover': { borderColor: '#38bdf8' },
                            '&.Mui-focused': { borderColor: '#38bdf8' },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleSendChatMessage}
                        disabled={isChatLoading || !chatInput.trim()}
                        sx={{
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
                          minWidth: 56,
                          minHeight: 50,
                          px: 2.5,
                          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                        }}
                      >
                        <SendIcon sx={{ fontSize: 22 }} />
                      </Button>
                    </Box>
                  </Stack>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
        </Box>
      </Container>

      {/* Auth Required Dialog Modal */}
      <Dialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0f172a',
            color: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid rgba(59, 130, 246, 0.5)',
            p: 2,
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 2, pb: 1 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)',
            }}
          >
            <LockIcon sx={{ fontSize: 34, color: '#38bdf8' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            يلزم تسجيل الدخول لإنشاء إعلانك
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.7, mb: 2, fontSize: '0.92rem' }}>
            أداة صانع الإعلانات وحفظ الاستراتيجيات وسكريبتات الفيديو تتطلب تسجيل الدخول. سجّل دخولك مجاناً لتتمكن من توليد خطتك الآن!
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                sessionStorage.setItem('post_auth_redirect', '/create-your-ad');
                navigate('/signin?redirect=/create-your-ad');
              }}
              startIcon={<LoginIcon />}
              sx={{
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              }}
            >
              تسجيل الدخول (Sign In)
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                sessionStorage.setItem('post_auth_redirect', '/create-your-ad');
                navigate('/signup?redirect=/create-your-ad');
              }}
              startIcon={<PersonAddIcon />}
              sx={{
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}
            >
              إنشاء حساب جديد مجاناً
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleGoogleQuickSignIn}
              sx={{
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 800,
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  borderColor: '#38bdf8',
                  bgcolor: 'rgba(255,255,255,0.06)',
                },
              }}
            >
              <GoogleSvgIcon /> الدخول بحساب Google
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setAuthDialogOpen(false)} sx={{ color: '#cbd5e1', fontWeight: 700 }}>
            إلغاء
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Payment Approval Dialog Modal (triggered via Gmail / WhatsApp link: ?approve_order=...) */}
      <Dialog
        open={adminApprovalModalOpen}
        onClose={() => setAdminApprovalModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0f172a',
            color: '#ffffff',
            borderRadius: '24px',
            border: '2px solid #38bdf8',
            p: 2.5,
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              bgcolor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <VerifiedIcon sx={{ fontSize: 36, color: '#38bdf8' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#f8fafc' }}>
            لوحة اعتماد وتأكيد التحويل (MarkNCode Admin) 👮‍♂️
          </Typography>
          <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
            مراجعة تحويل الـ 200 ج.م وتفعيل استخدام الأداة للعميل
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          {adminVerdictSuccess ? (
            <Alert severity="success" sx={{ borderRadius: '12px', fontSize: '1rem', fontWeight: 700 }}>
              {adminVerdictSuccess}
            </Alert>
          ) : (
            <Stack spacing={2}>
              <Card sx={{ p: 2.5, borderRadius: '16px', bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="body2" sx={{ color: '#e2e8f0', mb: 1 }}>
                  👤 <strong>اسم العميل:</strong> {adminOrderData?.userName || 'غير محدد'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#e2e8f0', mb: 1 }}>
                  📧 <strong>البريد الإلكتروني:</strong> {adminOrderData?.userEmail}
                </Typography>
                <Typography variant="body2" sx={{ color: '#e2e8f0', mb: 1 }}>
                  💰 <strong>المبلغ المطلوب:</strong> {adminOrderData?.amount || 200} جنيه مصري
                </Typography>
                <Typography variant="body2" sx={{ color: '#e2e8f0', mb: 1 }}>
                  💳 <strong>طريقة الدفع:</strong> {adminOrderData?.paymentMethod === 'vodafone_cash' ? 'فودافون كاش 🔴' : 'انستا باي 🟣'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#38bdf8', fontWeight: 800, mb: 1 }}>
                  📱 <strong>الرقم المحول منه:</strong> {adminOrderData?.senderPhone}
                </Typography>
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600 }}>
                  🕒 <strong>توقيت الطلب:</strong> {adminOrderData?.createdAt ? new Date(adminOrderData.createdAt).toLocaleString('ar-EG') : 'الآن'}
                </Typography>
              </Card>

              <Typography variant="body2" sx={{ color: '#fde68a', textAlign: 'center', fontWeight: 600 }}>
                هل تأكدت من وصول مبلغ 200 ج.م في حسابك وتريد فتح الأداة له الآن؟
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAdminApproveOrder}
                  disabled={isAdminSubmitting}
                  startIcon={isAdminSubmitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
                  sx={{
                    py: 1.3,
                    borderRadius: '14px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  نعم، تم الاستلام وتفعيل الحساب فوراً 🚀
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleAdminRejectOrder}
                  disabled={isAdminSubmitting}
                  startIcon={<CancelIcon />}
                  sx={{
                    py: 1.3,
                    borderRadius: '14px',
                    fontWeight: 700,
                    color: '#f87171',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    '&:hover': {
                      borderColor: '#ef4444',
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                    },
                  }}
                >
                  رفض (لم يتم التحويل) ❌
                </Button>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={() => setAdminApprovalModalOpen(false)} sx={{ color: '#cbd5e1', fontWeight: 700 }}>
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>

      {/* Beginner Ad Launch Guide Dialog Modal */}
      <Dialog
        open={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0f172a',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '24px',
            p: { xs: 1, md: 2 },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GuideIcon sx={{ color: '#38bdf8', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
              دليل المبتدئين الشامل: أين وكيف تطلق إعلانك خطوة بخطوة 🚀
            </Typography>
          </Box>
          <IconButton onClick={() => setGuideModalOpen(false)} sx={{ color: '#ffffff', '&:hover': { color: '#38bdf8' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', py: 3 }}>
          {renderBeginnerAdLaunchGuide()}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="contained"
            onClick={() => setGuideModalOpen(false)}
            sx={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              fontWeight: 800,
              px: 4,
            }}
          >
            فهمت الخطوات، لنبدأ الآن! 👍
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy / Notification Snackbar */}
      <Snackbar
        open={copiedSnackbar}
        autoHideDuration={3500}
        onClose={() => setCopiedSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default CreateYourAd;
