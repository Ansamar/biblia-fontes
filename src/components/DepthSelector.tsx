'use client';

export type StudyDepth = 'essential' | 'study' | 'critical';

export default function DepthSelector({ value = 'study', onChange }: { value?: StudyDepth; onChange?: (value: StudyDepth) => void }) {
  const items: {id: StudyDepth; label: string; help: string}[] = [
    {id:'essential', label:'Essenziale', help:'Che cosa sto leggendo?'},
    {id:'study', label:'Studio', help:'Come devo studiarlo?'},
    {id:'critical', label:'Critica', help:'Come si ricostruisce la sua formazione?'},
  ];

  return <div className="flex flex-wrap gap-2" role="group" aria-label="Livello di lettura">{items.map((item) => <button key={item.id} type="button" aria-pressed={value === item.id} title={item.help} onClick={() => onChange?.(item.id)} className={`min-h-11 rounded-full border px-4 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze ${value === item.id ? 'border-ink bg-ink text-papyrus' : 'border-papyrus-line text-ink-soft hover:border-bronze hover:text-bronze'}`}>{item.label}</button>)}</div>;
}
