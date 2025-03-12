"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/utils/auth";
import {
  LockKeyhole,
  User,
  LogIn,
  Scan,
  FileText,
  Bot,
  Check,
  ChevronRight,
  Shield,
} from "lucide-react";

interface RandomAngle {
  initialRotation: number;
  finalRotation: number;
}

export default function Home() {
  const [adminUser, setAdminUser] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();
  
  // Set isClient to true on component mount (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (): Promise<void> => {
    if (!adminUser || !adminPassword) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (login(adminUser, adminPassword)) {
        // Success animation before redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 1200);
  };

  // Generate stable random values for animations on client-side only
  const [randomAngles, setRandomAngles] = useState<RandomAngle[]>([]);

  useEffect(() => {
    const angles: RandomAngle[] = Array(5).fill(0).map(() => ({
      initialRotation: Math.random() * 10 - 5,
      finalRotation: Math.random() * 20 - 10,
    }));
    setRandomAngles(angles);
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 to-slate-900">
      {/* Left Side - CV Scanner Visualization - Only render full animations on client */}
      <div className="w-1/2 p-12 flex flex-col justify-between relative hidden md:flex overflow-hidden">
        <div className="text-white text-xl font-bold flex items-center z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mr-3 shadow-lg">
            <Scan className="h-5 w-5 text-white" />
          </div>
          <span className="tracking-tight">Smart CV Scanner</span>
        </div>

        {/* Background abstract gradient elements - Client-side only */}
        {isClient && (
          <>
            <motion.div
              key="gradient-1"
              className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-500 opacity-10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              key="gradient-2"
              className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-indigo-600 opacity-10 blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.08, 0.18, 0.08],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </>
        )}

        {/* Central Visualization - Client-side only animations */}
        <div className="relative flex justify-center items-center h-full">
          {/* Central spinning ring - Show static initially, animate on client only */}
          {isClient ? (
            <>
              <motion.div
                key="ring-1"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute w-64 h-64 border-2 border-blue-400/30 rounded-full"
              />

              <motion.div
                key="ring-2"
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute w-80 h-80 border border-indigo-400/20 rounded-full"
              />
            </>
          ) : (
            <>
              <div className="absolute w-64 h-64 border-2 border-blue-400/30 rounded-full" />
              <div className="absolute w-80 h-80 border border-indigo-400/20 rounded-full" />
            </>
          )}

          {/* AI Bot in center with pulsing effect - Client-side only animation */}
          {isClient ? (
            <motion.div
              key="ai-bot"
              animate={{
                boxShadow: [
                  "0 0 0 0px rgba(59, 130, 246, 0.3)",
                  "0 0 0 15px rgba(59, 130, 246, 0)",
                ],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-20 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Bot className="h-10 w-10 text-white" />
            </motion.div>
          ) : (
            <div className="relative z-20 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="h-10 w-10 text-white" />
            </div>
          )}

          {/* CV Documents - Only render with animations on client-side */}
          {isClient && randomAngles.length === 5 && (
            <>
              {[...Array(5)].map((_, i) => {
                const radius = 140;
                const angle = (i * 2 * Math.PI) / 5;
                const initialX = radius * Math.cos(angle);
                const initialY = radius * Math.sin(angle);

                return (
                  <motion.div
                    key={`cv-doc-${i}`}
                    initial={{
                      x: initialX,
                      y: initialY,
                      opacity: 0,
                      rotate: randomAngles[i].initialRotation,
                    }}
                    animate={{
                      x: [initialX, radius * Math.cos(angle + 2 * Math.PI)],
                      y: [initialY, radius * Math.sin(angle + 2 * Math.PI)],
                      opacity: [0, 1, 1, 0],
                      rotate: [randomAngles[i].initialRotation, randomAngles[i].finalRotation],
                    }}
                    transition={{
                      duration: 15,
                      delay: i * 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute z-10 w-44 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-100/30"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          i % 3 === 0 ? "bg-green-50" : "bg-blue-50"
                        }`}
                      >
                        {i % 3 === 0 ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <span className="text-xs font-medium text-blue-600">
                            {95 - i * 5}%
                          </span>
                        )}
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 bg-gray-100 rounded-full w-full"></div>
                      <div className="h-2 bg-gray-100 rounded-full w-3/4"></div>
                      <div className="h-2 bg-gray-100 rounded-full w-5/6"></div>
                      <div className="h-2 bg-gray-100 rounded-full w-2/3"></div>
                    </div>

                    <div className="mt-4 flex space-x-1">
                      {[...Array(3)].map((_, j) => (
                        <motion.div
                          key={`indicator-${i}-${j}`}
                          className="h-1 bg-blue-200 rounded-full flex-1"
                          animate={{
                            opacity: j === i % 3 ? [0.5, 1, 0.5] : 0.5,
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: j * 0.5,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}

          {/* Scanning effect - Client-side only */}
          {isClient && (
            <motion.div
              key="scanning-effect"
              initial={{ opacity: 0, y: -150 }}
              animate={{
                opacity: [0, 0.5, 0],
                y: [-150, 150],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute w-full max-w-xs h-1 bg-blue-400 opacity-50 rounded-full blur-sm"
            />
          )}
        </div>

        <div className="text-white z-10">
          <div className="flex items-center mb-3">
            {isClient ? (
              <motion.div
                key="chevron-animation"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronRight className="h-5 w-5 text-blue-400 mr-2" />
              </motion.div>
            ) : (
              <ChevronRight className="h-5 w-5 text-blue-400 mr-2" />
            )}
            <h2 className="text-4xl font-bold tracking-tight">
              AI-Powered
              <br />
              Resume Analysis
            </h2>
          </div>
          <p className="text-gray-300 text-sm max-w-md leading-relaxed">
            Our intelligent system processes CVs with precision, matching
            candidates to your job requirements through advanced skill mapping
            and compatibility analysis.
          </p>
          <div className="mt-6 flex items-center space-x-4 text-sm">
            <div className="flex items-center px-3 py-2 bg-blue-900/40 backdrop-blur-sm rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
              <span className="text-gray-200">Match scoring</span>
            </div>
            <div className="flex items-center px-3 py-2 bg-blue-900/40 backdrop-blur-sm rounded-lg">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <span className="text-gray-200">Skill mapping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Initial animations are safe on client-side only */}
          {isClient ? (
            <motion.div
              key="login-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              className="flex flex-col items-center mb-8"
            >
              <motion.div
                key="login-logo"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-lg"
              >
                <Scan className="h-10 w-10 text-white" strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Smart CV Scanner
              </h1>
              <div className="flex items-center mt-2 text-blue-600 space-x-1">
                <div className="h-px w-6 bg-blue-200"></div>
                <p className="text-sm font-medium">
                  AI-powered recruiting platform
                </p>
                <div className="h-px w-6 bg-blue-200"></div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center mb-8">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-lg">
                <Scan className="h-10 w-10 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Smart CV Scanner
              </h1>
              <div className="flex items-center mt-2 text-blue-600 space-x-1">
                <div className="h-px w-6 bg-blue-200"></div>
                <p className="text-sm font-medium">
                  AI-powered recruiting platform
                </p>
                <div className="h-px w-6 bg-blue-200"></div>
              </div>
            </div>
          )}

          {isClient ? (
            <motion.div
              key="card-container"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-2xl text-gray-800 font-bold">
                    Welcome
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Sign in to access your recruitment dashboard
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {error && (
                      <motion.div
                        key="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-start"
                      >
                        <div className="mr-2 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </div>
                        {error}
                      </motion.div>
                    )}

                    <motion.div
                      key="username-field"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="username"
                        className="text-gray-700 font-medium"
                      >
                        Username
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">
                          <User className="h-full w-full" />
                        </div>
                        <Input
                          id="username"
                          placeholder="Enter your username"
                          value={adminUser}
                          onChange={(e) => setAdminUser(e.target.value)}
                          className="pl-10 h-12 rounded-lg bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                          disabled={loading}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      key="password-field"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">
                          <LockKeyhole className="h-full w-full" />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="pl-10 h-12 rounded-lg bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                          disabled={loading}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      key="remember-me"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center justify-between pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked === true)
                          }
                          className="data-[state=checked]:bg-blue-500 border-gray-300 rounded"
                        />

                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                        >
                          Remember me
                        </label>
                      </div>
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Forgot password?
                      </a>
                    </motion.div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pt-2">
                  <motion.div
                    key="login-button"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            key="loading-spinner"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="mr-2"
                          >
                            <svg
                              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                              viewBox="0 0 24 24"
                            ></svg>
                          </motion.div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <LogIn className="mr-2 h-5 w-5" />
                          <span>Sign In to Dashboard</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    key="security-notice"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center text-gray-500 text-sm mt-4"
                  >
                    <Shield className="h-4 w-4 mr-2 text-gray-400" />
                    <p>Enterprise-grade security protocols</p>
                  </motion.div>
                </CardFooter>
              </Card>

              <motion.div
                key="footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-6 text-gray-500 text-xs"
              >
                © 2025 Smart CV Scanner. All rights reserved.
              </motion.div>
            </motion.div>
          ) : (
            <div>
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-2xl text-gray-800 font-bold">
                    Welcome back
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Sign in to access your recruitment dashboard
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-start">
                        <div className="mr-2 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </div>
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-gray-700 font-medium"
                      >
                        Username
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">
                          <User className="h-full w-full" />
                        </div>
                        <Input
                          id="username"
                          placeholder="Enter your username"
                          value={adminUser}
                          onChange={(e) => setAdminUser(e.target.value)}
                          className="pl-10 h-12 rounded-lg bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">
                          <LockKeyhole className="h-full w-full" />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="pl-10 h-12 rounded-lg bg-gray-50 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                          disabled={loading}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked === true)
                          }
                          className="data-[state=checked]:bg-blue-500 border-gray-300 rounded"
                        />

                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                        >
                          Remember me
                        </label>
                      </div>
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pt-2">
                  <div className="w-full">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="mr-2">
                            <svg
                              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                              viewBox="0 0 24 24"
                            ></svg>
                          </div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <LogIn className="mr-2 h-5 w-5" />
                          <span>Sign In to Dashboard</span>
                        </div>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center text-gray-500 text-sm mt-4">
                    <Shield className="h-4 w-4 mr-2 text-gray-400" />
                    <p>Enterprise-grade security protocols</p>
                  </div>
                </CardFooter>
              </Card>

              <div className="text-center mt-6 text-gray-500 text-xs">
                © 2025 Smart CV Scanner. All rights reserved.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}