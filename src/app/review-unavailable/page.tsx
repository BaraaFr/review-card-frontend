import {
    CircleOff,
  } from "lucide-react";
  
  export default function ReviewUnavailablePage() {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted">
            <CircleOff className="size-7 text-muted-foreground" />
          </div>
  
          <p className="mt-6 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            ValYou
          </p>
  
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Review link temporarily unavailable
          </h1>
  
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            This review link is currently unavailable.
            Please try again later.
          </p>
  
          <p className="mt-8 text-xs text-muted-foreground">
            Powered by ValYou
          </p>
        </div>
      </main>
    );
  }