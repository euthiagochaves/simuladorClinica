import { AtendimentoClient } from "./atendimento-client";

interface PageProps {
  params: Promise<{ sessaoId: string }>;
}

export default async function AtendimentoPage({ params }: PageProps) {
  const { sessaoId } = await params;
  return <AtendimentoClient sessaoId={parseInt(sessaoId, 10)} />;
}
