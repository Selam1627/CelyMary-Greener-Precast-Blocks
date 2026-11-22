// Tigrinya translation of en.ts, reviewed by the founder; it must say exactly
// the same as the English.
import type { SiteContent } from '../types.js'

export const ti: SiteContent = {
  navigation: {
    skipLink: 'ናብ ቀንዲ ትሕዝቶ ሕለፉ',
    menuLabel: 'ቀንዲ ዝርዝር',
    menuButton: 'ዝርዝር',
    logoLabel: 'ኣርማ ሰሊሜሪ',
    pages: {
      // The founder's wording: keep exactly as it is.
      home: 'መእተዊ',
      products: 'ፍርያት',
      about: 'ብዛዕባና',
      contact: 'ርኸቡና',
    },
  },

  footer: {
    label: 'ታሕተዋይ ክፋል ገፅ',
    emailLabel: 'ኢመይል፦',
    privacyLink: 'መግለፂ ብሕታውነት',
    copyright: '© 2026 ሰሊሜሪ ሓምለዋይ ብሎኬት',
  },

  // DRAFT – legal review. The privacy notice must describe only what the
  // site really does; check the code before changing it.
  privacy: {
    heading: 'መግለፂ ብሕታውነት',
    intro: 'እዚ መግለፂ፣ ነዚ መርበብ ሓበሬታ ክትጥቀሙ ከለኹም ኣብ ውልቃዊ ሓበሬታኹም እንታይ ከም ዝኸውን ብቐሊል ቃላት የብርህ።',
    emailFallback: 'ኢመይል ናይ ኩባንያ',
    sections: [
      {
        id: 'responsible',
        heading: 'ሓላፍነት',
        paragraphs: [
          'ሓላፊ ውልቃዊ ሓበሬታኹም፦ ሰላም በርሀ በየነ (Selam Berhe Beyene)፣ መስራቲት ሰሊሜሪ ሓምለዋይ ብሎኬት። ብ{email} ክትረኽቡና ትኽእሉ ኢኹም።',
        ],
      },
      {
        id: 'data',
        heading: 'እንእክቦ ሓበሬታ',
        paragraphs: [
          'ቅጥዒ ርክብ ክትሰዱ ከለኹም፣ ስምኩም፣ ኢመይል ኣድራሻኹም፣ መን ምዃንኩም (ንኣብነት ኣርክቴክት ወይ ልምዓታዊ በዓል ሃፍቲ)፣ እንተ መሪፅኩም ዝደለኹምዎ ፍርያት፣ መልእኽትኹምን ነቲ መርበብ ሓበሬታ እተንብብሉ ዝነበርኩም ቋንቋን ንቕበል።',
          'እቲ ቅጥዒ ኣንፃር ዘይተደልየ መልእኽቲ (spam) ክልተ ኣውቶማቲክ ምርመራታት እውን ይገብር፦ ሰባት ባዶ ዝገድፍዎ ሕቡእ ቦታን ነቲ ቅጥዒ ንምምላእ ዝወሰደ ግዜን። ንምኽልኻል spam ጥራይ እዮም ዘገልግሉ፤ ኣይዕቀቡን፣ ብኢመይል ውን ኣይለኣኹን።',
          'እዚ መርበብ ሓበሬታ ኩኪታት፣ መሳርሒታት ትንተና ወይ ናይ ረኽላም ሰዓብቲ ኣይጥቀምን።',
        ],
      },
      {
        id: 'purpose',
        heading: 'ንምንታይ ንጥቀመሉ',
        paragraphs: [
          'ሓበሬታኹም ነቲ መልእኽትኹም ንምንባብን ንምምላስን ጥራይ ኢና እንጥቀመሉ። ንረኽላም ኣይንጥቀመሉን፣ ኣይንሸጦን፣ ካብቶም ኣብ ታሕቲ ዝተዘርዘሩ ኣገልግሎታት ወፃኢ ድማ ንማንም ኣየሕልፎን።',
        ],
      },
      {
        id: 'legal-basis',
        heading: 'ሕጋዊ መሰረት',
        paragraphs: [
          'ነቲ ቅጥዒ ብምልኣኽ፣ ክንምልሰልኩም ትሓቱና ኣለኹም። ሓበሬታኹም እንጥቀመሉ ብመሰረት እቲ ቅጥዒ ክትሰዱ ከለኹም ዝሃብኩምዎ ፍቓድ እዩ (ዓንቀፅ 6(1)(a) ናይ ሓፈሻዊ ደንቢ ሓለዋ ሓበሬታ ሕብረት ኤውሮጳ፣ GDPR)። ፍቓድኩም ኣብ ዝኾነ እዋን ናብ {email} ብምፅሓፍ ክትስሕቡ ትኽእሉ ኢኹም። እዚ ኣብ ቅድሚኡ ዝገበርናዮ ኣይፀልዎን።',
        ],
      },
      {
        id: 'processors',
        heading: 'ሓበሬታኹም ዘመሓድሩ ኣገልግሎታት',
        paragraphs: [
          'Vercel ነዚ መርበብ ሓበሬታ የተኣናግድ፣ ነቲ ቅጥዒ ርክብ ዝሰድድ ንእሽቶ ፕሮግራም ውን የካይድ። ከም ዝኾነ መተኣናገዲ መርበብ ሓበሬታ፣ ብራውዘርኩም ገፅ ክፅዕን ከሎ ከም IP ኣድራሻኹም ዝኣመሰለ ቴክኒካዊ ሓበሬታ ይቕበል። መልእኽቲ ክለኣኽ እንተዘይኪኢሉ፣ ነቲ ፀገም ክንፈትሖ ምእንቲ እቲ ፕሮግራም ቴክኒካዊ ፀብፃብ ጌጋ ይምዝግብ።',
          'Resend ነቲ ቅጥዒ ርክብ ከም ኢመይል ናብ ሳንዱቕ ኢመይልና የብፅሖ።',
          'Google (Gmail) ንሳንዱቕ ኢመይል ኩባንያና የተኣናግድ፤ መልእኽትኹም ዝበፅሖን ዝዕቀበሉን ኣብኡ እዩ።',
          'እዞም ኣገልገልቲ ሓበሬታ ካብ ሕብረት ኤውሮጳ ወፃኢ ከመሓድሩ ይኽእሉ እዮም።',
        ],
      },
      {
        id: 'retention',
        heading: 'ክንደይ ግዜ ንዕቅቦ',
        paragraphs: [
          'ዘተና ምስ ተወድአ ድሕሪ 12 ኣዋርሕ መልእኽትኹም ካብ ሳንዱቕ ኢመይልና ንድምስሶ። እቲ መርበብ ሓበሬታ ባዕሉ መልእኽትኹም ኣይዕቅብን። Resend ብመሰረት ናይ ባዕሉ ፖሊሲ መዝገብ ናይቲ ኢመይል ንውሱን ግዜ ክዕቅብ ይኽእል።',
        ],
      },
      {
        id: 'rights',
        heading: 'መሰላትኩም',
        paragraphs: [
          'እዞም ዝስዕቡ መሰላት ኣለውኹም፦ ብዛዕባኹም ዘለና ውልቃዊ ሓበሬታ ምርኣይ (መሰል ምርካብ)፤ ከም ዝእረም ምግባር (መሰል ምእራም)፤ ከም ዝድምሰስ ምግባር (መሰል ምድምሳስ)፤ ኣጠቓቕማና ምቅዋም (መሰል ምቅዋም)፤ ኣጠቓቕምኡ ክንገድቦ ምሕታት (መሰል ምግዳብ)፤ ከምኡ ውን ዳግማይ ንምጥቃም ብዝሕግዝ ልሙድ ቅርፂ ምቕባል (መሰል ምግዕዓዝ)።',
          'ካብዞም መሰላት ንዝኾነ ንምጥቃም ናብ {email} ፅሓፉ። ብኢመይል ክንምልሰልኩም ኢና።',
        ],
      },
      {
        id: 'complaint',
        heading: 'ጥርዓን',
        paragraphs: [
          'ሓበሬታኹም ብግቡእ ከም ዘየመሓደርናዮ እንተ ኣሚንኩም፣ ናብ ኤጀንሲ ሓለዋ ሓበሬታ ስጳኛ (Agencia Española de Protección de Datos, AEPD) ጥርዓን ናይ ምቕራብ መሰል ኣለኩም፦ {aepd}።',
        ],
      },
      {
        id: 'language-choice',
        heading: 'ምርጫ ቋንቋኹም',
        paragraphs: [
          'ቋንቋ ክትመርፁ ከለኹም፣ እቲ መርበብ ሓበሬታ ኣብ ዝመፅእ ግዜ ደጊሙ ምእንቲ ከርእዮ፣ ብራውዘርኩም ነቲ ምርጫ ኣብ ናይ ባዕልኹም መሳርሒ ይዕቅቦ። ናባና ኣይለኣኽን፤ እንተኾነ እቲ ቅጥዒ ርክብ እተንብብሉ ዝነበርኩም ቋንቋ ይነግረና። ኣብ ብራውዘርኩም ሓበሬታ ናይዚ መርበብ ሓበሬታ ብምፅራይ ክተወግድዎ ትኽእሉ ኢኹም።',
        ],
      },
    ],
  },

  notFound: {
    heading: 'እዚ ገፅ ኣይተረኸበን',
    message: 'ይቕሬታ፣ ዝደለኹምዎ ገፅ ክንረኽቦ ኣይከኣልናን።',
    homeLink: 'ናብ መእተዊ ገፅ ኪዱ',
  },

  languageSwitcher: {
    label: 'ቋንቋ',
  },

  hero: {
    companyName: 'CelyMary Greener Precast Blocks',
    companyShortName: 'ሰሊሜሪ',
    companyNameGeez: 'ሰሊሜሪ ሓምለዋይ ብሎኬት',
    // The founder's wording: keep exactly as it is.
    tagline: 'ዝተሓተ ካርቦን ዘለዎ ብሎኬት ንሓምለዋይ ህንፃታት',
    actions: [
      { label: 'ምሳና ስርሑ', href: '/about' },
      { label: 'ርኸቡና', href: '/contact' },
    ],
  },

  solution: {
    heading: 'ፍታሕና',
    benefits: [
      {
        title: 'ትሑት ካርቦን',
        description: 'ካብ ልሙዳት ናይ ኮንክሪት ብሎኬታት ብዙሕ ዝተሓተ ኣሰር ካርቦን ንክህልዎም ተባሂሎም ዝተሓንፀፁ።',
      },
      {
        title: 'ዳግማይ ዝተጠቕመሎም ኢንዱስትሪያዊ ኣቑሑት',
        description: 'ካብ ዳግማይ ዝተጠቕመሎም ኢንዱስትሪያዊ ኣቑሑት ዝተሰርሑ፣ ንተረፍ ኢንዱስትሪ ካልኣይ ህይወት ዝህቡ።',
      },
      {
        title: 'ናይ ከባቢ ምህርቲ',
        description: 'ኣብ ጥቕሚ ዝውዕሉሉ ቦታ ቀረባ፣ ኣብ ከባቢ ንክፍረዩ ተባሂሎም ዝተሓንፀፁ።',
      },
    ],
  },

  products: {
    heading: 'ዝተመደቡ ፍርያትና',
    statusLabel: 'ኣብ ምምዕባል ዘሎ',
    items: [
      {
        id: 'standard-building-blocks',
        name: 'ልሙዳት ብሎኬታት ህንፃ',
        description: 'ኣብ ናይ መንበሪን ንግድን ፕሮጀክትታት መናድቕ ንምህናፅ።',
        icon: 'building-block',
      },
      {
        id: 'solar-panel-ballast-blocks',
        name: 'ናይ ፀሓያዊ ፓነል መደገፊ ብሎኬታት',
        description: 'ናይ ፀሓያዊ ፓነል መትከሊ ስርዓታት ኣብ ፀፊሕ ናሕስታትን ክፉት መሬትን፣ ናሕሲ ከይተነኽዐ ኣብ ቦትኡ ንምሓዝ።',
        icon: 'solar-ballast',
      },
      {
        id: 'paving-blocks',
        name: 'ናይ ወሰን ፅርግያ ምንፃፍ ብሎኬታት',
        description: 'ንመንገዲ እግሪ፣ ንቐፅሪ ገዛ፣ ንመእተዊ መካይንን ንህዝባዊ ቦታታትን።',
        icon: 'paving',
      },
      {
        id: 'retaining-wall-and-landscaping-blocks',
        name: 'ናይ ደጋፊ መንደቕን ምውዳብ ከባብን ብሎኬታት',
        description: 'ኣብ ፀድፊ ሓመድ ንምዕጋትን ንጀርዲናት፣ ደረጃታትን መትከሊ ዕምባባታትን ቅርፂ ንምሃብን።',
        icon: 'retaining-wall',
      },
      {
        id: 'kerbs-and-edging',
        name: 'ናይ ፅርግያ ደረትን ወሰንን',
        description: 'ንወሰናት ፅርግያታት፣ መንገድታት፣ ሳዕሪን ናይ ዕምባባ መትከሊ ቦታታትን ንምዝዛም።',
        icon: 'kerb',
      },
    ],
  },

  audiences: {
    heading: 'ምሳና ስርሑ',
    items: [
      {
        id: 'customers',
        title: 'ንዓማዊል',
        description:
          'ኣርክቴክትታት፣ መሃንድሳት፣ ሃነፅትን ኣልማዕትን፦ እቶም ዝተመደቡ ትሑት ካርቦን ዘለዎም ብሎኬታትና ምስ ፕሮጀክትታትኩም ብኸመይ ክሰማምዑ ከም ዝኽእሉ ተዘራረቡና።',
      },
      {
        id: 'investors',
        title: 'ንልምዓታውያን በዓል ሃፍቲ',
        description:
          'ትሑት ካርቦን ዘለዎም ኣቐዲሞም ዝተሰርሑ ብሎኬታት እነማዕብል ኣብ መጀመርታ ደረጃ ዘሎ ኩባንያ ኢና፣ ምርምርን ናይ ቤት ፈተነ ምምዕባልን ንምጅማር ድማ ገንዘባዊ ደገፍ ንደሊ ኣለና። ዘተ ንምጅማር ርኸቡና።',
      },
      {
        id: 'partners',
        title: 'ንመሻርኽቲ',
        description:
          'ምስ ኢንዱስትሪያዊ ኩባንያታት፣ ትካላት ምርምርን ኣብ ትሑት ካርቦን ዘለዎም ፍርያት ህንፃ ክተሓባበሩ ዝደልዩ ካልኦት ውድባትን ንምዝርራብ ፍቓደኛታት ኢና።',
      },
    ],
  },

  roadmap: {
    heading: 'ደረጃን መደብ ጉዕዞን',
    statement: 'ኣብ መጀመርታ ደረጃ ዘሎ ኩባንያ ኢና፣ ሕጂ ኣብ ደረጃ ሓሳብ ኢና ዘለና።',
    steps: [
      {
        id: 'concept-and-planning',
        title: 'ሓሳብን መደብን',
        statusLabel: 'ናይ ሕጂ ደረጃ',
      },
      {
        id: 'research-and-lab-development',
        title: 'ምርምርን ናይ ቤት ፈተነ ምምዕባልን',
        note: 'ነዚ ምዕራፍ ንምጅማር ገንዘባዊ ደገፍ ንደሊ ኣለና።',
      },
      {
        id: 'pilot-production',
        title: 'ናይ ፈተነ ምህርቲ',
      },
    ],
  },

  team: {
    heading: 'ጉጅለ',
    members: [
      {
        name: 'ሰላም በርሀ በየነ',
        role: 'መስራቲት',
        bio: 'ኣብ ዩኒቨርሲቲ ካንታብሪያ ብዛዕባ ምንካይ ካርቦን ኣብ ዘርፊ ሲሚንቶ ናይ ፒኤችዲ ተመራማሪት።',
      },
      {
        name: 'ሜሮን ገብረስላሴ ታደሰ',
        role: 'ተሓባባሪት መስራቲት',
        bio: 'ኣብ ምምሕዳር ፕሮጀክት ሞያዊ ተመኩሮ።',
      },
    ],
  },

  contact: {
    heading: 'ርኸቡና',
    labels: {
      name: 'ስም',
      email: 'ኢመይል',
      visitorType: 'መን ኢኹም?',
      product: 'ዝደለኹምዎ ፍርያት (ኣማራፂ)',
      message: 'መልእኽቲ',
    },
    visitorTypes: [
      { id: 'architect', label: 'ኣርክቴክት' },
      { id: 'engineer', label: 'መሃንድስ' },
      { id: 'builder', label: 'ሃናፂ' },
      { id: 'real-estate-developer', label: 'ኣልማዒ ሪል ስቴት' },
      { id: 'investor', label: 'ልምዓታዊ በዓል ሃፍቲ' },
      { id: 'partner', label: 'መሻርኽቲ' },
      { id: 'other', label: 'ካልእ' },
    ],
    visitorTypePrompt: 'ሓደ ምረፁ',
    productPrompt: 'ፍሉይ ፍርያት የለን',
    submitLabel: 'መልእኽቲ ስደዱ',
    sendingLabel: 'ይልኣኽ ኣሎ…',
    successMessage: 'የቐንየልና፣ መልእኽትኹም ተላኢኹ ኣሎ። ብኢመይል መልሲ ክንህበኩም ኢና።',
    failureMessage: 'ይቕሬታ፣ መልእኽትኹም ክለኣኽ ኣይከኣለን። በጃኹም ድሕሪ ቁሩብ ደቓይቕ እንደገና ፈትኑ፣ ወይ ብቐጥታ ኢመይል ስደዱልና።',
    directContactPrefix: 'ወይ ብቐጥታ ናብዚ ኣድራሻ ፅሓፉልና፦',
    privacyNote: 'ሓበሬታኹም ንኽንምልሰልኩም ጥራይ ኢና እንጥቀመሉ። {link} ኣንብቡ።',
    privacyNoteLink: 'መግለፂ ብሕታውነትና',
    spamTrapLabel: 'ነዚ ቦታ ባዶ ግደፍዎ',
    errors: {
      nameRequired: 'በጃኹም ስምኩም ኣእትዉ።',
      nameTooLong: 'በጃኹም ስምኩም ካብ 100 ፊደላት ከይበዝሐ።',
      emailRequired: 'በጃኹም ናይ ኢመይል ኣድራሻኹም ኣእትዉ።',
      emailInvalid: 'በጃኹም ቅኑዕ ናይ ኢመይል ኣድራሻ ኣእትዉ፣ ንኣብነት name@example.com።',
      visitorTypeRequired: 'በጃኹም መን ምዃንኩም ምረፁ።',
      messageRequired: 'በጃኹም መልእኽቲ ኣእትዉ።',
      messageTooLong: 'በጃኹም መልእኽትኹም ካብ 5,000 ፊደላት ከይበዝሐ።',
    },
  },
}
