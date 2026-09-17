'use client'

interface AnswerOptionProps {
  name: string
  optionKey: string
  text: string
  selected: boolean
  onSelect: (optionKey: string) => void
}

export function AnswerOption({ name, optionKey, text, selected, onSelect }: AnswerOptionProps) {
  return (
    <label
      className={`flex min-h-[3.25rem] cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-all ${
        selected
          ? 'border-rose-300 bg-blush-50 shadow-soft'
          : 'border-charcoal-100 bg-cream-50 hover:border-rose-200 hover:bg-blush-50/50'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={optionKey}
        checked={selected}
        onChange={() => onSelect(optionKey)}
        className="sr-only"
      />
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? 'border-rose-400 bg-rose-400' : 'border-charcoal-300'
        }`}
        aria-hidden="true"
      >
        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
      <span className="text-base leading-snug text-charcoal-700">{text}</span>
    </label>
  )
}
