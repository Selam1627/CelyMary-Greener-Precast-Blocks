// DRAFT – awaiting review. Amharic translation of en.ts; it must say exactly
// the same as the English. Remove this note and set draft to false for "am"
// in src/content/languages.ts once the translation has been reviewed.
import type { SiteContent } from '../types.js'

export const am: SiteContent = {
  navigation: {
    skipLink: 'ወደ ዋናው ይዘት ይዝለሉ',
    menuLabel: 'ዋና ማውጫ',
    menuButton: 'ማውጫ',
    logoLabel: 'የሰሊሜሪ አርማ',
    pages: {
      // The founder's wording: keep exactly as it is.
      home: 'መግቢያ',
      products: 'ምርቶች',
      about: 'ስለ እኛ',
      contact: 'ያግኙን',
    },
  },

  footer: {
    label: 'የገጹ ግርጌ',
    emailLabel: 'ኢሜይል፦',
    privacyLink: 'የግላዊነት ማስታወቂያ',
    copyright: '© 2026 ሰሊሜሪ አረንጓዴ ብሎኬት',
  },

  // DRAFT – legal review. The privacy notice must describe only what the
  // site really does; check the code before changing it.
  privacy: {
    heading: 'የግላዊነት ማስታወቂያ',
    intro: 'ይህ ማስታወቂያ ይህንን ድረ-ገጽ ሲጠቀሙ በግል መረጃዎ ላይ ምን እንደሚደረግ በቀላል ቃላት ያብራራል።',
    emailFallback: 'የኩባንያው ኢሜይል',
    sections: [
      {
        id: 'responsible',
        heading: 'ኃላፊነት',
        paragraphs: [
          'የግል መረጃዎ ኃላፊ፦ ሰላም በርሀ በየነ (Selam Berhe Beyene)፣ የሰሊሜሪ አረንጓዴ ብሎኬት መሥራች። በ{email} ሊያገኙን ይችላሉ።',
        ],
      },
      {
        id: 'data',
        heading: 'የምንሰበስበው መረጃ',
        paragraphs: [
          'የመገናኛ ቅጹን ሲልኩ ስምዎን፣ የኢሜይል አድራሻዎን፣ ማን እንደሆኑ (ለምሳሌ አርክቴክት ወይም ባለሀብት)፣ ከመረጡ የሚፈልጉትን ምርት፣ መልዕክትዎን እና ድረ-ገጹን ሲያነቡበት የነበረውን ቋንቋ እንቀበላለን።',
          'ቅጹ አይፈለጌ መልዕክቶችን ለመከላከል ሁለት ራስ-ሰር ምርመራዎችንም ያደርጋል፦ ሰዎች ባዶ የሚተዉት የተደበቀ መስክ እና ቅጹን ለመሙላት የወሰደው ጊዜ። እነዚህ አይፈለጌ መልዕክቶችን ለማስቆም ብቻ ያገለግላሉ፤ አይቀመጡም፣ በኢሜይልም አይላኩም።',
          'ይህ ድረ-ገጽ ኩኪዎችን፣ የትንታኔ መሣሪያዎችን ወይም የማስታወቂያ መከታተያዎችን አይጠቀምም።',
        ],
      },
      {
        id: 'purpose',
        heading: 'ለምን እንጠቀምበታለን',
        paragraphs: [
          'መረጃዎን የምንጠቀመው መልዕክትዎን ለማንበብ እና እርስዎን ለመመለስ ብቻ ነው። ለማስታወቂያ አንጠቀምበትም፤ አንሸጠውም፤ ከታች ከተዘረዘሩት አገልግሎቶች ውጪ ለማንም አናስተላልፈውም።',
        ],
      },
      {
        id: 'legal-basis',
        heading: 'ሕጋዊ መሠረት',
        paragraphs: [
          'ቅጹን በመላክ እንድንመልስልዎ ይጠይቁናል። መረጃዎን የምናስተናግደው ቅጹን ሲልኩ በሰጡት ፈቃድ መሠረት ነው (የአውሮፓ ኅብረት አጠቃላይ የመረጃ ጥበቃ ደንብ፣ GDPR፣ አንቀጽ 6(1)(a))። ፈቃድዎን በማንኛውም ጊዜ ወደ {email} በመጻፍ ማንሳት ይችላሉ። ይህ ከዚያ በፊት ያደረግነውን አይነካም።',
        ],
      },
      {
        id: 'processors',
        heading: 'መረጃዎን የሚያስተናግዱ አገልግሎቶች',
        paragraphs: [
          'Vercel ይህንን ድረ-ገጽ ያስተናግዳል፤ የመገናኛ ቅጹን የሚልከውን አነስተኛ ፕሮግራምም ያስኬዳል። እንደማንኛውም የድረ-ገጽ ማስተናገጃ፣ አሳሽዎ ገጽ ሲጭን እንደ IP አድራሻዎ ያሉ ቴክኒካዊ መረጃዎችን ይቀበላል። መልዕክት መላክ ካልተቻለ፣ ችግሩን እንድናስተካክል ፕሮግራሙ ቴክኒካዊ የስህተት ሪፖርት ይመዘግባል።',
          'Resend የመገናኛ ቅጹን እንደ ኢሜይል ወደ ኢሜይል ሳጥናችን ያደርሳል።',
          'Google (Gmail) የኩባንያችንን ኢሜይል ሳጥን ያስተናግዳል፤ መልዕክትዎ የሚደርሰውና የሚቀመጠው እዚያ ነው።',
          'እነዚህ አገልግሎት ሰጪዎች መረጃን ከአውሮፓ ኅብረት ውጭ ሊያስተናግዱ ይችላሉ።',
        ],
      },
      {
        id: 'retention',
        heading: 'ለምን ያህል ጊዜ እናስቀምጠዋለን',
        paragraphs: [
          'ውይይታችን ካለቀ ከ12 ወራት በኋላ መልዕክትዎን ከኢሜይል ሳጥናችን እንሰርዘዋለን። ድረ-ገጹ ራሱ መልዕክትዎን አያስቀምጥም። Resend በራሱ ፖሊሲ መሠረት የኢሜይሉን መዝገብ ለተወሰነ ጊዜ ሊያስቀምጥ ይችላል።',
        ],
      },
      {
        id: 'rights',
        heading: 'መብቶችዎ',
        paragraphs: [
          'የሚከተሉት መብቶች አሉዎት፦ ስለእርስዎ የያዝነውን የግል መረጃ ማየት (የማግኘት መብት)፤ እንዲታረም ማድረግ (የማረም መብት)፤ እንዲሰረዝ ማድረግ (የመሰረዝ መብት)፤ መጠቀማችንን መቃወም (የመቃወም መብት)፤ አጠቃቀሙን እንድንገድብ መጠየቅ (የመገደብ መብት)፤ እና እንደገና ለመጠቀም በሚያስችል የተለመደ ቅርጸት መቀበል (የማዛወር መብት)።',
          'ከእነዚህ መብቶች ማንኛውንም ለመጠቀም ወደ {email} ይጻፉ። በኢሜይል እንመልስልዎታለን።',
        ],
      },
      {
        id: 'complaint',
        heading: 'ቅሬታ',
        paragraphs: [
          'መረጃዎን በአግባቡ እንዳላስተናገድን ካሰቡ፣ ለስፔን የመረጃ ጥበቃ ባለሥልጣን (Agencia Española de Protección de Datos, AEPD) ቅሬታ የማቅረብ መብት አለዎት፦ {aepd}።',
        ],
      },
      {
        id: 'language-choice',
        heading: 'የቋንቋ ምርጫዎ',
        paragraphs: [
          'ቋንቋ ሲመርጡ፣ ድረ-ገጹ በሚቀጥለው ጊዜ እንዲያሳየው አሳሽዎ ምርጫውን በራስዎ መሣሪያ ላይ ያስቀምጣል። ወደ እኛ አይላክም፤ የመገናኛ ቅጹ ግን ሲያነቡበት የነበረውን ቋንቋ ይነግረናል። በአሳሽዎ ውስጥ የዚህን ድረ-ገጽ መረጃ በማጽዳት ሊያስወግዱት ይችላሉ።',
        ],
      },
    ],
  },

  notFound: {
    heading: 'ገጹ አልተገኘም',
    message: 'ይቅርታ፣ የፈለጉትን ገጽ ማግኘት አልቻልንም።',
    homeLink: 'ወደ መግቢያ ገጽ ይሂዱ',
  },

  languageSwitcher: {
    label: 'ቋንቋ',
  },

  hero: {
    companyName: 'CelyMary Greener Precast Blocks',
    companyShortName: 'ሰሊሜሪ',
    companyNameGeez: 'ሰሊሜሪ አረንጓዴ ብሎኬት',
    // The founder's wording: keep exactly as it is.
    tagline: 'ዝቅተኛ ካርቦን ያለው ብሎኬት ለአረንጓዴ ሕንፃዎች',
    actions: [
      { label: 'ከእኛ ጋር ይሥሩ', href: '/about' },
      { label: 'ያግኙን', href: '/contact' },
    ],
  },

  solution: {
    heading: 'የእኛ መፍትሔ',
    benefits: [
      {
        title: 'ዝቅተኛ ካርቦን',
        description: 'ከተለመዱት የኮንክሪት ብሎኬቶች እጅግ ያነሰ የካርቦን አሻራ እንዲኖራቸው ተደርገው የተነደፉ።',
      },
      {
        title: 'እንደገና ጥቅም ላይ የዋሉ የኢንዱስትሪ ቁሳቁሶች',
        description: 'እንደገና ጥቅም ላይ ከዋሉ የኢንዱስትሪ ቁሳቁሶች የተሠሩ፣ ለኢንዱስትሪ ተረፈ ምርቶች ሁለተኛ ሕይወት የሚሰጡ።',
      },
      {
        title: 'የአገር ውስጥ ምርት',
        description: 'ጥቅም ላይ በሚውሉበት አካባቢ አቅራቢያ በአገር ውስጥ እንዲመረቱ ተደርገው የተነደፉ።',
      },
    ],
  },

  products: {
    heading: 'ያቀድናቸው ምርቶች',
    statusLabel: 'በልማት ላይ',
    items: [
      {
        id: 'standard-building-blocks',
        name: 'መደበኛ የግንባታ ብሎኬቶች',
        description: 'በመኖሪያ እና በንግድ ፕሮጀክቶች ውስጥ ግድግዳዎችን ለመገንባት።',
        icon: 'building-block',
      },
      {
        id: 'solar-panel-ballast-blocks',
        name: 'የፀሐይ ፓነል ማረጋጊያ ብሎኬቶች',
        description: 'የፀሐይ ፓነል መግጠሚያ መዋቅሮችን በጠፍጣፋ ጣሪያዎች እና በክፍት መሬት ላይ፣ ጣሪያውን ሳይበሱ በቦታቸው ለማቆየት።',
        icon: 'solar-ballast',
      },
      {
        id: 'paving-blocks',
        name: 'የንጣፍ ብሎኬቶች',
        description: 'ለእግረኛ መንገዶች፣ ለግቢ ወለሎች፣ ለመኪና መግቢያዎች እና ለሕዝብ ቦታዎች።',
        icon: 'paving',
      },
      {
        id: 'retaining-wall-and-landscaping-blocks',
        name: 'የድጋፍ ግድግዳ እና የመሬት ገጽታ ብሎኬቶች',
        description: 'በተዳፋት ላይ አፈርን ለመያዝ እና የአትክልት ቦታዎችን፣ እርከኖችን እና የአበባ መትከያዎችን ለመቅረጽ።',
        icon: 'retaining-wall',
      },
      {
        id: 'kerbs-and-edging',
        name: 'የመንገድ ጠርዝ እና የዳር ብሎኬቶች',
        description: 'የመንገዶችን፣ የእግረኛ መንገዶችን፣ የሣር ሜዳዎችን እና የአበባ ማሳዎችን ጠርዝ ለማጠናቀቅ።',
        icon: 'kerb',
      },
    ],
  },

  audiences: {
    heading: 'ከእኛ ጋር ይሥሩ',
    items: [
      {
        id: 'customers',
        title: 'ለደንበኞች',
        description:
          'አርክቴክቶች፣ መሐንዲሶች፣ ገንቢዎች እና አልሚዎች፦ ያቀድናቸው ዝቅተኛ ካርቦን ያላቸው ብሎኬቶች ከፕሮጀክቶችዎ ጋር እንዴት ሊስማሙ እንደሚችሉ ያነጋግሩን።',
      },
      {
        id: 'investors',
        title: 'ለባለሀብቶች',
        description:
          'ዝቅተኛ ካርቦን ያላቸው ቀድመው የተሠሩ ብሎኬቶችን በማልማት ላይ ያለን በመጀመሪያ ደረጃ ላይ የሚገኝ ኩባንያ ነን፤ ምርምር እና የቤተ ሙከራ ልማት ለመጀመር የገንዘብ ድጋፍ እየፈለግን ነው። ውይይት ለመጀመር ያግኙን።',
      },
      {
        id: 'partners',
        title: 'ለአጋሮች',
        description:
          'ዝቅተኛ ካርቦን ባላቸው የግንባታ ምርቶች ላይ ለመተባበር ፍላጎት ካላቸው የኢንዱስትሪ ኩባንያዎች፣ የምርምር ተቋማት እና ሌሎች ድርጅቶች ጋር ለመወያየት ደስተኞች ነን።',
      },
    ],
  },

  roadmap: {
    heading: 'ደረጃ እና የወደፊት ዕቅድ',
    statement: 'በመጀመሪያ ደረጃ ላይ ያለ ኩባንያ ነን፤ በአሁኑ ጊዜ በጽንሰ-ሐሳብ ደረጃ ላይ እንገኛለን።',
    steps: [
      {
        id: 'concept-and-planning',
        title: 'ጽንሰ-ሐሳብ እና ዕቅድ',
        statusLabel: 'የአሁኑ ደረጃ',
      },
      {
        id: 'research-and-lab-development',
        title: 'ምርምር እና የቤተ ሙከራ ልማት',
        note: 'ይህንን ምዕራፍ ለመጀመር የገንዘብ ድጋፍ እየፈለግን ነው።',
      },
      {
        id: 'pilot-production',
        title: 'የሙከራ ምርት',
      },
    ],
  },

  team: {
    heading: 'ቡድን',
    members: [
      {
        name: 'ሰላም በርሀ በየነ',
        role: 'መሥራች',
        // REVIEW: written without a gendered verb form; adjust if needed.
        bio: 'በካንታብሪያ ዩኒቨርሲቲ የሲሚንቶ ዘርፍን ካርቦን ልቀት በመቀነስ ላይ የፒኤችዲ ተመራማሪ።',
      },
      {
        name: 'ሜሮን ገብረስላሴ ታደሰ',
        role: 'ተባባሪ መሥራች',
        bio: 'በፕሮጀክት አስተዳደር ዘርፍ ሙያዊ ልምድ።',
      },
    ],
  },

  contact: {
    heading: 'ያግኙን',
    labels: {
      name: 'ስም',
      email: 'ኢሜይል',
      visitorType: 'ማን ነዎት?',
      product: 'የሚፈልጉት ምርት (አማራጭ)',
      message: 'መልዕክት',
    },
    visitorTypes: [
      { id: 'architect', label: 'አርክቴክት' },
      { id: 'engineer', label: 'መሐንዲስ' },
      { id: 'builder', label: 'ገንቢ' },
      { id: 'real-estate-developer', label: 'የሪል እስቴት አልሚ' },
      { id: 'investor', label: 'ባለሀብት' },
      { id: 'partner', label: 'አጋር' },
      { id: 'other', label: 'ሌላ' },
    ],
    visitorTypePrompt: 'አንዱን ይምረጡ',
    productPrompt: 'የተለየ ምርት የለም',
    submitLabel: 'መልዕክት ይላኩ',
    sendingLabel: 'በመላክ ላይ…',
    successMessage: 'እናመሰግናለን፣ መልዕክትዎ ተልኳል። በኢሜይል መልስ እንሰጥዎታለን።',
    failureMessage: 'ይቅርታ፣ መልዕክትዎ ሊላክ አልቻለም። እባክዎ ከጥቂት ደቂቃዎች በኋላ እንደገና ይሞክሩ፣ ወይም በቀጥታ ኢሜይል ይላኩልን።',
    directContactPrefix: 'ወይም በቀጥታ በዚህ አድራሻ ይጻፉልን፦',
    privacyNote: 'መረጃዎን የምንጠቀመው እርስዎን ለመመለስ ብቻ ነው። የእኛን {link} ያንብቡ።',
    privacyNoteLink: 'የግላዊነት ማስታወቂያ',
    spamTrapLabel: 'ይህንን መስክ ባዶ ይተዉት',
    errors: {
      nameRequired: 'እባክዎ ስምዎን ያስገቡ።',
      nameTooLong: 'እባክዎ ስምዎ ከ100 ቁምፊዎች ያልበለጠ ይሁን።',
      emailRequired: 'እባክዎ የኢሜይል አድራሻዎን ያስገቡ።',
      emailInvalid: 'እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ፣ ለምሳሌ name@example.com።',
      visitorTypeRequired: 'እባክዎ ማን እንደሆኑ ይምረጡ።',
      messageRequired: 'እባክዎ መልዕክት ያስገቡ።',
      messageTooLong: 'እባክዎ መልዕክትዎ ከ5,000 ቁምፊዎች ያልበለጠ ይሁን።',
    },
  },
}
