import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

interface ScreenshotCaptureProps {
  onCapture?: (dataUrl: string) => void;
}

export const ScreenshotCapture = ({ onCapture }: ScreenshotCaptureProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const captureElement = async (elementId: string, filename: string) => {
    setIsCapturing(true);
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Element not found");
      }

      // Add a temporary class to improve screenshot quality
      element.classList.add("screenshot-capture");
      
      const canvas = await html2canvas(element, {
        backgroundColor: "#000000",
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        ignoreElements: (element) => {
          // Ignore screenshot buttons themselves
          return element.classList.contains("screenshot-button");
        }
      });

      // Remove temporary class
      element.classList.remove("screenshot-capture");

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      
      // Download the image
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Call callback if provided
      if (onCapture) {
        onCapture(dataUrl);
      }

      toast({
        title: "Screenshot captured!",
        description: `${filename} has been downloaded to your device.`,
      });

    } catch (error) {
      console.error("Screenshot capture failed:", error);
      toast({
        title: "Screenshot failed",
        description: "Failed to capture screenshot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const shareScreenshot = async (elementId: string, filename: string) => {
    setIsCapturing(true);
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Element not found");
      }

      element.classList.add("screenshot-capture");
      
      const canvas = await html2canvas(element, {
        backgroundColor: "#000000",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        ignoreElements: (element) => {
          return element.classList.contains("screenshot-button");
        }
      });

      element.classList.remove("screenshot-capture");

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png", 1.0);
      });

      if (navigator.share && navigator.canShare?.({ files: [new File([blob], `${filename}.png`, { type: "image/png" })] })) {
        const file = new File([blob], `${filename}.png`, { type: "image/png" });
        await navigator.share({
          title: `SaaS Tracker - ${filename}`,
          text: "Check out my SaaS progress!",
          files: [file],
        });
      } else {
        // Fallback to download
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Screenshot captured!",
          description: "Image downloaded since sharing is not available on this device.",
        });
      }

    } catch (error) {
      console.error("Screenshot share failed:", error);
      toast({
        title: "Screenshot failed",
        description: "Failed to capture screenshot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const screenshots = [
    {
      id: "progress-dashboard",
      name: "Progress Dashboard",
      description: "User & Revenue Growth with Performance Metrics"
    },
    {
      id: "insights-and-classic",
      name: "Insights & Classic View", 
      description: "Key Insights with Classic Progress Visualization"
    },
    {
      id: "advanced-metrics",
      name: "Advanced Metrics",
      description: "Business Intelligence & KPI Dashboard"
    },
    {
      id: "analytics-charts",
      name: "Analytics Charts",
      description: "Growth Trends & Historical Data"
    }
  ];

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Screenshot Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Capture and share specific sections of your SaaS dashboard
        </p>
        
        <div className="grid gap-3">
          {screenshots.map((screenshot) => (
            <div key={screenshot.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/20">
              <div className="space-y-1">
                <p className="font-medium">{screenshot.name}</p>
                <p className="text-xs text-muted-foreground">{screenshot.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => captureElement(screenshot.id, screenshot.name.toLowerCase().replace(/\s+/g, '-'))}
                  disabled={isCapturing}
                  className="screenshot-button"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => shareScreenshot(screenshot.id, screenshot.name.toLowerCase().replace(/\s+/g, '-'))}
                  disabled={isCapturing}
                  className="screenshot-button"
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {isCapturing && (
          <div className="flex items-center justify-center p-4">
            <Badge variant="outline" className="animate-pulse">
              Capturing screenshot...
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};