import GameSetup from '@/components/game-setup';

export default function HomePage() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      <GameSetup />
    </main>
  );
}
