export default function AdminToast({ toast }) {
  if (!toast) return null;
  const ok = toast.tipo === 'ok';
  return (
    <div
      className={`admin-toast fixed inset-x-4 bottom-5 z-[230] mx-auto max-w-sm rounded-2xl px-5 py-3.5 text-center text-sm font-semibold shadow-2xl sm:inset-x-auto sm:right-6 ${
        ok ? 'bg-forest text-white' : 'bg-berry text-white'
      }`}
      role="status"
    >
      {toast.texto}
    </div>
  );
}
