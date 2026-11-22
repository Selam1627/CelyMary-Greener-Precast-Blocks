import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { defaultLanguage, languages, type LanguageCode } from '@/content/languages'
import { siteContent } from '@/content/siteContent'

/**
 * Values that must be identical in every language: links, ids, icons and the
 * Latin company name (hero title and tab title). People's names, the
 * copyright line and the company name in the text change script on the
 * Tigrinya and Amharic pages; see "names in Ge'ez script" below.
 */
function isSameInEveryLanguage(path: string): boolean {
  return /(^|\.)(id|href|icon)$/.test(path) || path === 'hero.companyName'
}

const translations = languages
  .map((language) => language.code)
  .filter((code): code is Exclude<LanguageCode, 'en'> => code !== 'en')

/** Lists every text in the content as [path, value], for clear failure messages. */
function texts(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((item, index) => texts(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      texts(item, path ? `${path}.${key}` : key),
    )
  }
  return []
}

/** Texts only some languages have, so they are left out of the structure check. */
const onlyInSomeLanguages = new Set(['hero.companyNameGeez'])

/** The structure without the texts: the same for every complete translation. */
function shape(value: unknown, path = ''): unknown {
  if (typeof value === 'string') return isSameInEveryLanguage(path) ? value : 'text'
  if (Array.isArray(value)) return value.map((item, index) => shape(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !onlyInSomeLanguages.has(path ? `${path}.${key}` : key))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, shape(item, path ? `${path}.${key}` : key)]),
    )
  }
  return value
}

describe('languages', () => {
  it('offers English, Spanish, Tigrinya and Amharic, with English as the default', () => {
    expect(languages.map((language) => language.code)).toEqual(['en', 'es', 'ti', 'am'])
    expect(defaultLanguage).toBe('en')
  })

  it('has a complete set of texts for every language, and no others', () => {
    expect(Object.keys(siteContent).sort()).toEqual(
      languages.map((language) => language.code).sort(),
    )
  })

  it('never marks the English reference texts as a draft', () => {
    expect(languages.find((language) => language.code === 'en')!.draft).toBe(false)
  })
})

describe.each(translations)('the %s texts', (code) => {
  const content = siteContent[code]

  it('have every text the English has, in the same structure', () => {
    expect(shape(content)).toEqual(shape(siteContent.en))
  })

  it('keep the same links, ids, icons and names as the English', () => {
    // Covered by the structure check; listed separately so a failure is easy to read.
    const fixed = (all: [string, string][]) => all.filter(([path]) => isSameInEveryLanguage(path))

    expect(fixed(texts(content))).toEqual(fixed(texts(siteContent.en)))
  })

  it('have no empty texts and no spaces around them', () => {
    for (const [path, text] of texts(content)) {
      expect(text.trim(), path).not.toBe('')
      expect(text, path).toBe(text.trim())
    }
  })

  it('are actually translated: headings differ from the English', () => {
    const headings = (all: [string, string][]) =>
      all.filter(([path]) => path.endsWith('.heading')).map(([, text]) => text)

    const translated = headings(texts(content))
    headings(texts(siteContent.en)).forEach((english, index) => {
      expect(translated[index]).not.toBe(english)
    })
  })
})

describe.each(['ti', 'am'] as const)('the %s texts', (code) => {
  it('are written in Ethiopic script, apart from names', () => {
    for (const [path, text] of texts(siteContent[code])) {
      if (isSameInEveryLanguage(path)) continue
      expect(text, path).toMatch(/\p{Script=Ethiopic}/u)
    }
  })
})

describe('the company name', () => {
  it.each(languages.map((language) => language.code))(
    'stays "CelyMary Greener Precast Blocks" in Latin letters (%s)',
    (code) => {
      expect(siteContent[code].hero.companyName).toBe('CelyMary Greener Precast Blocks')
    },
  )

  it("has a second line in Ge'ez script only on the Tigrinya and Amharic pages", () => {
    expect(siteContent.en.hero.companyNameGeez).toBeUndefined()
    expect(siteContent.es.hero.companyNameGeez).toBeUndefined()
    expect(siteContent.ti.hero.companyNameGeez).toMatch(/^\p{Script=Ethiopic}/u)
    expect(siteContent.am.hero.companyNameGeez).toMatch(/^\p{Script=Ethiopic}/u)
  })
})

