"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import LayoutWrapper from "@/components/LayoutWrapper";
import {
  Briefcase,
  MapPin,
  Clock,
  Code,
  FileText,
  ListChecks,
  GraduationCap,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Main component content without using useSearchParams
const JobFormContent = () => {
  const [job, setJob] = useState({
    title: "",
    location: "",
    jobType: "",
    about: "",
    responsibilities: "",
    qualifications: "",
    skills: "",
  });

  const router = useRouter();
  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newJob = {
      id: Date.now(),
      title: job.title,
      location: job.location,
      jobType: job.jobType,
      about: job.about,
      responsibilities: job.responsibilities,
      qualifications: job.qualifications,
      skills: job.skills.split(",").map((skill) => skill.trim()),
    };

    // Get existing jobs from session storage
    const storedJobs = JSON.parse(sessionStorage.getItem("jobs") || "[]");

    // Add new job to stored jobs
    sessionStorage.setItem("jobs", JSON.stringify([newJob, ...storedJobs]));

    // Navigate back to job descriptions list
    router.push("/dashboard?tab=jobs");
  };

  const handleCancel = () => {
    router.push("/dashboard?tab=jobs");
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border border-gray-200 shadow-xl rounded-lg overflow-hidden">
        {/* Fixed header with better contrast and visibility */}
        <CardHeader
          className="space-y-2 bg-gradient-to-r bg-gradient-to-br from-gray-700 to-gray-900
 border-b p-6"
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">
              Create New Job Description
            </CardTitle>
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <CardDescription className="text-sm text-blue-100">
            Complete the form below to create a professional job posting
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-8 pb-4 px-8 space-y-8 bg-white">
            {/* Job Details Section */}
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Senior Frontend Developer"
                    value={job.title}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 shadow-sm rounded-md px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="location"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Remote, New York"
                    value={job.location}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 shadow-sm rounded-md px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="jobType"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Clock className="h-4 w-4 text-blue-600" />
                    Job Type
                  </Label>
                  <Select
                    value={job.jobType}
                    onValueChange={(value) =>
                      setJob({ ...job, jobType: value })
                    }
                  >
                    <SelectTrigger className="border border-gray-300 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="skills"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700"
                  >
                    <Code className="h-4 w-4 text-blue-600" />
                    Required Skills
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="e.g., React, TypeScript, Node.js"
                    value={job.skills}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 shadow-sm rounded-md px-3 py-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </motion.div>

            <Separator className="bg-gray-200" />

            {/* Job Description Section */}
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="space-y-2">
                <Label
                  htmlFor="about"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <FileText className="h-4 w-4 text-blue-600" />
                  About the Role
                </Label>
                <style jsx global>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #a0a0a0;
                    border-radius: 3px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background-color: #f0f0f0;
                    border-radius: 3px;
                  }
                `}</style>
                <Textarea
                  id="about"
                  name="about"
                  placeholder="Describe the role and your company..."
                  value={job.about}
                  onChange={handleChange}
                  required
                  className="h-36 min-h-[150px] max-h-[150px] overflow-auto resize-none border border-gray-300 shadow-sm rounded-md p-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 custom-scrollbar"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="responsibilities"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <ListChecks className="h-4 w-4 text-blue-600" />
                  Key Responsibilities
                </Label>
                <Textarea
                  id="responsibilities"
                  name="responsibilities"
                  placeholder="List the key responsibilities..."
                  value={job.responsibilities}
                  onChange={handleChange}
                  required
                  className="h-36 min-h-[150px] max-h-[150px] overflow-auto resize-none border border-gray-300 shadow-sm rounded-md p-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 custom-scrollbar"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="qualifications"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Required Qualifications
                </Label>
                <Textarea
                  id="qualifications"
                  name="qualifications"
                  placeholder="List the required qualifications..."
                  value={job.qualifications}
                  onChange={handleChange}
                  required
                  className="h-36 min-h-[150px] max-h-[150px] overflow-auto resize-none border border-gray-300 shadow-sm rounded-md p-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 custom-scrollbar"
                />
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-3 py-3 px-5 bg-white border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="px-4 text-gray-600 hover:text-gray-900 hover:bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 bg-gray-900 hover:bg-black text-white"
            >
              Create Job
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

// Main component with proper Suspense implementation
const NewJobForm = () => {
  return (
    <LayoutWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <JobFormContent />
      </Suspense>
    </LayoutWrapper>
  );
};

export default NewJobForm;