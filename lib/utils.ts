import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatarTempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
}

export function formatarData(dataString: string): string {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTriagemColor(triagem: string): string {
  const cores: Record<string, string> = {
    vermelho: "bg-red-500",
    laranja: "bg-orange-500",
    amarelo: "bg-yellow-500",
    verde: "bg-green-500",
    azul: "bg-blue-500",
  };
  return cores[triagem.toLowerCase()] || "bg-gray-500";
}

export function getTriagemLabel(triagem: string): string {
  const labels: Record<string, string> = {
    vermelho: "Emergência",
    laranja: "Muito Urgente",
    amarelo: "Urgente",
    verde: "Pouco Urgente",
    azul: "Não Urgente",
  };
  return labels[triagem.toLowerCase()] || triagem;
}
