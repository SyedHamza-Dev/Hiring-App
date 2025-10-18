"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { CheckSquare, Cloud, Download, Plus, Square, Trash2, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { BiSolidFilePdf } from "react-icons/bi";

interface CV {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  isLoading?: boolean;
  downloadUrl?: string;
}

const CircularProgress = ({ progress = 0 }) => (
  <div className="relative w-6 h-6 sm:w-8 sm:h-8">
    <svg className="w-full h-full" viewBox="0 0 36 36">
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="3"
      />
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="3"
        strokeDasharray={`${progress}, 100`}
        className="transform -rotate-90 origin-center"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <BiSolidFilePdf className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
    </div>
  </div>
);

const CVManagementSystem = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCVs, setSelectedCVs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const itemsPerPage = 4;

  const dummyCVs: CV[] = [
    { id: "d1", name: "resume_john_smith.pdf", size: "2.4 MB", uploadDate: "2024-02-20" },
    { id: "d2", name: "sarah_wilson_cv.pdf", size: "1.8 MB", uploadDate: "2024-02-19" },
    { id: "d3", name: "michael_brown_resume.pdf", size: "3.1 MB", uploadDate: "2024-02-18" },
    { id: "d4", name: "emma_davis_cv.pdf", size: "2.2 MB", uploadDate: "2024-02-17" },
  ];

  useEffect(() => {
    const savedCVs = sessionStorage.getItem("uploadedCVs");
    if (savedCVs) {
      setCvs(JSON.parse(savedCVs));
    }
  }, []);

  useEffect(() => {
    if (cvs.length > 0) {
      sessionStorage.setItem("uploadedCVs", JSON.stringify(cvs));
    }
  }, [cvs]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsDialogOpen(false);
      
      const newCVs = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        isLoading: true,
        downloadUrl: URL.createObjectURL(file)
      }));

      const targetPage = Math.ceil((cvs.length + newCVs.length) / itemsPerPage);
      setCvs(prev => [...prev, ...newCVs]);
      setCurrentPage(targetPage);

      // Simulate loading state for each CV
      newCVs.forEach(async (cv) => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1500));
        setCvs(prev => 
          prev.map(item => 
            item.id === cv.id ? { ...item, isLoading: false } : item
          )
        );
      });

      toast({
        title: "Success",
        description: `${newCVs.length} CV${newCVs.length > 1 ? 's' : ''} uploaded successfully!`,
        className: "bg-green-600 text-white",
      });
    }
  };

  const deleteSelectedCVs = () => {
    setCvs(prev => {
      const newCVs = prev.filter(cv => !selectedCVs.includes(cv.id));
      const currentPageFirstIndex = (currentPage - 1) * itemsPerPage;
      
      // Only change page if all CVs on current page are deleted
      const currentPageCVs = getCurrentPageItems();
      const allCurrentPageSelected = currentPageCVs.every(cv => selectedCVs.includes(cv.id));
      
      if (allCurrentPageSelected && currentPage > 1 && currentPageFirstIndex >= newCVs.length) {
        setCurrentPage(currentPage - 1);
      }
      
      return newCVs;
    });

    toast({
      title: "Deleted",
      description: `${selectedCVs.length} CV${selectedCVs.length > 1 ? 's' : ''} deleted successfully`,
      className: "bg-red-600 text-white",
    });

    setSelectedCVs([]);
    setIsDeleteDialogOpen(false);
  };

  const deleteCV = (id: string) => {
    setSelectedCVs([id]);
    setIsDeleteDialogOpen(true);
  };

  const toggleSelectCV = (id: string) => {
    setSelectedCVs(prev => 
      prev.includes(id) 
        ? prev.filter(cvId => cvId !== id)
        : [...prev, id]
    );
  };

  const handleDownload = (cv: CV) => {
    if (cv.downloadUrl) {
      const link = document.createElement('a');
      link.href = cv.downloadUrl;
      link.download = cv.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const totalPages = Math.max(1, Math.ceil((cvs.length + dummyCVs.length) / itemsPerPage));
  
  const getCurrentPageItems = () => {
    const allCVs = [...dummyCVs, ...cvs];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allCVs.slice(startIndex, endIndex);
  };

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
      <div className="flex items-center gap-2 sm:gap-4 pl-6 sm:pl-4">
  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">CV Management</h2>
</div>
  
  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
    {selectedCVs.length > 0 && (
      <Button
        variant="destructive"
        onClick={() => setIsDeleteDialogOpen(true)}
        className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto"
        size="sm"
      >
        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
        Delete ({selectedCVs.length})
      </Button>
    )}
    <Button
      onClick={() => setIsDialogOpen(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm w-full sm:w-auto"
      size="sm"
    >
      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Add New CV
    </Button>
  </div>
</div>

        <Card className="p-2 sm:p-4 md:p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="space-y-2 sm:space-y-4">
            <AnimatePresence mode="wait">
              {getCurrentPageItems().map((cv) => (
                <motion.div
                  key={cv.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-4 rounded-lg bg-white border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-0 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 min-w-0"
                      onClick={() => toggleSelectCV(cv.id)}
                    >
                      {selectedCVs.includes(cv.id) ? (
                        <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      )}
                    </Button>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                      <AnimatePresence mode="wait">
                        {cv.isLoading ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <CircularProgress progress={75} />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <BiSolidFilePdf className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="min-w-0 flex-1 pr-2">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                        {cv.name}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-xs sm:text-sm text-gray-500">{cv.size}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs sm:text-sm text-gray-500">{cv.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile view: buttons moved up and centered */}
                  <div className="flex items-center sm:hidden space-x-1 justify-end flex-shrink-0 -mt-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => cv.downloadUrl && handleDownload(cv)}
                          disabled={!cv.downloadUrl}
                          className="text-gray-400 hover:text-blue-500 transition-colors h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {cv.downloadUrl ? 'Download CV' : 'Download not available'}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCV(cv.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete CV</TooltipContent>
                    </Tooltip>
                  </div>
                  
                  {/* Desktop view: buttons on right */}
                  <div className="hidden sm:flex items-center space-x-1 sm:space-x-2 justify-end flex-shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => cv.downloadUrl && handleDownload(cv)}
                          disabled={!cv.downloadUrl}
                          className="text-gray-400 hover:text-blue-500 transition-colors h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {cv.downloadUrl ? 'Download CV' : 'Download not available'}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCV(cv.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete CV</TooltipContent>
                    </Tooltip>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center flex-wrap gap-1 sm:gap-2 mt-4 sm:mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
              className={`min-w-[2rem] sm:min-w-[2.5rem] h-8 text-xs sm:text-sm px-2 ${currentPage === i + 1 ? "bg-blue-600" : ""}`}
            >
              {i + 1}
            </Button>
          ))}
        </div>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Delete Confirmation</DialogTitle>
            </DialogHeader>
            <div className="py-2 sm:py-4">
              <p className="text-gray-600 text-sm sm:text-base">
                Are you sure you want to delete {selectedCVs.length} selected CV{selectedCVs.length > 1 ? 's' : ''}? This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteSelectedCVs}
                className="w-full sm:w-auto"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-w-[90vw] p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-center">Upload New CVs</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 sm:gap-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer group relative rounded-lg border-2 border-dashed border-gray-300/80 px-3 sm:px-6 py-6 sm:py-10 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
              >
                <div className="flex flex-col items-center gap-2 sm:gap-4">
                  <div className="rounded-full bg-white p-3 sm:p-4 ring-2 sm:ring-4 ring-gray-50 transition-colors group-hover:ring-blue-50">
                    <Cloud className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-blue-500 transition-colors group-hover:text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 font-medium mb-1 text-sm sm:text-base">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      PDF (up to 10MB)
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="relative border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 text-xs sm:text-sm h-8 sm:h-10"
                  >
                    <Upload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Browse Files
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default CVManagementSystem;