describe("the founder's own wording", () => {
  // Written by the founder: these must stay exactly as they are.
  it.each([
    ['ti', 'ሰሊሜሪ ሓምለዋይ ብሎኬት', 'ዝተሓተ ካርቦን ዘለዎ ብሎኬት ንሓምለዋይ ህንፃታት'],
    ['am', 'ሰሊሜሪ አረንጓዴ ብሎኬት', 'ዝቅተኛ ካርቦን ያለው ብሎኬት ለአረንጓዴ ሕንፃዎች'],
  ] as const)('is kept exactly for the %s company name and tagline', (code, name, tagline) => {
    expect(siteContent[code].hero.companyNameGeez).toBe(name)
    expect(siteContent[code].hero.tagline).toBe(tagline)
  })

  it('is kept exactly for the English tagline', () => {
    expect(siteContent.en.hero.tagline).toBe('Low-carbon precast blocks for sustainable buildings.')
  })
})

describe('Tigrinya spelling', () => {
  // Ethiopian Tigrinya writes this sound with the ፀ series, not the ጸ series.
  const tsadaiSeries = [...'ጸጹጺጻጼጽጾጿ']

  it('uses the ፀ series instead of the ጸ series in every text', () => {
    for (const [path, text] of texts(siteContent.ti)) {
      for (const letter of tsadaiSeries) {
        expect(text, `${path} contains ${letter}`).not.toContain(letter)
      }
    }
  })
})

describe("the founder's wording in the menu", () => {
  it.each([
    ['ti', 'መእተዊ'],
    ['am', 'መግቢያ'],
  ] as const)('uses "%2$s" for Home in %1$s', (code, home) => {
    expect(siteContent[code].navigation.pages.home).toBe(home)
  })

  it.each([
    ['ti', 'መእተዊ'],
    ['am', 'መግቢያ'],
  ] as const)('uses the same word for Home in the 404 page link in %s', (code, home) => {
    expect(siteContent[code].notFound.homeLink).toContain(home)
  })
})

describe("names in Ge'ez script", () => {
  const geez = {
    ti: { company: 'ሰሊሜሪ ሓምለዋይ ብሎኬት' },
    am: { company: 'ሰሊሜሪ አረንጓዴ ብሎኬት' },
  } as const
  const teamNames = ['ሰላም በርሀ በየነ', 'ሜሮን ገብረስላሴ ታደሰ']

  it.each(['ti', 'am'] as const)("writes the team members' names in Ge'ez in %s", (code) => {
    expect(siteContent[code].team.members.map((member) => member.name)).toEqual(teamNames)
  })

  it.each(['ti', 'am'] as const)("writes the company name in Ge'ez in the %s footer", (code) => {
    expect(siteContent[code].hero.companyNameGeez).toBe(geez[code].company)
    expect(siteContent[code].footer.copyright).toBe(`© 2026 ${geez[code].company}`)
  })

  it.each(['ti', 'am'] as const)(
    "names the responsible person in Ge'ez, with the official Latin name, in the %s privacy notice",
    (code) => {
      const responsible = siteContent[code].privacy.sections.find(
        (part) => part.id === 'responsible',
      )!

      expect(responsible.paragraphs[0]).toContain('ሰላም በርሀ በየነ (Selam Berhe Beyene)')
      expect(responsible.paragraphs[0]).toContain(geez[code].company)
    },
  )

  it.each(['ti', 'am'] as const)(
    'keeps Latin names only in the hero title and the bracketed official name (%s)',
    (code) => {
      for (const [path, text] of texts(siteContent[code])) {
        if (path === 'hero.companyName') continue
        const withoutOfficialName = text.replace('(Selam Berhe Beyene)', '')
        expect(withoutOfficialName, path).not.toMatch(/CelyMary|Greener|Precast|Selam|Berhe|Meron/)
      }
    },
  )

  it.each(['en', 'es'] as const)('keeps every name in Latin letters in %s', (code) => {
    const { team, footer, hero } = siteContent[code]

    expect(hero.companyNameGeez).toBeUndefined()
    expect(team.members.map((member) => member.name)).toEqual([
      'Selam Berhe Beyene',
      'Meron Gebreselassie Tadesse',
    ])
    expect(footer.copyright).toBe('© 2026 CelyMary Greener Precast Blocks')
  })
})

