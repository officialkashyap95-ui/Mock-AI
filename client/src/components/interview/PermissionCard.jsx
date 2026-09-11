import { CheckCircle, XCircle } from "lucide-react";

function PermissionCard({ title, ready }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex justify-between items-center">

      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-slate-400">
          Device Permission
        </p>
      </div>

      <div
        className={`flex items-center gap-2 ${
          ready ? "text-green-400" : "text-red-400"
        }`}
      >
        {ready ? <CheckCircle size={22} /> : <XCircle size={22} />}

        {ready ? "Ready" : "Not Allowed"}
      </div>

    </div>
  );
}

export default PermissionCard;