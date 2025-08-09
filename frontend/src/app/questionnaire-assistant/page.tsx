"use client";

import { useState } from "react";
import { Shield, ArrowLeft, Upload, Loader2, Download, Copy, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function QuestionnaireAssistant() {
  const [formData, setFormData] = useState({
    questionnaire: "",
    companyInfo: "",
  });
  const [responses, setResponses] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setProgress(0);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch("http://localhost:5001/api/fill-questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        setResponses(data.responses);
      } else {
        setError(data.error || "Failed to fill questionnaire");
      }
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setError("Network error. Please ensure the backend server is running.");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(responses);
  };

  const downloadResponses = () => {
    const blob = new Blob([responses], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security_questionnaire_responses.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Security Questionnaire Assistant
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Auto-fill security questionnaires and vendor assessments
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Questionnaire Information</CardTitle>
              <CardDescription>
                Provide your company details and the questionnaire to be filled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="companyInfo">Company Information *</Label>
                  <Textarea
                    id="companyInfo"
                    required
                    value={formData.companyInfo}
                    onChange={(e) => setFormData({ ...formData, companyInfo: e.target.value })}
                    placeholder="Provide detailed information about your company:
- Company name and industry
- Size and locations
- Technology stack and infrastructure
- Current security measures and tools
- Compliance certifications (if any)
- Data handling practices
- Security policies and procedures
- Any relevant security achievements or incidents"
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="questionnaire">Security Questionnaire *</Label>
                  <Textarea
                    id="questionnaire"
                    required
                    value={formData.questionnaire}
                    onChange={(e) => setFormData({ ...formData, questionnaire: e.target.value })}
                    placeholder="Paste the complete security questionnaire here. Include all questions that need to be answered. For example:

1. What encryption standards does your company use for data at rest?
2. Do you have a formal incident response plan in place?
3. How often do you conduct security training for employees?
4. What access control measures are implemented?
5. Do you perform regular security assessments?
..."
                    rows={12}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Filling Questionnaire...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Fill Security Questionnaire
                    </>
                  )}
                </Button>

                {isLoading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Filling security questionnaire...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Questionnaire Responses</CardTitle>
              <CardDescription>
                Your completed questionnaire responses will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {responses ? (
                <div className="space-y-4">
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription className="text-yellow-700">
                      <strong>Important:</strong> Please review all responses marked with "[REQUIRES REVIEW]" 
                      before submitting. These may need company-specific information or verification.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Responses
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadResponses}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border max-h-[600px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {responses}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill out the form and click "Fill Security Questionnaire" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}