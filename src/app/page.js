import SnakeGrid from "@/components/SnakeGrid";

export default function Home() {
  return (
    <>
      <main className="flex flex-col min-h-screen p-4 justify-center items-center">
      <div className="text-3xl text-green-500 font-bold">
        Snake Game
      </div>
      <SnakeGrid />
      </main>
    </>
  );
}
