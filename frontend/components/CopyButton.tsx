import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";


interface CopyButtonProps {
    text: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
    text,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

    return (
        <button
            className="flex gap-1 items-center py-1 px-2 text-sm font-medium rounded-sm cursor-pointer bg-citrus border-border border-1"
            onClick={handleCopy}
            >
            {copied ? <CopyCheck size={14}/> : <Copy size={14}/>}
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}
