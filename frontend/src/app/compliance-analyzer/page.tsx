"use client";

import { useState } from "react";
import { CheckCircle, ArrowLeft, AlertTriangle, Loader2, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function ComplianceAnalyzer() {
  const [formData, setFormData] = useState({
    framework: "",
    currentSetup: "",
    industry: "",
  });
  const [analysis, setAnalysis] = useState("");
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
      const response = await fetch("http://localhost:5001/api/analyze-compliance", {
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
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Failed to analyze compliance");
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
    navigator.clipboard.writeText(analysis);
  };

  const downloadAnalysis = () => {
    const blob = new Blob([analysis], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance_gap_analysis_${formData.framework || "report"}.txt`;
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
            <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Compliance Gap Analyzer
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Identify compliance gaps and get actionable remediation steps
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Compliance Assessment</CardTitle>
              <CardDescription>
                Describe your current setup to analyze compliance gaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="framework">Compliance Framework *</Label>
                  <Select
                    required
                    value={formData.framework}
                    onValueChange={(value) => setFormData({ ...formData, framework: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select compliance framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GDPR">GDPR (General Data Protection Regulation)</SelectItem>
                      <SelectItem value="SOX">SOX (Sarbanes-Oxley Act)</SelectItem>
                      <SelectItem value="ISO-27001">ISO 27001</SelectItem>
                      <SelectItem value="HIPAA">HIPAA</SelectItem>
                      <SelectItem value="PCI-DSS">PCI DSS</SelectItem>
                      <SelectItem value="NIST">NIST Cybersecurity Framework</SelectItem>
                      <SelectItem value="SOC2">SOC 2</SelectItem>
                      <SelectItem value="CCPA">CCPA (California Consumer Privacy Act)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Financial Services</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currentSetup">Current Security Setup *</Label>
                  <Textarea
                    id="currentSetup"
                    required
                    value={formData.currentSetup}
                    onChange={(e) => setFormData({ ...formData, currentSetup: e.target.value })}
                    placeholder="Describe your current security measures, policies, tools, and processes. Include details about:
- Data handling and storage
- Access controls and authentication
- Security monitoring and logging
- Employee training programs
- Incident response procedures
- Third-party vendor management
- Physical security measures
- Documentation and policies"
                    rows={10}
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
                      Analyzing Compliance...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Analyze Compliance Gaps
                    </>
                  )}
                </Button>

                {isLoading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Analyzing compliance gaps...</span>
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
              <CardTitle>Compliance Gap Analysis</CardTitle>
              <CardDescription>
                Your detailed compliance assessment will appear here
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

              {analysis ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Analysis
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAnalysis}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border max-h-[600px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {analysis}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill out the form and click "Analyze Compliance Gaps" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}