describe("the university in the founder's bio", () => {
  // The founder's wording for each language: keep exactly as it is.
  it.each([
    ['en', 'University of Cantabria'],
    ['es', 'Universidad de Cantabria'],
    ['ti', 'ዩኒቨርሲቲ ካንታብሪያ'],
    ['am', 'ካንታብሪያ ዩኒቨርሲቲ'],
  ] as const)('is written "%2$s" in %1$s', (code, university) => {
    expect(siteContent[code].team.members[0]!.bio).toContain(university)
  })

  it.each(['en', 'ti', 'am'] as const)(
    'keeps the Spanish name only on the Spanish page (%s)',
    (code) => {
      for (const [path, text] of texts(siteContent[code])) {
        expect(text, path).not.toContain('Universidad')
      }
    },
  )
})

describe("the founder's bio", () => {
  it("is the founder's English wording, exactly", () => {
    expect(siteContent.en.team.members[0]!.bio).toBe(
      'PhD researcher in cement-sector decarbonization at the University of Cantabria.',
    )
  })

  it.each(languages.map((language) => language.code))(
    'is one short sentence about the research, with nothing about developing materials (%s)',
    (code) => {
      const bio = siteContent[code].team.members[0]!.bio

      expect(bio).toMatch(/[.።]$/u)
      expect(bio.match(/[.።፤;,，]/gu)).toHaveLength(1)
      expect(bio).not.toMatch(/developing|desarrollando|ምምዕባል|በማልማት/)
    },
  )
})

describe('translation review, round 1', () => {
  // The founder's corrections: keep exactly as they are.
  const ti = siteContent.ti
  const es = siteContent.es
  const tiTexts = texts(ti)
  const privacyText = (code: 'ti' | 'es') =>
    siteContent[code].privacy.sections.flatMap((part) => part.paragraphs).join(' ')

  describe('Tigrinya', () => {
    it('names the paving blocks "ናይ ወሰን ፅርግያ ምንፃፍ ብሎኬታት"', () => {
      expect(ti.products.items.find((item) => item.id === 'paving-blocks')!.name).toBe(
        'ናይ ወሰን ፅርግያ ምንፃፍ ብሎኬታት',
      )
    })

    it('gives the founder and co-founder their roles, and the founder her bio', () => {
      const [founder, coFounder] = ti.team.members

      expect(founder!.role).toBe('መስራቲት')
      expect(founder!.bio).toBe('ኣብ ዩኒቨርሲቲ ካንታብሪያ ብዛዕባ ምንካይ ካርቦን ኣብ ዘርፊ ሲሚንቶ ናይ ፒኤችዲ ተመራማሪት።')
      expect(coFounder!.role).toBe('ተሓባባሪት መስራቲት')
      expect(privacyText('ti')).toContain('ሰላም በርሀ በየነ (Selam Berhe Beyene)፣ መስራቲት ሰሊሜሪ')
    })

    it('uses "ልምዓታዊ በዓል ሃፍቲ" / "ልምዓታውያን በዓል ሃፍቲ" for investors', () => {
      expect(ti.audiences.items.find((item) => item.id === 'investors')!.title).toBe(
        'ንልምዓታውያን በዓል ሃፍቲ',
      )
      expect(ti.contact.visitorTypes.find((type) => type.id === 'investor')!.label).toBe(
        'ልምዓታዊ በዓል ሃፍቲ',
      )
      expect(privacyText('ti')).toContain('ንኣብነት ኣርክቴክት ወይ ልምዓታዊ በዓል ሃፍቲ')
    })

    it('says Vercel and Gmail "የተኣናግድ"', () => {
      expect(privacyText('ti').match(/የተኣናግድ/g)).toHaveLength(2)
    })

    it('writes Resend by its company name only, like Vercel and Google', () => {
      const privacy = privacyText('ti')

      expect(privacy).toContain('Resend ነቲ ቅጥዒ ርክብ ከም ኢመይል ናብ ሳንዱቕ ኢመይልና የብፅሖ።')
      expect(privacy).toContain('Resend ብመሰረት ናይ ባዕሉ ፖሊሲ')
      expect(privacy).not.toContain('ደጊምካ ምልኣኽ')
      expect(privacy).not.toContain('(Resend)')
    })

    it('calls a website host "መተኣናገዲ መርበብ ሓበሬታ" in the Vercel paragraph', () => {
      const vercel = ti.privacy.sections.find((part) => part.id === 'processors')!.paragraphs[0]

      expect(vercel).toContain('ከም ዝኾነ መተኣናገዲ መርበብ ሓበሬታ፣ ብራውዘርኩም ገፅ ክፅዕን ከሎ')
    })

    it.each([
      ['ናይ ንጣፍ ብሎኬታት', /ንጣፍ/],
      ['መስራቲ (without ት)', /መስራቲ(?!ት)/u],
      ['ተሓባባሪ (without ት)', /ተሓባባሪ(?!ት)/u],
      ['ተመራማሪ (without ት)', /ተመራማሪ(?!ት)/u],
      ['ወፍራዪ / ወፍረይቲ', /ወፍራ|ወፍረ/],
      ['የእንግድ / የአንግድ', /የእንግድ|የአንግድ/],
      ['ኣአንጋዲ', /ኣአንጋዲ/],
      ['ፀርግያ (written ፅርግያ)', /ፀርግያ/],
    ])('no longer contains "%s" anywhere', (_word, oldWord) => {
      for (const [path, text] of tiTexts) {
        expect(text, path).not.toMatch(oldWord)
      }
    })
  })

  describe('Spanish', () => {
    it('gives the founder and co-founder their roles, and the founder her bio', () => {
      const [founder, coFounder] = es.team.members

      expect(founder!.role).toBe('Fundadora')
      expect(founder!.bio).toBe(
        'Investigadora predoctoral en descarbonización del sector del cemento en la Universidad de Cantabria.',
      )
      expect(coFounder!.role).toBe('Cofundadora')
    })
  })
})

