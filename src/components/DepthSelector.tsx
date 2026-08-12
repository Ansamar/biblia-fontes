'use client';

import { useState } from 'react';

export type StudyDepth = 'essential' | 'study' | 'critical';

export default function DepthSelector({ onChange }: { onChange?: (value: StudyDepth) => void }) {
  const [active, setActive] = useState<StudyDepth>('study');
  const items: {id: StudyDepth; label: string; help: string}[] = [
    {id:'essential', label:'Essenziale', help:'Che cosa sto leggendo?'},
    {id:'study', label:'Studio', help:'Come devo studiarlo?'},
    {id:'critical', label:'Critica', help:'Come si ricostruisce la sua formazione?'},
  ];
  return <div className="flex flex-wrap gap-2" role="group" aria-label="Livello di lettura">{items.map((item) => <button key={item.id} type="button" aria-pressed={active === item.id} title={item.help} onClick={() => {setActive(item.id); onChange?.(item.id);}} className={`rounded-full border px-4 py-2 text-sm transition ${active === item.id ? 'border-ink bg-ink text-papyrus' : 'border-papyrus-line text-ink-soft hover:border-bronze hover:text-bronze'}`}>{item.label}</button>)}</div>;
}
