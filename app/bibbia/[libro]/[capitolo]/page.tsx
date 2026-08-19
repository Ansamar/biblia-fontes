import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppShell from '../../../../src/components/AppShell';
import StudyContextNav from '../../../../src/components/StudyContextNav';
import UniversalChapterStudy from '../../../../src/components/UniversalChapterStudy';
import type { BiblicalTextUnit } from '../../../../src/components/BiblicalTextReader';
import { client } from '../../../../src/sanity/client';
import { bookAbbreviation, bookIdFromSlug, categoryLabel } from '../../../../src/lib/bibleRouting';
import { textFixtureFor } from '../../../../src/data/textFixtures';
import { parseStudyContext, studyContextHref } from '../../../../src/study-context/context';

const DANIEL_SPECIAL_TRADITIONS = [
  'susanna_og',
  'susanna_teodozione',
  'bel_og',
  'bel_teodozione',
];

const query = `{
  "libro": *[_id == $bookId][0]{_id, titolo, categoriaId, capitoli, mondoDelTesto},
  "capitolo": *[_type == "capitolo" && libro._ref == $bookId && numero == $numero][0]{
    _id, numero, titolo, sintesi, struttura, eventiNarrati, datazione, analisiLetteraria,
    analisiStoricoCritica, tradizione, redazione, contestoStorico, testoCritico,
    attribuzioniFonti[]{..., "fonte": fonte->{_id, sigla, nome, titolo, categoria, descrizione}},
    bibliografia
  },
  "testiBiblici": *[
    _type == "testoBiblicoCapitolo" &&
    libro._ref == $bookId &&
    (
      (
        numero == $numero &&
        !(
          $bookId == "libro-daniele" &&
          tradizione in ["susanna_og", "susanna_teodozione", "bel_og", "bel_teodozione"]
        )
      ) ||
      (
        $bookId == "libro-daniele" &&
        $numero == 13 &&
        tradizione in ["susanna_og", "susanna_teodozione"]
      ) ||
      (
        $bookId == "libro-daniele" &&
        $numero == 14 &&
        tradizione in ["bel_og", "bel_teodozione"]
      )
    )
  ]{
    _id,
    numero, numeroAlternativo, edizione, lingua, tradizione, testimone, direzione,
    versetti[]{
      _key,
      numero,
      testo,
      metatesto,
      marcatoreAlfabetico,
      riferimentoAlternativo,
      statoTestuale,
      notaEditoriale,
      apparatoMasoretico
    }
  }
}`;

type ReaderWitness = BiblicalTextUnit & {_id?: string};

function normalized(value?: string) {
  return (value || '').trim().toLocaleLowerCase('it-IT');
}

function isItalianWitness(text: ReaderWitness) {
  const lingua = normalized(text.lingua);
  const tradizione = normalized(text.tradizione);
  const edizione = normalized(text.edizione);
  return lingua === 'it' || lingua.includes('italian') || tradizione.includes('cei') || edizione.includes('cei');
}

function isExplicitGreekWitness(text: ReaderWitness) {
  const lingua = normalized(text.lingua);
  const tradizione = normalized(text.tradizione);
  const edizione = normalized(text.edizione);
  return lingua === 'grc' || lingua.includes('grec') || tradizione.includes('lxx') || tradizione.includes('grec') || edizione.includes('settanta') || edizione.includes('lxx');
}

function isExplicitHebrewWitness(text: ReaderWitness) {
  const lingua = normalized(text.lingua);
  const tradizione = normalized(text.tradizione);
  return lingua === 'he' || lingua.includes('ebra') || tradizione === 'mt' || tradizione.includes('masoret') || tradizione.includes('ebra');
}

function isExplicitLatinWitness(text: ReaderWitness) {
  const lingua = normalized(text.lingua);
  const tradizione = normalized(text.tradizione);
  const edizione = normalized(text.edizione);
  return lingua === 'la' || lingua.includes('latin') || tradizione.includes('vulg') || edizione.includes('vulg');
}

function witnessPriority(text: ReaderWitness) {
  if (isItalianWitness(text)) return 0;
  const hasLanguageMetadata = Boolean(normalized(text.lingua) || normalized(text.tradizione) || normalized(text.edizione));
  if (!hasLanguageMetadata) return 1;
  if (isExplicitHebrewWitness(text)) return 2;
  if (isExplicitGreekWitness(text)) return 3;
  if (isExplicitLatinWitness(text)) return 4;
  return 5;
}

function witnessIdentity(text: ReaderWitness) {
  return [
    normalized(text.tradizione),
    normalized(text.lingua),
    normalized(text.testimone),
    normalized(text.edizione),
    String(text.numero ?? ''),
  ].join('|');
}

function textFingerprint(text: ReaderWitness) {
  return (text.versetti || [])
    .map((verse) => `${verse.numero}:${normalized(verse.testo)}`)
    .join('||');
}

function deduplicateWitnesses(texts: ReaderWitness[]) {
  const seenIdentity = new Set<string>();
  const seenContent = new Set<string>();
  const result: ReaderWitness[] = [];

  for (const text of texts) {
    const identity = witnessIdentity(text);
    const content = textFingerprint(text);
    const contentKey = content ? `${normalized(text.lingua)}|${content}` : '';

    if (seenIdentity.has(identity)) continue;
    if (contentKey && seenContent.has(contentKey)) continue;

    seenIdentity.add(identity);
    if (contentKey) seenContent.add(contentKey);
    result.push(text);
  }

  return result;
}