describe('translation review, round 2', () => {
  // The founder's corrections: keep exactly as they are.
  describe('Amharic', () => {
    const spamChecks = siteContent.am.privacy.sections.find((part) => part.id === 'data')!
      .paragraphs[1]

    it("describes the spam checks in the founder's words", () => {
      expect(spamChecks).toBe(
        'ቅጹ አላስፈላጊ መልእክቶችን (spam) ለመከላከል ሁለት ራስ-ሰር ፍተሻዎችንም ያደርጋል፦ ሰዎች ባዶ የሚተዉት የተደበቀ መስክ እና ቅጹን ለመሙላት የወሰደው ጊዜ። እነዚህ አላስፈላጊ መልእክቶችን ለማስቆም ብቻ ያገለግላሉ፤ አይቀመጡም፣ በኢሜይልም አይላኩም።',
      )
    })

    it('spells "መልእክቶችን" with እ in that paragraph, and no longer says "አይፈለጌ"', () => {
      expect(spamChecks.match(/መልእክቶችን/g)).toHaveLength(2)
      expect(spamChecks).not.toContain('መልዕክቶችን')
      expect(spamChecks).not.toContain('አይፈለጌ')
    })
  })

  describe('Spanish', () => {
    const es = siteContent.es
    const privacyPart = (id: string) => es.privacy.sections.find((part) => part.id === id)!

    it('names the person responsible for the data processing', () => {
      expect(privacyPart('responsible').heading).toBe('Responsable del tratamiento')
      expect(privacyPart('responsible').paragraphs[0]).toBe(
        'La responsable del tratamiento de tus datos personales es Selam Berhe Beyene, fundadora de CelyMary Greener Precast Blocks. Puedes contactar con nosotros en {email}.',
      )
    })

    it.each([
      ['data', 0, 'tu perfil (por ejemplo'],
      ['data', 1, 'Solo sirven para frenar el spam; no se guardan'],
    ] as const)('uses the corrected words in %s, paragraph %i', (id, index, words) => {
      expect(privacyPart(id).paragraphs[index]).toContain(words)
    })

    it.each([
      [
        'purpose',
        0,
        'Usamos tus datos solo para leer tu mensaje y responderte. No los usamos con fines de marketing, no los vendemos y no los cedemos a nadie, salvo a los servicios que se indican más abajo.',
      ],
      [
        'legal-basis',
        0,
        'Al enviar el formulario, nos pides que te respondamos. La base legal es tu consentimiento, que nos das al enviar el formulario (artículo 6.1.a del Reglamento General de Protección de Datos, RGPD). Puedes retirarlo en cualquier momento escribiendo a {email}. Retirarlo no afecta a lo que hayamos hecho antes con tus datos.',
      ],
      [
        'processors',
        1,
        'Resend entrega el formulario de contacto en nuestra bandeja de entrada en forma de correo electrónico.',
      ],
      [
        'retention',
        0,
        'Eliminamos tu mensaje de nuestra bandeja de entrada 12 meses después de que termine nuestra conversación. El propio sitio web no guarda tu mensaje. Resend puede conservar un registro del correo durante un tiempo limitado, según su propia política.',
      ],
      [
        'rights',
        0,
        'Tienes derecho a: ver los datos personales que tenemos sobre ti (acceso); pedir que los corrijamos (rectificación); pedir que los borremos (supresión); oponerte a que los usemos (oposición); pedirnos que limitemos su uso (limitación); y recibirlos en un formato de uso común para poder reutilizarlos (portabilidad).',
      ],
      [
        'language-choice',
        0,
        'Cuando eliges un idioma, tu navegador guarda esa elección en tu propio dispositivo, para que el sitio pueda mostrarte ese idioma la próxima vez. No se nos envía; solo el formulario de contacto nos indica en qué idioma estabas leyendo. Puedes borrarla eliminando los datos de este sitio en tu navegador.',
      ],
    ] as const)('words the privacy notice part %s, paragraph %i, exactly', (id, index, text) => {
      expect(privacyPart(id).paragraphs[index]).toBe(text)
    })

    it('says "Colabora con nosotros" on the hero button and the About us heading', () => {
      expect(es.hero.actions.find((action) => action.href === '/about')!.label).toBe(
        'Colabora con nosotros',
      )
      expect(es.audiences.heading).toBe('Colabora con nosotros')
    })

    it('words the solution, product and customer texts exactly', () => {
      expect(es.solution.benefits[1]!.description).toBe(
        'Fabricados con materiales industriales reciclados, que dan una segunda vida a los residuos industriales.',
      )
      expect(
        es.products.items.find((item) => item.id === 'solar-panel-ballast-blocks')!.description,
      ).toBe(
        'Para sujetar las estructuras de soporte de paneles solares en cubiertas planas y sobre el terreno, sin perforar la cubierta.',
      )
      expect(es.audiences.items.find((item) => item.id === 'customers')!.description).toBe(
        'Arquitectos, ingenieros, constructores y promotores: hablemos de cómo nuestros futuros bloques bajos en carbono podrían encajar en tus proyectos.',
      )
    })

    it('words the investor and partner texts and the roadmap statement exactly', () => {
      const audience = (id: string) => es.audiences.items.find((item) => item.id === id)!

      expect(audience('investors').description).toBe(
        'Somos una empresa en fase inicial que desarrolla bloques prefabricados bajos en carbono, y buscamos financiación para iniciar la investigación y el desarrollo en laboratorio. Escríbenos y empecemos a hablar.',
      )
      expect(audience('partners').description).toBe(
        'Nos encantaría hablar con empresas industriales, centros de investigación y otras organizaciones interesadas en colaborar en productos de construcción bajos en carbono.',
      )
      expect(es.roadmap.statement).toBe(
        'Somos una empresa en sus inicios, actualmente en fase de concepto.',
      )
    })

    it('words the contact form texts exactly, and keeps "Soy..." and "Indica quién eres."', () => {
      const { contact } = es

      expect(contact.heading).toBe('Contacta con nosotros')
      expect(contact.visitorTypes.find((type) => type.id === 'other')!.label).toBe('Otro/a')
      expect(contact.successMessage).toBe(
        'Gracias. Tu mensaje se ha enviado. Te responderemos por correo electrónico.',
      )
      expect(contact.errors.nameTooLong).toBe('El nombre puede tener 100 caracteres como máximo.')
      expect(contact.errors.messageTooLong).toBe(
        'El mensaje puede tener 5000 caracteres como máximo.',
      )
      expect(contact.labels.visitorType).toBe('Soy...')
      expect(contact.errors.visitorTypeRequired).toBe('Indica quién eres.')
    })

    it('no longer says "con menos carbono" in the texts corrected so far', () => {
      expect(es.audiences.items.map((item) => item.description).join(' ')).not.toContain(
        'con menos carbono',
      )
    })
  })

  describe('Amharic, part 2', () => {
    const am = siteContent.am
    const privacyPart = (id: string) => am.privacy.sections.find((part) => part.id === id)!

    it('calls the privacy notice "የግላዊነት መግለጫ" everywhere', () => {
      expect(am.privacy.heading).toBe('የግላዊነት መግለጫ')
      expect(am.footer.privacyLink).toBe('የግላዊነት መግለጫ')
      expect(am.contact.privacyNoteLink).toBe('የግላዊነት መግለጫ')
      expect(am.privacy.intro.startsWith('ይህ መግለጫ ')).toBe(true)
      for (const [path, text] of texts(am)) {
        expect(text, path).not.toContain('የግላዊነት ማስታወቂያ')
        expect(text, path).not.toContain('ይህ ማስታወቂያ')
      }
    })

    it('uses the corrected privacy wording', () => {
      expect(privacyPart('responsible').heading).toBe('ኃላፊው ማን ነው')
      expect(privacyPart('purpose').paragraphs[0]).toContain('መልዕክትዎን ለማንበብ እና ምላሽ ለመስጠት ብቻ ነው።')
      expect(privacyPart('legal-basis').paragraphs[0]).toContain('ቅጹን በመላክ ምላሽ እንድንሰጥዎ ይጠይቁናል።')
      expect(privacyPart('legal-basis').paragraphs[0]).toMatch(
        /ፈቃድዎን ማንሳትዎ ከዚያ በፊት ያደረግነውን አይነካም።$/u,
      )
      expect(am.contact.privacyNote).toBe('መረጃዎን የምንጠቀመው ምላሽ ለመስጠት ብቻ ነው። የእኛን {link} ያንብቡ።')
    })

    it('uses the corrected product, roadmap and team wording', () => {
      const [founder, coFounder] = am.team.members

      expect(am.products.statusLabel).toBe('በዝግጅት ላይ')
      expect(
        am.roadmap.steps.find((step) => step.id === 'research-and-lab-development')!.title,
      ).toBe('ምርምር እና የቤተ ሙከራ ሥራ')
      expect(founder!.bio).toBe('በካንታብሪያ ዩኒቨርሲቲ በሲሚንቶ ዘርፍ የካርቦን ልቀት ቅነሳ ላይ የምትሠራ የፒኤችዲ ተመራማሪ።')
      expect(coFounder!.bio).toBe('በፕሮጀክት አስተዳደር ሙያዊ ልምድ አላት።')
    })
  })

  describe('Tigrinya, part 2', () => {
    it('words the restriction right exactly, and leaves the other rights as they were', () => {
      const rights = siteContent.ti.privacy.sections.find((part) => part.id === 'rights')!
        .paragraphs[0]!

      expect(rights).toContain('ኣጠቓቕምኡ ክንገድቦ ምሕታት (መሰል ምግዳብ)')
      expect(rights).not.toContain('መሰል ምድራት')
      for (const right of [
        '(መሰል ምርካብ)',
        '(መሰል ምእራም)',
        '(መሰል ምድምሳስ)',
        '(መሰል ምቅዋም)',
        '(መሰል ምግዕዓዝ)',
      ]) {
        expect(rights).toContain(right)
      }
    })
  })
})

describe('review status', () => {
  // Tests run from the project root.
  const localeFile = (code: LanguageCode) =>
    readFileSync(resolve(process.cwd(), 'src/content/locales', `${code}.ts`), 'utf8')

  it('marks no language as a draft: the founder has reviewed every translation', () => {
    for (const language of languages) {
      expect(language.draft, language.code).toBe(false)
    }
  })

  it.each(translations)('has no "awaiting review" note in the %s file', (code) => {
    expect(localeFile(code)).not.toContain('DRAFT – awaiting review')
  })

  it.each(languages.map((language) => language.code))(
    'keeps the privacy notice marked as a draft for legal review in %s',
    (code) => {
      expect(localeFile(code)).toContain('DRAFT – legal review')
    },
  )
})
