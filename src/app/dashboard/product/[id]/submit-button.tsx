'use client'

import { useFormStatus } from 'react-dom'
import { Save, Loader2 } from 'lucide-react'

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Guardar Cambios
        </button>
    )
}
