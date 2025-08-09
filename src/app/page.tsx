"use client";

import { Shield, FileText, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: FileText,
      title: "Security Policy Generator",
      description: "Generate comprehensive security policies tailored to your organization",
      href: "/policy-generator",
    },
    {
      icon: CheckCircle,
      title: "Compliance Gap Analyzer",
      description: "Identify compliance gaps and get actionable remediation steps",
      href: "/compliance-analyzer",
    },
    {
      icon: Shield,
      title: "Questionnaire Assistant",
      description: "Auto-fill security questionnaires and vendor assessments",
      href: "/questionnaire-assistant",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              SecureGenie
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            AI-powered cybersecurity tools to streamline your governance, risk, and compliance processes
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={feature.href}>
                  <Button variant="outline" className="w-full group">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Demo Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">How SecureGenie Works</CardTitle>
            <CardDescription className="text-center">
              Three powerful tools to enhance your security posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="policy" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="policy">Policy Generator</TabsTrigger>
                <TabsTrigger value="compliance">Compliance Analyzer</TabsTrigger>
                <TabsTrigger value="questionnaire">Questionnaire Assistant</TabsTrigger>
              </TabsList>
              <TabsContent value="policy" className="mt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Generate Custom Security Policies</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Input your company details and get professionally crafted security policies 
                    covering governance, access control, data protection, and incident response.
                  </p>
                  <div className="flex justify-center">
                    <Link href="/policy-generator">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Try Policy Generator
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="compliance" className="mt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Analyze Compliance Gaps</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Describe your current setup and get detailed analysis of compliance gaps 
                    with prioritized remediation steps for frameworks like GDPR, SOX, and ISO 27001.
                  </p>
                  <div className="flex justify-center">
                    <Link href="/compliance-analyzer">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Try Compliance Analyzer
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="questionnaire" className="mt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Auto-Fill Security Questionnaires</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Upload security questionnaires and get professional responses based on 
                    your company information, saving hours of manual work.
                  </p>
                  <div className="flex justify-center">
                    <Link href="/questionnaire-assistant">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Try Questionnaire Assistant
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 text-slate-500 dark:text-slate-400">
          <p>Powered by AI • Built for Security Professionals</p>
        </div>
      </div>
    </div>
  );
}