function orderWitnesses(texts: ReaderWitness[]) {
  return deduplicateWitnesses(texts)
    .map((text, index) => ({ text, index }))
    .sort((a, b) => witnessPriority(a.text) - witnessPriority(b.text) || a.index - b.index)
    .map(({ text }) => text);
}

function isDanielSpecialWitness(text: ReaderWitness) {
  return DANIEL_SPECIAL_TRADITIONS.includes(normalized(text.tradizione));
}

function isWitnessRelevantToChapter(slug: string, numero: number, text: ReaderWitness) {
  if (slug !== 'daniele') return true;

  const tradizione = normalized(text.tradizione);

  if (numero === 13) {
    return !isDanielSpecialWitness(text) || tradizione === 'susanna_og' || tradizione === 'susanna_teodozione';
  }

  if (numero === 14) {
    return !isDanielSpecialWitness(text) || tradizione === 'bel_og' || tradizione === 'bel_teodozione';
  }

  return !isDanielSpecialWitness(text);
}

function titleFromSlug(slug?: string) {
  if (!slug) return 'Historical Explorer';
  return slug.split('-').map((part) => part ? part[0].toLocaleUpperCase('it-IT') + part.slice(1) : part).join(' ');
}

export default async function DynamicChapterPage({ params, searchParams }: { params: Promise<{ libro: string; capitolo: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { libro: slug, capitolo } = await params;
  const context = parseStudyContext(await searchParams);
  const numero = Number(capitolo);
  if (!Number.isInteger(numero) || numero < 1) notFound();

  const bookId = bookIdFromSlug(slug);
  const data = await client.fetch(query, { bookId, numero });
  if (!data?.libro || !data?.capitolo) notFound();

  const { libro, capitolo: chapter } = data;
  const total = libro.capitoli || numero;
  if (numero > total) notFound();
  const abbr = bookAbbreviation(slug, libro.titolo);
  const reference = `${abbr} ${numero}`;
  const category = categoryLabel(libro.categoriaId);

  const sanityTextsRaw = Array.isArray(data.testiBiblici) ? (data.testiBiblici as ReaderWitness[]) : [];
  const sanityTexts = sanityTextsRaw.filter((text) => isWitnessRelevantToChapter(slug, numero, text));
  const fixture = textFixtureFor(slug, numero);
  const hasItalianSanity = sanityTexts.some(isItalianWitness);
  const witnesses = orderWitnesses([
    ...(!hasItalianSanity && fixture ? [fixture] : []),
    ...sanityTexts,
  ]);
  const biblicalText = witnesses.length ? { ...witnesses[0], witnesses } : fixture;

  const fromHistory = context.source === 'history' && Boolean(context.book);
  const historyBackHref = fromHistory && context.book
    ? studyContextHref(`/historical-explorer/${context.book}`, { book: context.book, source: 'history', year: context.year, entity: context.entity })
    : null;
  const contextualChapterHref = (chapterNumber: number) => fromHistory
    ? studyContextHref(`/bibbia/${slug}/${chapterNumber}`, { book: context.book, chapter: chapterNumber, source: 'history', year: context.year, entity: context.entity })
    : `/bibbia/${slug}/${chapterNumber}`;

  return <AppShell>
    <StudyContextNav bookSlug={slug} bookTitle={libro.titolo} firstChapter={1} active="text" historyAvailable />
    <main className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-14 xl:px-10">
      <nav className="text-sm text-ink-faint" aria-label="Breadcrumb"><Link href="/" className="hover:text-bronze">Bibbia</Link><span className="mx-2">/</span><span>{category}</span><span className="mx-2">/</span><Link href={`/bibbia/${slug}`} className="hover:text-bronze">{libro.titolo}</Link><span className="mx-2">/</span><span className="text-ink-soft">Capitolo {numero}</span></nav>

      <header className="mt-9"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bronze">{libro.titolo} · Capitolo {numero}</p><h1 className="mt-3 font-serif text-5xl font-bold md:text-6xl">{chapter.titolo || `Capitolo ${numero}`}</h1></div><div className="flex gap-4 text-sm">{numero > 1 && <Link href={contextualChapterHref(numero-1)} className="text-ink-soft hover:text-bronze">← {abbr} {numero-1}</Link>}{numero < total && <Link href={contextualChapterHref(numero+1)} className="text-ink-soft hover:text-bronze">{abbr} {numero+1} →</Link>}</div></div></header>

      {fromHistory && historyBackHref && <section className="mt-7 rounded-2xl border border-bronze/45 bg-bronze/8 p-4 md:flex md:items-center md:justify-between md:gap-5" aria-label="Contesto storico conservato"><div><p className="font-mono text-[10px] uppercase tracking-widest text-bronze">Contesto conservato · Storia</p><p className="mt-1 text-sm leading-6 text-ink-soft">Hai aperto {reference} dall’Historical Explorer di {titleFromSlug(context.book)}{context.entity ? `, entità “${context.entity}”` : ''}{context.year !== undefined ? `, alla data di ${Math.abs(context.year)} ${context.year < 0 ? 'a.C.' : 'd.C.'}` : ''}. Il collegamento indica pertinenza documentaria o comparativa, non identifica automaticamente il racconto con un evento storico.</p></div><Link href={historyBackHref} className="mt-3 inline-flex shrink-0 rounded-full border border-bronze px-4 py-2 text-sm font-semibold text-bronze hover:bg-bronze hover:text-white md:mt-0">← Torna alla scena storica</Link></section>}

      <UniversalChapterStudy chapter={chapter} reference={reference} worldNarratedLabel={chapter.eventiNarrati || libro.mondoDelTesto} biblicalText={biblicalText} />
    </main>
  </AppShell>;
}
