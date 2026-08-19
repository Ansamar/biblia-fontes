import { client } from '../sanity/client';

const query = `*[_type in ["libro","capitolo"] && (titolo match $term || descrizione match $term || sintesi match $term)] | order(_type asc, titolo asc)[0...80]{
  _id,_type,titolo,numero,"libroId":libro._ref,sintesi
}`;

export async function searchCorpus(term: string) {
  const value = term.trim();
  if (!value) return [];
  const rows = await client.fetch(query, {term: `*${value}*`});
  return Array.isArray(rows) ? rows.map((row: any) => ({
    id: row._id,
    type: row._type as 'libro' | 'capitolo',
    title: row.titolo || row._id,
    number: row.numero,
    bookSlug: row._type === 'libro' ? String(row._id).replace(/^libro-/, '') : String(row.libroId || '').replace(/^libro-/, ''),
    summary: typeof row.sintesi === 'string' ? row.sintesi : '',
  })) : [];
}

export type CorpusSearchResult = Awaited<ReturnType<typeof searchCorpus>>[number];
