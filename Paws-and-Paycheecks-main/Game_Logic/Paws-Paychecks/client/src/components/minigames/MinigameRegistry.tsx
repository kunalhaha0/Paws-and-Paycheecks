import { JobType } from "@shared/schema";

import { TypingMinigame } from "./office/TypingMinigame";
import { EmailSortMinigame } from "./office/EmailSortMinigame";
import { FilingMinigame } from "./office/FilingMinigame";
import { ScheduleMinigame } from "./office/ScheduleMinigame";
import { DataEntryMinigame } from "./office/DataEntryMinigame";
import { MemoMinigame } from "./office/MemoMinigame";
import { PhoneMinigame } from "./office/PhoneMinigame";
import { SpreadsheetMinigame } from "./office/SpreadsheetMinigame";
import { MeetingMinigame } from "./office/MeetingMinigame";
import { CopyEditMinigame } from "./office/CopyEditMinigame";
import { PasswordMinigame } from "./office/PasswordMinigame";
import { InboxMinigame } from "./office/InboxMinigame";

import { SortingMinigame } from "./chef/SortingMinigame";
import { ChoppingMinigame } from "./chef/ChoppingMinigame";
import { RecipeMinigame } from "./chef/RecipeMinigame";
import { OrderMinigame } from "./chef/OrderMinigame";
import { TimingMinigame } from "./chef/TimingMinigame";
import { TasteMinigame } from "./chef/TasteMinigame";
import { PlatingMinigame } from "./chef/PlatingMinigame";
import { InventoryMinigame } from "./chef/InventoryMinigame";
import { MixingMinigame } from "./chef/MixingMinigame";
import { TemperatureMinigame } from "./chef/TemperatureMinigame";
import { MenuMinigame } from "./chef/MenuMinigame";
import { CleanupMinigame } from "./chef/CleanupMinigame";

import { PuzzleMinigame } from "./engineer/PuzzleMinigame";
import { WiringMinigame } from "./engineer/WiringMinigame";
import { GearMinigame } from "./engineer/GearMinigame";
import { CodeMinigame } from "./engineer/CodeMinigame";
import { BlueprintMinigame } from "./engineer/BlueprintMinigame";
import { MeasureMinigame } from "./engineer/MeasureMinigame";
import { DebugMinigame } from "./engineer/DebugMinigame";
import { BuildMinigame } from "./engineer/BuildMinigame";
import { PipeMinigame } from "./engineer/PipeMinigame";
import { CalculationMinigame } from "./engineer/CalculationMinigame";
import { SequenceMinigame } from "./engineer/SequenceMinigame";
import { OptimizeMinigame } from "./engineer/OptimizeMinigame";

import { MatchingMinigame } from "./teacher/MatchingMinigame";
import { SpellingMinigame } from "./teacher/SpellingMinigame";
import { GradingMinigame } from "./teacher/GradingMinigame";
import { FlashcardMinigame } from "./teacher/FlashcardMinigame";
import { AttendanceMinigame } from "./teacher/AttendanceMinigame";
import { QuizMakerMinigame } from "./teacher/QuizMakerMinigame";
import { ReadingMinigame } from "./teacher/ReadingMinigame";
import { MathMinigame } from "./teacher/MathMinigame";
import { HistoryMinigame } from "./teacher/HistoryMinigame";
import { ScienceMinigame } from "./teacher/ScienceMinigame";
import { GeographyMinigame } from "./teacher/GeographyMinigame";
import { LanguageMinigame } from "./teacher/LanguageMinigame";

import { ColorMinigame } from "./artist/ColorMinigame";
import { SketchMinigame } from "./artist/SketchMinigame";
import { PatternMinigame } from "./artist/PatternMinigame";
import { PaletteMinigame } from "./artist/PaletteMinigame";
import { SymmetryMinigame } from "./artist/SymmetryMinigame";
import { ShapeMinigame } from "./artist/ShapeMinigame";
import { GalleryMinigame } from "./artist/GalleryMinigame";
import { MosaicMinigame } from "./artist/MosaicMinigame";
import { CompositionMinigame } from "./artist/CompositionMinigame";
import { GradientMinigame } from "./artist/GradientMinigame";
import { FrameMinigame } from "./artist/FrameMinigame";
import { StyleMinigame } from "./artist/StyleMinigame";

export type MinigameComponent = React.ComponentType<{ onComplete: (score: number) => void }>;

export interface MinigameInfo {
  id: string;
  name: string;
  component: MinigameComponent;
}

