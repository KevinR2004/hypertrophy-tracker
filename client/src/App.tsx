import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import WorkoutPlan from "./pages/WorkoutPlan";
import WorkoutDay from "./pages/WorkoutDay";
import Progress from "./pages/Progress";
import Supplements from "./pages/Supplements";
import SupplementReminders from "./pages/SupplementReminders";
import Meals from "./pages/Meals";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={WorkoutPlan} />
      <Route path={"/workout/:dayId"} component={WorkoutDay} />
      <Route path={"/progress"} component={Progress} />
       <Route path="/supplements" component={Supplements} />
      <Route path="/reminders" component={SupplementReminders} />
      <Route path={"/meals"} component={Meals} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
