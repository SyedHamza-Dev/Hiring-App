"use client";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Quote,
  Search,
  Sparkles,
  Trash2,
  Upload,
  User2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BiSolidFilePdf } from "react-icons/bi";
import styles from "../styles/scrollbar.module.css";
import { Suspense } from "react";

interface Job {
  id: number;
  title: string;
  location: string;
  jobType: string;
  skills: string[];
  about?: string;
  responsibilities?: string;
  qualifications?: string;
}

interface CV {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  text?: string;
}

interface CandidateResult {
  id: string;
  filename: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  email: string | null;
  phone: string | null;
  topSnippet: string;
  error?: string;
}

// Turns the raw score + skill lists into a plain-English verdict instead of
// a bare number, so a recruiter can tell at a glance *why* a CV scored the
// way it did.
function buildVerdict(candidate: CandidateResult, jobTitle: string): string {
  const { score, matchedSkills, missingSkills } = candidate;
  const matched = matchedSkills.join(", ");
  const missing = missingSkills.join(", ");

  if (score >= 70) {
    return missingSkills.length === 0
      ? `Strong match for ${jobTitle}. The resume covers every required skill: ${matched}.`
      : `Strong match for ${jobTitle}. The resume shows ${matched}, though it doesn't mention ${missing}.`;
  }

  if (score >= 45) {
    return matchedSkills.length > 0
      ? `Partial match for ${jobTitle}. It shows ${matched}, but doesn't mention ${missing} — worth a closer look rather than an automatic pass.`
      : `Partial match for ${jobTitle} based on overall wording, but none of the required skills (${missing}) appear directly in the resume.`;
  }

  return missingSkills.length > 0
    ? `Weak match for ${jobTitle}. The resume doesn't mention ${missing}, and its overall content reads as unrelated to this role.`
    : `Weak match for ${jobTitle} — the resume's content is not semantically close to this job description.`;
}

const ScanCV = () => {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
          <span>Loading CV Scanner...</span>
        </div>
      }
    >
      <ScanCVContent />
    </Suspense>
  );
};

