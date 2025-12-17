import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";

interface RPESelectorProps {
  value: number | null;
  onChange: (rpe: number) => void;
}

export function RPESelector({ value, onChange }: RPESelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
        <Zap className="w-4 h-4" />
        RPE (Esfuerzo Percibido)
      </Label>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((rpe) => (
          <Button
            key={rpe}
            size="sm"
            variant={value === rpe ? "default" : "outline"}
            onClick={() => onChange(rpe)}
            className={`${
              value === rpe
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : ""
            }`}
          >
            {rpe}
          </Button>
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        1 = Muy fácil | 10 = Máximo esfuerzo
      </p>
    </div>
  );
}
