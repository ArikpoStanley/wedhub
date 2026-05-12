import { Suspense } from "react";
import Login from "@/views/login";

function LoginFallback() {
  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center text-[#800000]">
      Loading…
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <Login />
    </Suspense>
  );
}
