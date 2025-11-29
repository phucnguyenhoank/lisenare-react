export default function EditableSelectField({
  label,
  value,
  options,
  editing,
  onEdit,
  onCancel,
  onSave,
  formValue,
  setFormValue,
}) {
  return (
    <div className="flex items-center justify-between bg-white border p-3 rounded-lg">
      <div>
        <div className="text-sm text-gray-500">{label}</div>

        {editing ? (
          <select
            className="mt-1 w-full border rounded px-2 py-1 text-gray-700"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            autoFocus
          >
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="font-medium text-gray-800">
            {options.find((o) => o.id === value)?.label ?? "Not set"}
          </div>
        )}
      </div>

      <div className="flex space-x-2 ml-4">
        {editing ? (
          <>
            <button
              onClick={onSave}
              className="px-3 py-1 bg-black text-white rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-gray-100 border rounded text-sm"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
