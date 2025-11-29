export default function ReadOnlyField({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-white border p-3 rounded-lg">
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-medium text-gray-800">{value}</div>
      </div>
    </div>
  );
}
