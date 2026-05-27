import { DevJobsChat } from "@/components/DevJobsChat";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">DevJobs AI</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Converse com nosso assistente virtual e encontre a vaga perfeita.
          </p>
        </div>
        <DevJobsChat />
      </div>
    </div>
  );
}
