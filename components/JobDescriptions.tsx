"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Clock,
  Code,
  FileText,
  GraduationCap,
  ListChecks,
  MapPin,
  MoreVertical,
  PencilLine,
  Plus,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Define TypeScript interfaces
interface JobDescription {
  id: number;
  title: string;
  location: string;
  jobType: string;
  about: string;
  responsibilities: string;
  qualifications: string;
  skills: string[];
}

const JobDescriptionsList = () => {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<JobDescription | null>(null);
  const router = useRouter();

  const jobTypes: string[] = ["Full-time", "Part-time", "Contract", "Remote"];

  // Move staticJobs inside useEffect to avoid the dependency warning,
  // or define it outside the component to keep it from re-creating on each render
  useEffect(() => {
    const staticJobs: JobDescription[] = [
      {
        id: 1,
        title: "Senior Frontend Developer",
        location: "Remote",
        jobType: "Full-time",
        about: "We are looking for an experienced Frontend Developer...",
        responsibilities: "Lead frontend development initiatives...",
        qualifications: "5+ years of experience in frontend development...",
        skills: ["React", "TypeScript", "Node.js"],
      },
      {
        id: 2,
        title: "Backend Developer",
        location: "Hybrid",
        jobType: "Full-time",
        about: "We are seeking a skilled Backend Developer...",
        responsibilities: "Develop scalable backend solutions...",
        qualifications: "3+ years of experience in backend development...",
        skills: ["Node.js", "Express", "MongoDB", "SQL"],
      },
      {
        id: 3,
        title: "UI/UX Designer",
        location: "Remote",
        jobType: "Part-time",
        about: "Join our design team to create intuitive user experiences.",
        responsibilities: "Design wireframes and collaborate with developers.",
        qualifications: "2+ years of experience in UI/UX design.",
        skills: ["Figma", "Adobe XD", "User Research"],
      },
      {
        id: 4,
        title: "Full Stack Developer",
        location: "On-site",
        jobType: "Full-time",
        about: "We are looking for a Full Stack Developer to work on cutting-edge web applications.",
        responsibilities: "Develop and maintain both frontend and backend components of web applications.",
        qualifications: "4+ years of experience in full stack development with React and Node.js.",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
      },
      {
        id: 5,
        title: "UI/UX Designer",
        location: "Remote",
        jobType: "Part-time",
        about: "Join our design team to create intuitive and visually appealing user experiences.",
        responsibilities: "Design wireframes, prototypes, and collaborate with developers for seamless UI implementation.",
        qualifications: "2+ years of experience in UI/UX design with a strong portfolio.",
        skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
      },
    ];

    // Use proper type checking and provide fallback value
    const storedJobs = 
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem("jobs") || "[]") as JobDescription[]
        : [];

    if (storedJobs.length === 0) {
      sessionStorage.setItem("jobs", JSON.stringify(staticJobs));
      setJobDescriptions(staticJobs);
    } else {
      setJobDescriptions(storedJobs);
    }
  }, []); // No external dependencies now

  const handleEdit = (job: JobDescription) => {
    setEditingJob(job);
    setIsEditModalOpen(true);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingJob) return;
    
    const updatedJobs = jobDescriptions.map((job) =>
      job.id === editingJob.id ? editingJob : job
    );
    setJobDescriptions(updatedJobs);
    sessionStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    const updatedJobs = jobDescriptions.filter((job) => job.id !== id);
    setJobDescriptions(updatedJobs);
    sessionStorage.setItem("jobs", JSON.stringify(updatedJobs));
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage: number = 4;

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobDescriptions.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobDescriptions.length / jobsPerPage);

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 pl-6">Job Descriptions</h2>
        <Button
          onClick={() => router.push("/new-job")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          New
        </Button>
      </div>

      {/* Responsive Card for All Jobs */}
      <Card className="p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="grid gap-4">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 gap-3 relative"
            >
              {/* Mobile Menu (Top Right) */}
              <div className="absolute top-0 right-0 sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(job)} className="cursor-pointer">
                      <PencilLine className="w-4 h-4 text-blue-500 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(job.id)} className="cursor-pointer">
                      <Trash2 className="w-4 h-4 text-red-500 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
                <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>

                <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="text-xs sm:text-sm">{job.location}</span>
                    </div>
                    <span className="text-xs sm:text-sm">• {job.jobType}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex space-x-2">
                <button className="p-2 hover:bg-blue-50 rounded-full" onClick={() => handleEdit(job)}>
                  <PencilLine className="w-5 h-5 text-blue-500" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-full" onClick={() => handleDelete(job.id)}>
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
                <Button
                  onClick={() => router.push(`/scan-cv?jobId=${job.id}`)}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Scan CV
                </Button>
              </div>

              {/* Mobile Scan CV Button (Centered) */}
              <div className="flex sm:hidden justify-center w-full mt-3">
                <Button
                  onClick={() => router.push(`/scan-cv?jobId=${job.id}`)}
                  className="bg-green-600 text-white hover:bg-green-700 text-xs px-6 py-1 h-8 mx-auto"
                >
                  Scan CV
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Responsive Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[95%] sm:w-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">Edit Job Description</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Row 1 */}
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  Job Title
                </Label>
                <Input
                  id="title"
                  value={editingJob?.title || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, title: e.target.value } : null)
                  }
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={editingJob?.location || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, location: e.target.value } : null)
                  }
                  className="text-sm sm:text-base"
                />
              </div>

              {/* Row 2 */}
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="jobType" className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  Job Type
                </Label>
                <Select
                  value={editingJob?.jobType}
                  onValueChange={(value) =>
                    setEditingJob(editingJob ? { ...editingJob, jobType: value } : null)
                  }
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-sm sm:text-base">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="skills" className="flex items-center gap-2 text-sm">
                  <Code className="w-4 h-4 text-gray-500" />
                  Skills
                </Label>
                <Input
                  id="skills"
                  placeholder="e.g., React, TypeScript, Node.js"
                  value={editingJob?.skills.join(", ") || ""}
                  onChange={(e) =>
                    setEditingJob(
                      editingJob 
                        ? {
                            ...editingJob,
                            skills: e.target.value.split(",").map((s) => s.trim()),
                          } 
                        : null
                    )
                  }
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Larger text areas in full width */}
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="about" className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-500" />
                  About the Role
                </Label>
                <Textarea
                  id="about"
                  value={editingJob?.about || ""}
                  onChange={(e) =>
                    setEditingJob(editingJob ? { ...editingJob, about: e.target.value } : null)
                  }
                 className="h-16 sm:h-20 resize-none custom-scrollbar text-sm sm:text-base"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="responsibilities" className="flex items-center gap-2 text-sm">
                  <ListChecks className="w-4 h-4 text-gray-500" />
                  Key Responsibilities
                </Label>
                <Textarea
                  id="responsibilities"
                  value={editingJob?.responsibilities || ""}
                  onChange={(e) =>
                    setEditingJob(
                      editingJob
                        ? {
                            ...editingJob,
                            responsibilities: e.target.value,
                          }
                        : null
                    )
                  }
                 className="h-16 sm:h-20 resize-none custom-scrollbar text-sm sm:text-base"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="qualifications" className="flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  Qualifications
                </Label>
                <Textarea
                  id="qualifications"
                  value={editingJob?.qualifications || ""}
                  onChange={(e) =>
                    setEditingJob(
                      editingJob
                        ? {
                            ...editingJob,
                            qualifications: e.target.value,
                          }
                        : null
                    )
                  }
                  className="h-16 sm:h-20 resize-none custom-scrollbar text-sm sm:text-base"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Responsive Pagination Controls */}
      <div className="flex justify-center mt-4 sm:mt-6 space-x-1 sm:space-x-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          className="px-2 sm:px-4 py-1 text-xs sm:text-sm"
        >
          Previous
        </Button>
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            variant={currentPage === i + 1 ? "default" : "outline"}
            className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm flex items-center justify-center"
          >
            {i + 1}
          </Button>
        ))}
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          className="px-2 sm:px-4 py-1 text-xs sm:text-sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default JobDescriptionsList;