const ScanCVContent = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCVs, setSelectedCVs] = useState<CV[]>([]);
  const [showJobCard, setShowJobCard] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateResult | null>(null);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [uploadedCVs, setUploadedCVs] = useState<CV[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [results, setResults] = useState<CandidateResult[]>([]);

  const statusMessages = [
    "Reading resume text...",
    "Embedding job description...",
    "Embedding candidate resumes...",
    "Computing semantic similarity...",
    "Ranking candidates...",
  ];

  useEffect(() => {
    setIsClient(true);

    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get("jobId");

    try {
      const savedJobs = JSON.parse(
        sessionStorage.getItem("jobs") || "[]"
      ) as Job[];

      if (jobId) {
        const foundJob = savedJobs.find((job) => job.id === parseInt(jobId));
        setSelectedJob(foundJob || savedJobs[0] || null);
      } else {
        setSelectedJob(savedJobs[0] || null);
      }

      // Only real, uploaded CVs are selectable — no placeholder/dummy resumes
      const savedCVs = JSON.parse(
        sessionStorage.getItem("uploadedCVs") || "[]"
      ) as CV[];
      setUploadedCVs(savedCVs);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, []);

  useEffect(() => {
    if (analyzing && progress < 95) {
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % statusMessages.length
        );
      }, 900);

      return () => clearInterval(messageInterval);
    }
  }, [analyzing, progress, statusMessages.length]);

  const filteredCVs = uploadedCVs.filter((cv) =>
    cv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCVSelection = (cv: CV, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    setSelectedCVs((prev) => {
      const isSelected = prev.some((selected) => selected.id === cv.id);
      return isSelected
        ? prev.filter((selected) => selected.id !== cv.id)
        : [...prev, cv];
    });
  };

  const handleRemoveCV = (cvId: string) => {
    setSelectedCVs((prev) => prev.filter((cv) => cv.id !== cvId));
  };

  const handleAddCVs = () => {
    setShowJobCard(false);
    setIsModalOpen(false);
  };

  const handleClearAll = () => {
    setSelectedCVs([]);
    setShowJobCard(true);
    setAnalyzed(false);
    setResults([]);
  };

  const handleOpenCVModal = () => {
    setIsModalOpen(true);
  };

  const startAnalysis = async () => {
    if (!selectedJob) return;

    setAnalyzing(true);
    setAnalyzeError(null);
    setProgress(10);

    const jobText = [
      selectedJob.title,
      selectedJob.about,
      selectedJob.responsibilities,
      selectedJob.qualifications,
      selectedJob.skills?.join(", "),
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const progressTimer = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 8 : p));
      }, 400);

      const response = await fetch("/api/analyze-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobText,
          jobSkills: selectedJob.skills || [],
          candidates: selectedCVs.map((cv) => ({
            id: cv.id,
            filename: cv.name,
            text: cv.text || "",
          })),
        }),
      });

      clearInterval(progressTimer);

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || "Analysis failed");
      }

      const data = await response.json();
      setResults(data.results as CandidateResult[]);
      setProgress(100);
      setAnalyzing(false);
      setAnalyzed(true);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalyzeError(
        error instanceof Error ? error.message : "Analysis failed"
      );
      setAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    setShowJobCard(true);
    setAnalyzed(false);
    setSelectedCVs([]);
    setResults([]);
  };

  const openCandidateDetails = (candidate: CandidateResult) => {
    setSelectedCandidate(candidate);
    setCandidateModalOpen(true);
  };

  const scoreBadgeClass = (score: number) => {
    if (score >= 70) return "bg-green-500 text-white";
    if (score >= 45) return "bg-amber-500 text-white";
    return "bg-red-500 text-white";
  };

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span>Loading CV Scanner...</span>
      </div>
    );
  }

  if (!selectedJob) return <div className="p-6">Loading...</div>;

  const currentStep = showJobCard ? 1 : analyzed ? 3 : 2;
  const steps = [
    { n: 1, label: "Job description", icon: Briefcase },
    { n: 2, label: "Select CVs", icon: Upload },
    { n: 3, label: "AI results", icon: Sparkles },
  ];

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6">
      {/* Step indicator ties the job → CVs → results flow together visually */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {steps.map((step, i) => {
          const done = currentStep > step.n;
          const active = currentStep === step.n;
          return (
            <div key={step.n} className="flex items-center shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : done
                    ? "bg-blue-50 text-blue-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <step.icon className="w-3.5 h-3.5" />
                {step.label}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-6 sm:w-10 h-px mx-1 ${
                    done ? "bg-blue-300" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {showJobCard ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 pl-6">
                CV Scanner
              </h2>
            </div>

            <Card className="p-4 md:p-6 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {selectedJob.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{selectedJob.location}</span>
                      <span className="text-sm">
                        • {selectedJob.jobType}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedJob.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full md:w-auto"
                >
                  <Upload className="w-5 h-5" />
                  Add CVs
                </Button>
              </div>
            </Card>

            {uploadedCVs.length === 0 && (
              <Card className="p-6 border-dashed">
                <div className="text-center text-sm text-gray-500">
                  No CVs uploaded yet. Go to{" "}
                  <span className="font-medium">Upload CVs</span> in the
                  sidebar to add real PDF resumes — the scanner only works on
                  actual uploaded documents, not sample data.
                </div>
              </Card>
            )}
          </motion.div>
        ) : analyzing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="text-lg font-semibold text-blue-600">
                    {progress}%
                  </span>
                </div>

                <Progress value={progress} />

                <p className="text-sm text-muted-foreground">
                  {statusMessages[currentMessageIndex]}
                </p>
                <p className="text-xs text-gray-400">
                  Embeddings run with sentence-transformers/all-MiniLM-L6-v2
                  — first run may take longer while the model loads.
                </p>
              </div>
            </Card>
          </motion.div>
        ) : analyzed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg md:text-xl font-semibold">
                Candidates for {selectedJob.title}
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  className="gap-2 text-sm flex-1 sm:flex-auto"
                >
                  <Upload className="w-4 h-4" /> Scan New CVs
                </Button>
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  className="gap-2 text-red-600 hover:text-red-700 text-sm flex-1 sm:flex-auto"
                >
                  <Trash2 className="w-4 h-4" /> Clear All
                </Button>
              </div>
            </div>

            <Card>
              <div className="p-3 md:p-4 border-b">
                <h3 className="flex items-center gap-2 font-semibold text-sm md:text-base">
                  <Sparkles className="text-blue-500 w-4 h-4 md:w-5 md:h-5" />
                  Ranked by semantic match ({results.length})
                </h3>
              </div>
              <ScrollArea
                className={`h-[420px] p-3 md:p-4 ${styles.customScrollbar}`}
              >
                {results.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 md:p-4 border rounded-lg mb-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openCandidateDetails(candidate)}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            <User2 className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-sm md:text-base flex items-center gap-2">
                            <BiSolidFilePdf className="text-red-500" />
                            {candidate.filename}
                          </h3>
                          {candidate.email && (
                            <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {candidate.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={scoreBadgeClass(candidate.score)}>
                        {candidate.score}% match
                      </Badge>
                    </div>

                    {candidate.error ? (
                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <AlertTriangle className="h-3 w-3" />
                        {candidate.error}
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {buildVerdict(candidate, selectedJob.title)}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                        {candidate.matchedSkills.map((skill) => (
                          <Badge key={skill} className="text-xs bg-blue-500">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.missingSkills.slice(0, 4).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-xs text-gray-400"
                          >
                            {skill}
                          </Badge>
                        ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </ScrollArea>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg md:text-xl font-semibold">
                Selected CVs for {selectedJob.title}
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleOpenCVModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 flex-1 sm:flex-auto"
                >
                  <Upload className="w-4 h-4" />
                  Add More CVs
                </Button>
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  className="gap-2 text-red-600 hover:text-red-700 flex-1 sm:flex-auto"
                >
                  <Trash2 className="w-4 h-4" /> Clear All
                </Button>
              </div>
            </div>

            {analyzeError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <XCircle className="h-4 w-4 shrink-0" />
                {analyzeError}
              </div>
            )}

            <Card className="overflow-hidden">
              <div className="p-3 bg-gray-50 border-b">
                <h3 className="text-sm font-medium text-gray-700">
                  Selected CV Files ({selectedCVs.length})
                </h3>
              </div>

              <div
                className={`p-3 max-h-[400px] overflow-y-auto ${styles.customScrollbar}`}
              >
                {selectedCVs.length > 0 ? (
                  <AnimatePresence>
                    {selectedCVs.map((cv, index) => (
                      <motion.div
                        key={cv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } border mb-2 hover:border-blue-200 transition-all`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-red-50 p-2 rounded-lg">
                            <BiSolidFilePdf className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{cv.name}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1 gap-3">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" /> {cv.size}
                              </span>
                              {!cv.text && (
                                <span className="flex items-center gap-1 text-amber-600">
                                  <AlertTriangle className="w-3 h-3" /> No
                                  text extracted
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCV(cv.id);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      No CVs selected yet
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Click &quot;Add More CVs&quot; to select files
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {selectedCVs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <Button
                  onClick={startAnalysis}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Scan {selectedCVs.length} CV
                  {selectedCVs.length > 1 ? "s" : ""}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CV Selection Modal — only real, uploaded CVs are listed */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Select CVs
            </DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search CVs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>

          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-2">
              {filteredCVs.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-6">
                  No uploaded CVs found. Upload PDF resumes from the{" "}
                  <span className="font-medium">Upload CVs</span> page first.
                </p>
              )}
              {filteredCVs.map((cv) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer
                  ${
                    selectedCVs.some((selected) => selected.id === cv.id)
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleCVSelection(cv)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Checkbox
                      id={`cv-${cv.id}`}
                      checked={selectedCVs.some(
                        (selected) => selected.id === cv.id
                      )}
                      onCheckedChange={() => {}}
                      onClick={(e) => handleCVSelection(cv, e)}
                    />

                    <BiSolidFilePdf className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="font-medium text-sm text-gray-700">
                        {cv.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {cv.size} • {cv.uploadDate}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCVs}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={selectedCVs.length === 0}
            >
              Add {selectedCVs.length} CV{selectedCVs.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Candidate Details Modal — built entirely from real analysis output */}
      <Dialog open={candidateModalOpen} onOpenChange={setCandidateModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCandidate.filename}</DialogTitle>
              </DialogHeader>

              <Card className="shadow-md border">
                <div className="p-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        <User2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      {selectedCandidate.email && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-4 w-4 text-blue-500" />
                          {selectedCandidate.email}
                        </p>
                      )}
                      {selectedCandidate.phone && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="h-4 w-4 text-blue-500" />
                          {selectedCandidate.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className={scoreBadgeClass(selectedCandidate.score)}>
                    {selectedCandidate.score}% match
                  </Badge>
                </div>
              </Card>

              <div className="space-y-3 mt-3">
                <Card className="shadow-sm border">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      Match Analysis
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      {buildVerdict(selectedCandidate, selectedJob.title)}
                    </p>
                    <details className="mb-3 group">
                      <summary className="text-xs text-blue-600 cursor-pointer select-none w-fit">
                        How is this score calculated?
                      </summary>
                      <p className="text-xs text-gray-500 mt-2">
                        The job description and this resume are both
                        embedded with{" "}
                        <code>sentence-transformers/all-MiniLM-L6-v2</code>{" "}
                        and compared with cosine similarity. It&apos;s a
                        relative relevance signal for ranking candidates, not
                        a calibrated pass/fail probability.
                      </p>
                    </details>

                    {selectedCandidate.matchedSkills.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Skills found in resume
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedCandidate.matchedSkills.map((skill) => (
                            <Badge key={skill} className="bg-blue-500">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedCandidate.missingSkills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-500" />
                          Not found in resume
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedCandidate.missingSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-gray-500"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedCandidate.topSnippet && (
                  <Card className="shadow-sm border bg-blue-50">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <Quote className="h-4 w-4 text-blue-600" />
                        Most relevant line from the resume
                      </h3>
                      <p className="text-sm text-muted-foreground italic">
                        &quot;{selectedCandidate.topSnippet}&quot;
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-3 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setCandidateModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ScanCVPage = () => {
  return (
    <LayoutWrapper>
      <ScanCV />
    </LayoutWrapper>
  );
};

export default ScanCVPage;
