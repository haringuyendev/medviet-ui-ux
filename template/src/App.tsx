import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ServerError from "@/pages/ServerError";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ServerError}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster>
            <BrowserRouter>
              {/* URL state for filters, tabs and pagination (nuqs), as in the turbo-web apps */}
              <NuqsAdapter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* Add new routes above the catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </NuqsAdapter>
            </BrowserRouter>
          </Toaster>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
