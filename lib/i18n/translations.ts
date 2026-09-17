import type { Language } from './LanguageContext'

interface HowItWorksStep {
  step: string
  title: string
  description: string
}

interface HomeCopy {
  eyebrow: string
  heading: string
  subheading: string
  ctaLabel: string
  disclaimer: string
  discoverEyebrow: string
  discoverTitle: string
  discoverPoints: string[]
  howEyebrow: string
  howTitle: string
  howItWorks: HowItWorksStep[]
  noteTitle: string
  noteBody: string
}

interface QuestionCopy {
  loading: string
  questionOf: (current: number, total: number) => string
  back: string
  continue_: string
  seeResult: string
}

interface CycleStageLabels {
  trigger: string
  thought: string
  emotion: string
  reaction: string
  impact: string
  repeat: string
}

interface ResultCopy {
  resultOf: (name: string) => string
  heading: string
  primaryLabel: string
  secondaryLabel: string
  experienceTitle: string
  triggersTitle: string
  cycleTitle: string
  cycleStages: CycleStageLabels
  cycleNote: string
  disclaimer: string
  ctaTitle: string
  ctaBody: string
  whatsappLabel: string
  downloadPdfLabel: string
  notFoundTitle: string
  notFoundBody: string
  retakeLabel: string
  errorTitle: string
  errorBody: string
}

interface UiCopy {
  home: HomeCopy
  question: QuestionCopy
  result: ResultCopy
  languageToggle: string
  themeToggleToDark: string
  themeToggleToLight: string
}

