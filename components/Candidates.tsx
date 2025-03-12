import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Briefcase,
  Building2,
  Check,
  CheckCircle,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Star,
  User2,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

import { Award, TrendingUp, XCircle } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CVType {
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

interface JobDetailsType {
  title: string;
  company: string;
  location: string;
  skills: string[];
  experience: string;
  salary: string;
}

const statusMessages: string[] = [
  "Uploading CV...",
  "Analyzing CV...",
  "Matching skills with job description...",
  "Calculating compatibility score...",
  "Finding the best candidate...",
];

const CandidatesView = () => {
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [analyzed, setAnalyzed] = useState<boolean>(false);
  const [selectedCV, setSelectedCV] = useState<CVType | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);

  useEffect(() => {
    if (analyzing && progress < 100) {
      // Rotate status messages every 1.5 seconds
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex(
          (prevIndex) => (prevIndex + 1) % statusMessages.length
        );
      }, 1210);

      return () => clearInterval(messageInterval);
    }
  }, [analyzing, progress]); // Added progress as dependency

  const jobDetails: JobDetailsType = {
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc",
    location: "Remote",
    skills: ["React", "TypeScript", "Node.js", "Redux", "GraphQL"],
    experience: "5+ years",
    salary: "$120k - $150k",
  };

  const getCVsFromSession = (): CVType[] => {
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

  const cvs = getCVsFromSession();
  const shortlistedCVs = cvs.filter((cv) => cv.score >= 75);
  const notShortlistedCVs = cvs.filter((cv) => cv.score < 75);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Job Details Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{jobDetails.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Building2 className="h-4 w-4" />
                {jobDetails.company}
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4" />
                {jobDetails.location}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end">
              <Badge variant="secondary" className="mb-2">
                <Briefcase className="h-4 w-4 mr-1" />
                {jobDetails.experience}
              </Badge>
              <Badge variant="outline">
                <Star className="h-4 w-4 mr-1" />
                {jobDetails.salary}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap mb-4">
            {jobDetails.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          {!analyzing && !analyzed && (
            <Button className="w-full" onClick={startAnalysis}>
              <FileText className="mr-2 h-4 w-4" />
              Analyze CVs for this Role
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {analyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              {/* Loader & Progress Percentage */}
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="text-lg font-semibold text-blue-600">
                  {progress}%
                </span>
              </div>

              {/* Progress Bar */}
              <Progress value={progress} />

              {/* Rotating Status Messages */}
              <p className="text-sm text-muted-foreground">
                {progress < 100
                  ? statusMessages[currentMessageIndex]
                  : "Analysis Complete 🎉"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analyzed && (
        <div className="space-y-6">
          {/* Shortlisted CVs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="text-green-500" />
                Shortlisted Candidates ({shortlistedCVs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {shortlistedCVs.map((cv) => (
                  <div
                    key={cv.id}
                    className="p-4 border rounded-lg mb-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => {
                      setSelectedCV(cv);
                      setModalOpen(true);
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={cv.avatar} />
                          <AvatarFallback>
                            <User2 className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{cv.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {cv.currentRole} at {cv.currentCompany}
                          </p>
                        </div>
                      </div>
                      <Badge variant="default" className="ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        {cv.score}%
                      </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {cv.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                      {cv.skills.length > 4 && (
                        <Badge variant="outline">
                          +{cv.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Not Shortlisted CVs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <X className="text-red-500" />
                Not Shortlisted ({notShortlistedCVs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {notShortlistedCVs.map((cv) => (
                  <div
                    key={cv.id}
                    className="p-4 border rounded-lg mb-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => {
                      setSelectedCV(cv);
                      setModalOpen(true);
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={cv.avatar} />
                          <AvatarFallback>
                            <User2 className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{cv.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {cv.currentRole} at {cv.currentCompany}
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive" className="ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        {cv.score}%
                      </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {cv.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                      {cv.skills.length > 4 && (
                        <Badge variant="outline">
                          +{cv.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced CV Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedCV && (
            <>
              {/* Candidate Header */}
              <DialogHeader>
                <DialogTitle>
                  <VisuallyHidden>
                    Candidate Details - {selectedCV.name}
                  </VisuallyHidden>
                </DialogTitle>

                <Card className="shadow-md border">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedCV.avatar} />
                        <AvatarFallback>
                          <User2 className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {selectedCV.name}
                        </h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-4 w-4 text-blue-500" />{" "}
                          {selectedCV.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        selectedCV.score >= 75 ? "default" : "destructive"
                      }
                      className="px-3 py-1 text-sm font-medium flex items-center gap-2"
                    >
                      {selectedCV.score >= 75 ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {selectedCV.score}%
                    </Badge>
                  </CardContent>
                </Card>
              </DialogHeader>

              <div className="space-y-5 mt-4">
                {/* Contact Details */}
                <Card className="shadow-sm border">
                  <CardContent className="p-4 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-500" />{" "}
                      {selectedCV.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />{" "}
                      {selectedCV.email}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Analysis */}
                <Card className="shadow-sm border">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <Star className="h-5 w-5 text-yellow-500" /> Skills
                      Analysis
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedCV.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant={
                            jobDetails.skills.includes(skill)
                              ? "default"
                              : "secondary"
                          }
                          className="px-2 py-1 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Experience & Education */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="shadow-sm border">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <Briefcase className="h-5 w-5 text-gray-600" />{" "}
                        Experience
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {selectedCV.experience}
                      </span>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm border">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <GraduationCap className="h-5 w-5 text-gray-600" />{" "}
                        Education
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {selectedCV.education}
                      </span>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Candidate Analysis */}
                <Card className="shadow-md border bg-blue-50">
                  <CardContent className="p-5">
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" /> AI
                      Candidate Analysis
                    </h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      {selectedCV.score >= 75 ? (
                        <>
                          <p>
                            The candidate is highly aligned with the role
                            requirements:
                          </p>
                          <ul className="list-disc pl-4 space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Matched{" "}
                              <b>
                                {
                                  selectedCV.skills.filter((skill) =>
                                    jobDetails.skills.includes(skill)
                                  ).length
                                }
                              </b>{" "}
                              of <b>{jobDetails.skills.length}</b> required
                              skills.
                            </li>
                            <li className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              Relevant experience: {selectedCV.experience}
                            </li>
                            {selectedCV.certifications.length > 0 && (
                              <li className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-yellow-500" />
                                Holds {selectedCV.certifications.length}{" "}
                                relevant certifications.
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
                          <ul className="list-disc pl-4 space-y-2">
                            <li className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600" />
                              Matched{" "}
                              <b>
                                {
                                  selectedCV.skills.filter((skill) =>
                                    jobDetails.skills.includes(skill)
                                  ).length
                                }
                              </b>{" "}
                              of <b>{jobDetails.skills.length}</b> required
                              skills.
                            </li>
                            <li className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              Experience gap: {selectedCV.experience} (below
                              target).
                            </li>
                            <li className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-amber-500" />
                              Development areas:{" "}
                              {jobDetails.skills
                                .filter(
                                  (skill) => !selectedCV.skills.includes(skill)
                                )
                                .join(", ")}
                              .
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidatesView;