export const MINIGAMES: Record<JobType, MinigameInfo[]> = {
  office: [
    { id: "office-typing", name: "Speed Typing", component: TypingMinigame },
    { id: "office-email", name: "Email Sorting", component: EmailSortMinigame },
    { id: "office-filing", name: "File Organization", component: FilingMinigame },
    { id: "office-schedule", name: "Schedule Management", component: ScheduleMinigame },
    { id: "office-data", name: "Data Entry", component: DataEntryMinigame },
    { id: "office-memo", name: "Memo Writing", component: MemoMinigame },
    { id: "office-phone", name: "Phone Directory", component: PhoneMinigame },
    { id: "office-spreadsheet", name: "Spreadsheet Math", component: SpreadsheetMinigame },
    { id: "office-meeting", name: "Meeting Notes", component: MeetingMinigame },
    { id: "office-copyedit", name: "Proofreading", component: CopyEditMinigame },
    { id: "office-password", name: "Password Match", component: PasswordMinigame },
    { id: "office-inbox", name: "Inbox Zero", component: InboxMinigame },
  ],
  chef: [
    { id: "chef-sorting", name: "Ingredient Sorting", component: SortingMinigame },
    { id: "chef-chopping", name: "Speed Chopping", component: ChoppingMinigame },
    { id: "chef-recipe", name: "Recipe Memory", component: RecipeMinigame },
    { id: "chef-order", name: "Order Rush", component: OrderMinigame },
    { id: "chef-timing", name: "Perfect Timing", component: TimingMinigame },
    { id: "chef-taste", name: "Taste Test", component: TasteMinigame },
    { id: "chef-plating", name: "Food Plating", component: PlatingMinigame },
    { id: "chef-inventory", name: "Kitchen Inventory", component: InventoryMinigame },
    { id: "chef-mixing", name: "Mixing Bowl", component: MixingMinigame },
    { id: "chef-temperature", name: "Temperature Control", component: TemperatureMinigame },
    { id: "chef-menu", name: "Menu Matching", component: MenuMinigame },
    { id: "chef-cleanup", name: "Kitchen Cleanup", component: CleanupMinigame },
  ],
  engineer: [
    { id: "engineer-puzzle", name: "Circuit Connect", component: PuzzleMinigame },
    { id: "engineer-wiring", name: "Wire Colors", component: WiringMinigame },
    { id: "engineer-gear", name: "Gear Assembly", component: GearMinigame },
    { id: "engineer-code", name: "Code Completion", component: CodeMinigame },
    { id: "engineer-blueprint", name: "Blueprint Reading", component: BlueprintMinigame },
    { id: "engineer-measure", name: "Precise Measurement", component: MeasureMinigame },
    { id: "engineer-debug", name: "Bug Finding", component: DebugMinigame },
    { id: "engineer-build", name: "Assembly Line", component: BuildMinigame },
    { id: "engineer-pipe", name: "Pipe Fitting", component: PipeMinigame },
    { id: "engineer-calc", name: "Quick Calculation", component: CalculationMinigame },
    { id: "engineer-sequence", name: "Pattern Sequence", component: SequenceMinigame },
    { id: "engineer-optimize", name: "Optimization", component: OptimizeMinigame },
  ],
  teacher: [
    { id: "teacher-matching", name: "Quick Grading", component: MatchingMinigame },
    { id: "teacher-spelling", name: "Spelling Bee", component: SpellingMinigame },
    { id: "teacher-grading", name: "Grade Papers", component: GradingMinigame },
    { id: "teacher-flashcard", name: "Flashcard Drill", component: FlashcardMinigame },
    { id: "teacher-attendance", name: "Roll Call", component: AttendanceMinigame },
    { id: "teacher-quizmaker", name: "Quiz Builder", component: QuizMakerMinigame },
    { id: "teacher-reading", name: "Reading Check", component: ReadingMinigame },
    { id: "teacher-math", name: "Math Problems", component: MathMinigame },
    { id: "teacher-history", name: "History Timeline", component: HistoryMinigame },
    { id: "teacher-science", name: "Science Lab", component: ScienceMinigame },
    { id: "teacher-geography", name: "Map Quiz", component: GeographyMinigame },
    { id: "teacher-language", name: "Word Match", component: LanguageMinigame },
  ],
  artist: [
    { id: "artist-color", name: "Color Match", component: ColorMinigame },
    { id: "artist-sketch", name: "Quick Sketch", component: SketchMinigame },
    { id: "artist-pattern", name: "Pattern Copy", component: PatternMinigame },
    { id: "artist-palette", name: "Palette Builder", component: PaletteMinigame },
    { id: "artist-symmetry", name: "Mirror Image", component: SymmetryMinigame },
    { id: "artist-shape", name: "Shape Builder", component: ShapeMinigame },
    { id: "artist-gallery", name: "Art Sorting", component: GalleryMinigame },
    { id: "artist-mosaic", name: "Mosaic Puzzle", component: MosaicMinigame },
    { id: "artist-composition", name: "Composition", component: CompositionMinigame },
    { id: "artist-gradient", name: "Gradient Match", component: GradientMinigame },
    { id: "artist-frame", name: "Frame Selection", component: FrameMinigame },
    { id: "artist-style", name: "Art Style Quiz", component: StyleMinigame },
  ],
};

export function getMinigameForWeek(jobType: JobType, week: number, seed?: string): MinigameInfo {
  const games = MINIGAMES[jobType];
  const seedValue = seed ? parseInt(seed, 36) : Date.now();
  const shuffled = [...games].sort((a, b) => {
    const hashA = (seedValue * (games.indexOf(a) + 1) * 31) % 1000;
    const hashB = (seedValue * (games.indexOf(b) + 1) * 31) % 1000;
    return hashA - hashB;
  });
  return shuffled[(week - 1) % shuffled.length];
}
