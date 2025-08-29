"use client";

import { useState, useEffect } from "react";
import { Shield, ArrowLeft, FileText, Loader2, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";

export default function PolicyGenerator() {
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    size: "",
    specificRequirements: "",
  });
  const [generatedPolicy, setGeneratedPolicy] = useState("");
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
      const response = await fetch(`${API_BASE_URL}/api/generate-policy`, {
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
        setGeneratedPolicy(data.policy);
      } else {
        setError(data.error || "Failed to generate policy");
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
    navigator.clipboard.writeText(generatedPolicy);
  };

  const downloadPolicy = () => {
    const blob = new Blob([generatedPolicy], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.companyName || "company"}_security_policy.txt`;
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
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Security Policy Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Generate comprehensive security policies tailored to your organization
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Provide details about your organization to generate a customized security policy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g., TechCorp Solutions, HealthCare Plus, FinanceSecure Inc."
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    required
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your industry (e.g., Technology, Healthcare, Finance)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Financial Services</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Company Size *</Label>
                  <Select
                    required
                    value={formData.size}
                    onValueChange={(value) => setFormData({ ...formData, size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your company size (affects policy complexity)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specificRequirements">Specific Requirements</Label>
                  <Textarea
                    id="specificRequirements"
                    value={formData.specificRequirements}
                    onChange={(e) => setFormData({ ...formData, specificRequirements: e.target.value })}
                    placeholder="Examples:&#10;• PCI DSS compliance for payment processing&#10;• HIPAA compliance for healthcare data&#10;• Remote work and BYOD device policies&#10;• Cloud infrastructure security (AWS, Azure, GCP)&#10;• SOX compliance for financial reporting&#10;• Multi-factor authentication requirements&#10;• Data retention and backup policies"
                    rows={6}
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
                      Generating Policy...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Generate Security Policy
                    </>
                  )}
                </Button>

                {isLoading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Generating your security policy...</span>
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
              <CardTitle>Generated Security Policy</CardTitle>
              <CardDescription>
                Your customized security policy will appear here
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

              {generatedPolicy ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadPolicy}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border max-h-[600px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {generatedPolicy}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill out the form and click "Generate Security Policy" to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}