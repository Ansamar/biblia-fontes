import fs from 'node:fs/promises';

const BASE_URL = 'https://biblia-fontes.vercel.app';

const libri = [
  ['genesi', 'GENESI'],
  ['esodo', 'ESODO'],
  ['levitico', 'LEVITICO'],
  ['numeri', 'NUMERI'],
  ['deuteronomio', 'DEUTERONOMIO'],
  ['giosue', 'GIOSUÈ'],
  ['giudici', 'GIUDICI'],
  ['rut', 'RUT'],
  ['1-samuele', '1 SAMUELE'],
  ['2-samuele', '2 SAMUELE'],
  ['1-re', '1 RE'],
  ['2-re', '2 RE'],
  ['1-cronache', '1 CRONACHE'],
  ['2-cronache', '2 CRONACHE'],
  ['esdra', 'ESDRA'],
  ['neemia', 'NEEMIA'],
  ['tobia', 'TOBIA'],
  ['giuditta', 'GIUDITTA'],
  ['ester', 'ESTER'],
  ['1-maccabei', '1 MACCABEI'],
  ['2-maccabei', '2 MACCABEI'],
  ['giobbe', 'GIOBBE'],
  ['salmi', 'SALMI'],
  ['proverbi', 'PROVERBI'],
  ['qoelet', 'QOÈLET'],
  ['cantico-dei-cantici', 'CANTICO DEI CANTICI'],
  ['sapienza', 'SAPIENZA'],
  ['siracide', 'SIRACIDE'],
  ['isaia', 'ISAIA'],
  ['geremia', 'GEREMIA'],
  ['lamentazioni', 'LAMENTAZIONI'],
  ['baruc', 'BARUC'],
  ['ezechiele', 'EZECHIELE'],
  ['daniele', 'DANIELE'],
  ['osea', 'OSEA'],
  ['gioele', 'GIOELE'],
  ['amos', 'AMOS'],
  ['abdia', 'ABDIA'],
  ['giona', 'GIONA'],
  ['michea', 'MICHEA'],
  ['naum', 'NAUM'],
  ['abacuc', 'ABACUC'],
  ['sofonia', 'SOFONIA'],
  ['aggeo', 'AGGEO'],
  ['zaccaria', 'ZACCARIA'],
  ['malachia', 'MALACHIA'],
  ['matteo', 'MATTEO'],
  ['marco', 'MARCO'],
  ['luca', 'LUCA'],
  ['giovanni', 'GIOVANNI'],
  ['atti', 'ATTI DEGLI APOSTOLI'],
  ['romani', 'ROMANI'],
  ['1-corinti', '1 CORINZI'],
  ['2-corinti', '2 CORINZI'],
  ['galati', 'GALATI'],
  ['efesini', 'EFESINI'],
  ['filippesi', 'FILIPPESI'],
  ['colossesi', 'COLOSSESI'],
  ['1-tessalonicesi', '1 TESSALONICESI'],
  ['2-tessalonicesi', '2 TESSALONICESI'],
  ['1-timoteo', '1 TIMOTEO'],
  ['2-timoteo', '2 TIMOTEO'],
  ['tito', 'TITO'],
  ['filemone', 'FILEMONE'],
  ['ebrei', 'EBREI'],
  ['giacomo', 'GIACOMO'],
  ['1-pietro', '1 PIETRO'],
  ['2-pietro', '2 PIETRO'],
  ['1-giovanni', '1 GIOVANNI'],
  ['2-giovanni', '2 GIOVANNI'],
  ['3-giovanni', '3 GIOVANNI'],
  ['giuda', 'GIUDA'],
  ['apocalisse', 'APOCALISSE'],
];

if (libri.length !== 73) {
  console.error(`ERRORE INTERNO: attesi 73 libri, trovati ${libri.length}`);
  process.exit(1);
}

function normalizeText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleUpperCase('it-IT');
}

async function controllaLibro(slug, titolo) {
  const url = `${BASE_URL}/bibbia/${slug}/1`;
  const risultato = {
    titolo,
    slug,
    url,
    status: null,
    redirected: false,
    finalUrl: null,
    okHttp: false,
    contieneTitolo: false,
    indicatoriReader: [],
    sembraReader: false,
    errore: null,
  };

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Biblia-Fontes-Production-Audit/1.0',
        'cache-control': 'no-cache',
      },
    });

    const html = await response.text();
    const testo = normalizeText(html);

    risultato.status = response.status;
    risultato.redirected = response.redirected;
    risultato.finalUrl = response.url;
    risultato.okHttp = response.status >= 200 && response.status < 400;
    risultato.contieneTitolo = testo.includes(titolo.toLocaleUpperCase('it-IT'));

    const possibiliIndicatori = [
      'CAPITOLO',
      'TESTO BIBLICO',
      'TESTO',
      'VERS',
      'LETTURA',
      'STUDIO',
      'SINTESI',
      'APPARATO',
      'CRONOLOGIA',
      'BIBLIOGRAFIA',
      'FONTI',
      'REDAZIONE',
    ];

    risultato.indicatoriReader = possibiliIndicatori.filter((indicatore) =>
      testo.includes(indicatore),
    );

    risultato.sembraReader =
      risultato.okHttp &&
      risultato.contieneTitolo &&
      risultato.indicatoriReader.length >= 2;
  } catch (error) {
    risultato.errore = error instanceof Error ? error.message : String(error);
  }

  return risultato;
}

console.log('AUDIT READER DI PRODUZIONE');
console.log(`Base URL: ${BASE_URL}`);
console.log(`Libri attesi: ${libri.length}`);
console.log('');

const risultati = [];

for (const [slug, titolo] of libri) {
  const risultato = await controllaLibro(slug, titolo);
  risultati.push(risultato);

  const simbolo = risultato.sembraReader ? '✓' : '✗';
  const status = risultato.status ?? 'ERR';

  console.log(
    `${simbolo} ${titolo.padEnd(24)} HTTP ${String(status).padEnd(3)} /bibbia/${slug}/1`,
  );
}

const anomalie = risultati.filter((risultato) => !risultato.sembraReader);
const readerOK = risultati.length - anomalie.length;

const riepilogo = {
  dataAudit: new Date().toISOString(),
  baseUrl: BASE_URL,
  libriAttesi: libri.length,
  libriControllati: risultati.length,
  readerOK,
  readerConAnomalie: anomalie.length,
  coperturaReaderPercento: Number(((readerOK / risultati.length) * 100).toFixed(2)),
};

console.log('');
console.log('RIEPILOGO');
console.log(JSON.stringify(riepilogo, null, 2));

if (anomalie.length > 0) {
  console.log('');
  console.log('ANOMALIE');
  console.log(
    JSON.stringify(
      anomalie.map((risultato) => ({
        titolo: risultato.titolo,
        slug: risultato.slug,
        url: risultato.url,
        status: risultato.status,
        redirected: risultato.redirected,
        finalUrl: risultato.finalUrl,
        okHttp: risultato.okHttp,
        contieneTitolo: risultato.contieneTitolo,
        indicatoriReader: risultato.indicatoriReader,
        sembraReader: risultato.sembraReader,
        errore: risultato.errore,
      })),
      null,
      2,
    ),
  );
}

const report = { riepilogo, anomalie, risultati };

await fs.writeFile(
  'audit-reader-production.json',
  JSON.stringify(report, null, 2),
  'utf8',
);

console.log('');
console.log('Report scritto in audit-reader-production.json');

process.exitCode = anomalie.length > 0 ? 1 : 0;