export const uiText: Record<Language, UiCopy> = {
  en: {
    home: {
      eyebrow: 'Free · 5 minutes · No right or wrong answers',
      heading: 'Discover Your Relationship Pattern',
      subheading:
        'Understand the patterns that may be shaping the way you think, feel, and respond in relationships — with a free 5-minute assessment.',
      ctaLabel: 'Discover My Pattern',
      disclaimer: 'This is a self-awareness tool for reflection — not a clinical diagnosis.',
      discoverEyebrow: "What you'll discover",
      discoverTitle: 'What the assessment reflects on',
      discoverPoints: [
        'Your primary relationship pattern',
        'A secondary pattern that may also be at play',
        'Common triggers that tend to set it off',
        'The recurring thought → emotion → reaction cycle behind it',
        'Areas you may want to explore more deeply',
      ],
      howEyebrow: 'How it works',
      howTitle: 'Four simple steps',
      howItWorks: [
        {
          step: '1',
          title: 'Answer a few honest questions',
          description: 'One question at a time — there are no right or wrong answers.',
        },
        {
          step: '2',
          title: 'Enter your details',
          description: 'So we can save and send you your personalised result.',
        },
        {
          step: '3',
          title: 'Get your personalised pattern',
          description: 'See your primary and secondary relationship patterns.',
        },
        {
          step: '4',
          title: 'Explore what may be driving the cycle',
          description: 'Understand the trigger, thought, emotion, and reaction behind it.',
        },
      ],
      noteTitle: 'A note before you begin',
      noteBody:
        "This assessment is a self-awareness and self-reflection tool. It is designed to help you notice possible patterns in how you relate to others — it is not a clinical or medical diagnosis, and it doesn't label or define you. Your result is a starting point for reflection, not a conclusion.",
    },
    question: {
      loading: 'Loading your assessment…',
      questionOf: (current, total) => `Question ${current} of ${total}`,
      back: '← Back',
      continue_: 'Continue →',
      seeResult: 'See My Result →',
    },
    result: {
      resultOf: (name) => `${name}’s Result`,
      heading: 'Your Relationship Pattern',
      primaryLabel: 'Your Primary Pattern',
      secondaryLabel: 'Your Secondary Pattern',
      experienceTitle: 'You May Experience',
      triggersTitle: 'Common Triggers',
      cycleTitle: 'Your Pattern Cycle',
      cycleStages: {
        trigger: 'Trigger',
        thought: 'Thought',
        emotion: 'Emotion',
        reaction: 'Reaction',
        impact: 'Impact',
        repeat: 'Repeats',
      },
      cycleNote: 'Without a shift, this cycle tends to loop back to the trigger again.',
      disclaimer:
        'This is a self-awareness tool, not a clinical diagnosis. Your result reflects your answers today — it isn’t a fixed label, and it can change as you do.',
      ctaTitle: 'Want to work deeper on this?',
      ctaBody:
        'You can connect with us directly on WhatsApp to talk through your result and explore it further — no pressure, just a conversation.',
      whatsappLabel: 'Talk About My Result on WhatsApp',
      downloadPdfLabel: 'Download my result as a PDF',
      notFoundTitle: 'We couldn’t find that result',
      notFoundBody: 'This link may have expired or the assessment wasn’t completed. You’re welcome to take it again.',
      retakeLabel: 'Retake the Assessment',
      errorTitle: 'Something went wrong',
      errorBody: 'We’re having trouble loading this result right now. Please try again shortly.',
    },
    languageToggle: 'हिन्दी',
    themeToggleToDark: 'Dark',
    themeToggleToLight: 'Light',
  },
  hi: {
    home: {
      eyebrow: 'मुफ़्त · 5 मिनट · कोई सही या गलत उत्तर नहीं',
      heading: 'अपने रिश्ते का पैटर्न जानें',
      subheading:
        'एक मुफ़्त 5 मिनट के आकलन से उन पैटर्नों को समझें जो शायद तय करते हैं कि आप रिश्तों में कैसे सोचते, महसूस करते और प्रतिक्रिया करते हैं।',
      ctaLabel: 'मेरा पैटर्न जानें',
      disclaimer: 'यह आत्म-जागरूकता और चिंतन के लिए एक उपकरण है — कोई चिकित्सीय निदान नहीं।',
      discoverEyebrow: 'आप क्या जानेंगे',
      discoverTitle: 'यह आकलन किन बातों पर आधारित है',
      discoverPoints: [
        'आपका मुख्य रिश्ते का पैटर्न',
        'एक दूसरा पैटर्न जो शायद साथ में सक्रिय हो',
        'वे सामान्य ट्रिगर जो इसे शुरू करते हैं',
        'इसके पीछे का बार-बार दोहराने वाला विचार → भावना → प्रतिक्रिया चक्र',
        'वे पहलू जिन्हें आप और गहराई से जानना चाहें',
      ],
      howEyebrow: 'यह कैसे काम करता है',
      howTitle: 'चार आसान चरण',
      howItWorks: [
        {
          step: '1',
          title: 'कुछ ईमानदार सवालों के जवाब दें',
          description: 'एक बार में एक सवाल — कोई सही या गलत जवाब नहीं है।',
        },
        {
          step: '2',
          title: 'अपनी जानकारी भरें',
          description: 'ताकि हम आपका व्यक्तिगत परिणाम सुरक्षित करके आपको भेज सकें।',
        },
        {
          step: '3',
          title: 'अपना व्यक्तिगत पैटर्न पाएं',
          description: 'अपने मुख्य और दूसरे रिश्ते के पैटर्न देखें।',
        },
        {
          step: '4',
          title: 'जानें इस चक्र के पीछे क्या है',
          description: 'इसके पीछे के ट्रिगर, विचार, भावना और प्रतिक्रिया को समझें।',
        },
      ],
      noteTitle: 'शुरू करने से पहले एक बात',
      noteBody:
        'यह आकलन एक आत्म-जागरूकता और आत्म-चिंतन का उपकरण है। यह आपको यह पहचानने में मदद करता है कि आप दूसरों से कैसे जुड़ते हैं — यह कोई चिकित्सीय या मेडिकल निदान नहीं है, और यह आपको किसी श्रेणी में नहीं बांधता। आपका परिणाम सोचने की एक शुरुआत है, कोई अंतिम निष्कर्ष नहीं।',
    },
    question: {
      loading: 'आपका आकलन लोड हो रहा है…',
      questionOf: (current, total) => `प्रश्न ${current} में से ${total}`,
      back: '← पीछे',
      continue_: 'आगे बढ़ें →',
      seeResult: 'मेरा परिणाम देखें →',
    },
    result: {
      resultOf: (name) => `${name} का परिणाम`,
      heading: 'आपका रिश्ते का पैटर्न',
      primaryLabel: 'आपका मुख्य पैटर्न',
      secondaryLabel: 'आपका दूसरा पैटर्न',
      experienceTitle: 'आप ये महसूस कर सकते/सकती हैं',
      triggersTitle: 'सामान्य ट्रिगर',
      cycleTitle: 'आपका पैटर्न चक्र',
      cycleStages: {
        trigger: 'ट्रिगर',
        thought: 'विचार',
        emotion: 'भावना',
        reaction: 'प्रतिक्रिया',
        impact: 'असर',
        repeat: 'दोहराव',
      },
      cycleNote: 'बिना किसी बदलाव के, यह चक्र फिर से ट्रिगर की ओर लौट सकता है।',
      disclaimer:
        'यह एक आत्म-जागरूकता का उपकरण है, कोई चिकित्सीय निदान नहीं। आपका परिणाम आज के आपके जवाबों को दर्शाता है — यह कोई स्थायी लेबल नहीं है, और आपके साथ बदल सकता है।',
      ctaTitle: 'क्या इस पर और गहराई से काम करना चाहेंगे?',
      ctaBody:
        'आप अपने परिणाम पर बात करने और इसे और समझने के लिए सीधे व्हाट्सएप पर हमसे जुड़ सकते/सकती हैं — कोई दबाव नहीं, बस एक बातचीत।',
      whatsappLabel: 'व्हाट्सएप पर अपने परिणाम पर बात करें',
      downloadPdfLabel: 'अपना परिणाम PDF के रूप में डाउनलोड करें',
      notFoundTitle: 'हमें वह परिणाम नहीं मिला',
      notFoundBody: 'यह लिंक शायद समाप्त हो गया हो या आकलन पूरा नहीं हुआ हो। आप इसे दोबारा ले सकते/सकती हैं।',
      retakeLabel: 'आकलन फिर से लें',
      errorTitle: 'कुछ गड़बड़ हो गई',
      errorBody: 'अभी इस परिणाम को लोड करने में समस्या हो रही है। कृपया थोड़ी देर बाद फिर कोशिश करें।',
    },
    languageToggle: 'अंग्रेज़ी',
    themeToggleToDark: 'डार्क',
    themeToggleToLight: 'लाइट',
  },
}
