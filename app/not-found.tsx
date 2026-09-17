import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-[120px] leading-none select-none">🎮</div>
      <h1 className="font-display text-6xl font-extrabold tracking-tight">
        <span className="gaming-gradient-text">GAME OVER</span>
      </h1>
      <p className="mt-4 text-xl font-display font-bold text-text-primary">LEVEL NOT FOUND</p>
      <p className="mt-3 max-w-md text-sm text-text-muted leading-relaxed">
        The page you are looking for does not exist or has been moved.
        Better luck next time, player.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="gold" size="lg">
          <RotateCcw className="h-5 w-5" />
          TRY AGAIN
        </Button>
      </Link>
    </div>
  );
}
