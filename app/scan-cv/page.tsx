"use client";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Award,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  User2,
  X,
  XCircle,
  FilePlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BiSolidFilePdf } from "react-icons/bi";
import styles from "../styles/scrollbar.module.css";
import { Suspense } from 'react';


// Define types for our data structures
interface Job {
  id: number;
  title: string;
  location: string;
  jobType: string;
  skills: string[];
  experience: string;
  salary: string;
  company: string;
}

interface CV {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface Candidate {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  score: number;
  experience: string;
  currentRole: string;
  currentCompany: string;
  skills: string[];
  certifications: string[];
  education: string;
  university: string;
  github: string;
  linkedin: string;
  summary: string;
}

const ScanCV = () => {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span>Loading CV Scanner...</span>
      </div>
    }>
      <ScanCVContent />
    </Suspense>
  );
};

const ScanCVContent = () => {

    // const router = useRouter();
   
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCVs, setSelectedCVs] = useState<CV[]>([]);
  const [showJobCard, setShowJobCard] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
//   const [storedJobs, setStoredJobs] = useState<Job[]>([]);
  const [uploadedCVs, setUploadedCVs] = useState<CV[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const statusMessages = [
    "Uploading CV...",
    "Analyzing CV...",
    "Matching skills with job description...",
    "Calculating compatibility score...",
    "Finding the best candidate...",
  ];

  // Load the job data from sessionStorage based on URL parameter
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

      // Load CVs from sessionStorage
      const savedCVs = JSON.parse(
        sessionStorage.getItem("uploadedCVs") || "[]"
      ) as CV[];
      setUploadedCVs(savedCVs);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }, []);


  // Status message rotation effect
  useEffect(() => {
    if (analyzing && progress < 100) {
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % statusMessages.length
        );
      }, 1210);

      return () => clearInterval(messageInterval);
    }
  }, [analyzing, progress, statusMessages.length]);

  const getAllCVs = (): CV[] => {
    // Static CVs will always be available
    const staticCVs: CV[] = [
      {
        id: "d1",
        name: "resume_john_smith.pdf",
        size: "2.4 MB",
        uploadDate: "2024-02-20",
      },
      {
        id: "d2",
        name: "sarah_wilson_cv.pdf",
        size: "1.8 MB",
        uploadDate: "2024-02-19",
      },
      {
        id: "d3",
        name: "michael_brown_resume.pdf",
        size: "3.1 MB",
        uploadDate: "2024-02-18",
      },
      {
        id: "d4",
        name: "emma_davis_cv.pdf",
        size: "2.2 MB",
        uploadDate: "2024-02-17",
      },
      {
        id: "d5",
        name: "alex_johnson_resume.pdf",
        size: "1.9 MB",
        uploadDate: "2024-02-16",
      },
      {
        id: "d6",
        name: "olivia_martinez_cv.pdf",
        size: "2.5 MB",
        uploadDate: "2024-02-15",
      },
      {
        id: "d7",
        name: "william_taylor_resume.pdf",
        size: "3.0 MB",
        uploadDate: "2024-02-14",
      },
      {
        id: "d8",
        name: "sophia_anderson_cv.pdf",
        size: "2.3 MB",
        uploadDate: "2024-02-13",
      },
    ];
    
    // Only include uploadedCVs if we're on the client
    return [...uploadedCVs, ...staticCVs];
  };

  const filteredCVs = getAllCVs().filter((cv) =>
    cv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCVSelection = (cv: CV, event?: React.MouseEvent) => {
    // Prevent event propagation if the event exists
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
  };

  const handleOpenCVModal = () => {
    setIsModalOpen(true);
  };

  const startAnalysis = async () => {
    setAnalyzing(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(i);
    }

    setAnalyzing(false);
    setAnalyzed(true);
  };

  // Reset the flow to initial state after analysis
  const handleStartOver = () => {
    setShowJobCard(true);
    setAnalyzed(false);
    setSelectedCVs([]);
  };

  const getCandidatesData = (): Candidate[] => {
    return [
      {
        id: 1,
        name: "John Doe",
        avatar: "/api/placeholder/32/32",
        email: "john.doe@email.com",
        phone: "+1 234 567 8900",
        score: 92,
        experience: "7 years",
        currentRole: "Lead Frontend Developer",
        currentCompany: "Digital Innovations",
        skills: ["React", "TypeScript", "Node.js", "Redux", "GraphQL", "AWS"],
        certifications: ["AWS Certified Developer", "React Expert Level 3"],
        education: "MSc Computer Science",
        university: "Stanford University",
        github: "github.com/johndoe",
        linkedin: "linkedin.com/in/johndoe",
        summary:
          "Experienced frontend developer with a strong focus on React ecosystem...",
      },
      {
        id: 2,
        name: "Sarah Wilson",
        avatar: "/api/placeholder/32/32",
        email: "sarah.w@email.com",
        phone: "+1 234 567 8901",
        score: 88,
        experience: "6 years",
        currentRole: "Senior Frontend Engineer",
        currentCompany: "Tech Giants Inc",
        skills: ["React", "TypeScript", "Vue.js", "Node.js", "Jest", "Cypress"],
        certifications: ["Google Cloud Certified", "TypeScript Expert"],
        education: "BSc Software Engineering",
        university: "MIT",
        github: "github.com/sarahw",
        linkedin: "linkedin.com/in/sarahw",
        summary:
          "Frontend specialist with extensive testing and optimization experience...",
      },
      {
        id: 3,
        name: "Michael Chang",
        avatar: "/api/placeholder/32/32",
        email: "m.chang@email.com",
        phone: "+1 234 567 8902",
        score: 85,
        experience: "5 years",
        currentRole: "Frontend Developer",
        currentCompany: "StartupCo",
        skills: ["React", "JavaScript", "Node.js", "Redux", "Tailwind"],
        certifications: ["React Native Specialist"],
        education: "BSc Computer Science",
        university: "Berkeley",
        github: "github.com/mchang",
        linkedin: "linkedin.com/in/mchang",
        summary:
          "Full-stack developer with a passion for creating responsive web applications...",
      },
      {
        id: 4,
        name: "Emma Rodriguez",
        avatar: "/api/placeholder/32/32",
        email: "emma.r@email.com",
        phone: "+1 234 567 8903",
        score: 72,
        experience: "4 years",
        currentRole: "Web Developer",
        currentCompany: "Creative Solutions",
        skills: ["JavaScript", "React", "CSS", "HTML", "jQuery"],
        certifications: ["Web Development Bootcamp"],
        education: "BA Digital Design",
        university: "NYU",
        github: "github.com/emmar",
        linkedin: "linkedin.com/in/emmar",
        summary: "Creative developer with strong design background...",
      },
      {
        id: 5,
        name: "David Kim",
        avatar: "/api/placeholder/32/32",
        email: "d.kim@email.com",
        phone: "+1 234 567 8904",
        score: 68,
        experience: "3 years",
        currentRole: "Junior Frontend Developer",
        currentCompany: "SmallTech Ltd",
        skills: ["JavaScript", "React", "HTML", "CSS", "Bootstrap"],
        certifications: [],
        education: "BSc Information Technology",
        university: "UCLA",
        github: "github.com/dkim",
        linkedin: "linkedin.com/in/dkim",
        summary:
          "Emerging developer with focus on modern JavaScript frameworks...",
      },
      {
        id: 6,
        name: "Lisa Chen",
        avatar: "/api/placeholder/32/32",
        email: "l.chen@email.com",
        phone: "+1 234 567 8905",
        score: 65,
        experience: "2 years",
        currentRole: "Frontend Developer",
        currentCompany: "WebAgency",
        skills: ["JavaScript", "React", "CSS", "Sass"],
        certifications: ["Frontend Fundamentals"],
        education: "BSc Web Development",
        university: "USC",
        github: "github.com/lchen",
        linkedin: "linkedin.com/in/lchen",
        summary:
          "Detail-oriented developer specializing in responsive design...",
      },
    ];
  };

  const candidates = getCandidatesData();
  const shortlistedCandidates = candidates.filter(
    (candidate) => candidate.score >= 75
  );
  const notShortlistedCandidates = candidates.filter(
    (candidate) => candidate.score < 75
  );

  // Function to open candidate details modal
  const openCandidateDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCandidateModalOpen(true);
  };

  // Display loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span>Loading CV Scanner...</span>
      </div>
    );
  }

  if (!selectedJob) return <div className="p-6">Loading...</div>;
  


  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6">
      
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
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 pl-6">CV Scanner</h2>
            </div>

            <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300">
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
                      <span className="text-sm">• {selectedJob.jobType}</span>
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
                  {progress < 100
                    ? statusMessages[currentMessageIndex]
                    : "Analysis Complete 🎉"}
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

            {/* Shortlisted Candidates */}
            <Card>
              <div className="p-3 md:p-4 border-b">
                <h3 className="flex items-center gap-2 font-semibold text-sm md:text-base">
                  <Check className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
                  Shortlisted Candidates ({shortlistedCandidates.length})
                </h3>
              </div>
              <ScrollArea
                className={`h-[300px] md:h-[400px] p-3 md:p-4 ${styles.customScrollbar}`}
              >
                {shortlistedCandidates.map((candidate) => (
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
                          <AvatarImage
                            src={candidate.avatar}
                            alt={candidate.name}
                          />
                          <AvatarFallback>
                            <User2 className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-sm md:text-base">
                            {candidate.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {candidate.currentRole} at{" "}
                            {candidate.currentCompany}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white self-start sm:self-auto">
                        <Star className="h-3 w-3 mr-1" />
                        {candidate.score}%
                      </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {candidate.skills.slice(0, 4).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </ScrollArea>
            </Card>

            {/* Not Shortlisted Candidates */}
            <Card>
              <div className="p-3 md:p-4 border-b">
                <h3 className="flex items-center gap-2 font-semibold text-sm md:text-base">
                  <X className="text-red-500 w-4 h-4 md:w-5 md:h-5" />
                  Not Shortlisted ({notShortlistedCandidates.length})
                </h3>
              </div>
              <ScrollArea
                className={`h-[300px] md:h-[400px] p-3 md:p-4 ${styles.customScrollbar}`}
              >
                {notShortlistedCandidates.map((candidate) => (
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
                          <AvatarImage
                            src={candidate.avatar}
                            alt={candidate.name}
                          />
                          <AvatarFallback>
                            <User2 className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-sm md:text-base">
                            {candidate.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {candidate.currentRole} at{" "}
                            {candidate.currentCompany}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="destructive"
                        className="self-start sm:self-auto"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {candidate.score}%
                      </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {candidate.skills.slice(0, 4).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
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

            {/* Redesigned CV Table */}
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
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {cv.uploadDate}
                              </span>
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
                    <FilePlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No CVs selected yet</p>
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

      {/* CV Selection Modal */}
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
                      onClick={(e) => handleCVSelection(cv, e)} // Pass event correctly
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

      <Dialog open={candidateModalOpen} onOpenChange={setCandidateModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Candidate Details - {selectedCandidate.name}
                </DialogTitle>
              </DialogHeader>

              <Card className="shadow-md border">
                <div className="p-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedCandidate.avatar} />
                      <AvatarFallback>
                        <User2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold">
                        {selectedCandidate.name}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-4 w-4 text-blue-500" />{" "}
                        {selectedCandidate.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      selectedCandidate.score >= 75
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {selectedCandidate.score}%
                  </Badge>
                </div>
              </Card>

              <div className="space-y-3 mt-3">
                {/* Contact Details */}
                <Card className="shadow-sm border">
                  <div className="p-3 flex flex-wrap justify-between text-sm text-gray-500 gap-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-500" />{" "}
                      {selectedCandidate.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />{" "}
                      {selectedCandidate.email}
                    </div>
                  </div>
                </Card>

                {/* Skills Analysis */}
                <Card className="shadow-sm border">
                  <div className="p-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-500" /> Skills
                      Analysis
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedCandidate.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className={
                            selectedJob.skills.includes(skill)
                              ? "bg-blue-500"
                              : "bg-gray-200 text-gray-700"
                          }
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Experience & Education */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Card className="shadow-sm border">
                    <div className="p-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <Briefcase className="h-5 w-5 text-gray-600" />{" "}
                        Experience
                      </h3>
                      <span className="text-sm text-gray-500">
                        {selectedCandidate.experience}
                      </span>
                    </div>
                  </Card>
                  <Card className="shadow-sm border">
                    <div className="p-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-gray-600" /> Education
                      </h3>
                      <span className="text-sm text-gray-500">
                        {selectedCandidate.education}
                      </span>
                    </div>
                  </Card>
                </div>

                {/* AI Candidate Analysis */}
                <Card className="shadow-md border bg-blue-50">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" /> AI
                      Candidate Analysis
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {selectedCandidate.score >= 75 ? (
                        <>
                          <p>
                            The candidate is highly aligned with the role
                            requirements:
                          </p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                              <span>
                                Matched{" "}
                                <b>
                                  {
                                    selectedCandidate.skills.filter((skill) =>
                                      selectedJob.skills.includes(skill)
                                    ).length
                                  }
                                </b>{" "}
                                of <b>{selectedJob.skills.length}</b> required
                                skills.
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-500 shrink-0" />
                              <span>
                                Relevant experience:{" "}
                                {selectedCandidate.experience}
                              </span>
                            </li>
                            {selectedCandidate.certifications &&
                              selectedCandidate.certifications.length > 0 && (
                                <li className="flex items-center gap-2">
                                  <Award className="h-4 w-4 text-yellow-500 shrink-0" />
                                  <span>
                                    Holds{" "}
                                    {selectedCandidate.certifications.length}{" "}
                                    relevant certifications.
                                  </span>
                                </li>
                              )}
                          </ul>
                          <p>
                            <span className="text-green-600 font-medium">
                              Recommendation:
                            </span>{" "}
                            Proceed with the technical interview.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>The candidate has some skill gaps:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                              <span>
                                Matched{" "}
                                <b>
                                  {
                                    selectedCandidate.skills.filter((skill) =>
                                      selectedJob.skills.includes(skill)
                                    ).length
                                  }
                                </b>{" "}
                                of <b>{selectedJob.skills.length}</b> required
                                skills.
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-500 shrink-0" />
                              <span>
                                Experience gap: {selectedCandidate.experience}{" "}
                                (below target).
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-amber-500 shrink-0" />
                              <span>
                                Development areas:{" "}
                                {selectedJob.skills
                                  .filter(
                                    (skill) =>
                                      !selectedCandidate.skills.includes(skill)
                                  )
                                  .join(", ")}
                                .
                              </span>
                            </li>
                          </ul>
                          <p>
                            <span className="text-amber-600 font-medium">
                              Recommendation:
                            </span>{" "}
                            Consider for future opportunities after skill
                            enhancement.
                          </p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setCandidateModalOpen(false)}
                  >
                    Close
                  </Button>
                  {selectedCandidate.score >= 70 && (
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                      <Mail className="h-4 w-4" />
                      Schedule Interview
                    </Button>
                  )}
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
